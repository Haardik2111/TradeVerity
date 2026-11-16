import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { api } from '../services/api';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  idToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Built-in default demo analyst profile matching the approved Stitch screenshot: "Arjun Mehta — RedTeam"
const DEFAULT_DEMO_USER: UserProfile = {
  uid: 'demo-analyst-arjun',
  displayName: 'Arjun Mehta',
  email: 'arjun.mehta@tradeverity.internal',
  role: 'REVIEWER',
  status: 'ACTIVE',
  createdAt: '2026-01-15T09:00:00Z',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  onboardingComplete: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tv_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_DEMO_USER;
  });
  const [idToken, setIdToken] = useState<string | null>(() => localStorage.getItem('tv_id_token'));
  const [loading, setLoading] = useState(true);

  // Sync token to API service
  useEffect(() => {
    api.setToken(idToken);
  }, [idToken]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        try {
          const token = await user.getIdToken();
          setIdToken(token);
          localStorage.setItem('tv_id_token', token);
          api.setToken(token);

          // Bootstrap / sync user with backend
          try {
            const profile = await api.bootstrapUser({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Investor User',
              role: 'INVESTOR'
            });
            setUserProfile(profile);
            localStorage.setItem('tv_user_profile', JSON.stringify(profile));
          } catch (err) {
            // Local fallback profile
            const fallback: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'Investor User',
              email: user.email || '',
              role: 'INVESTOR',
              status: 'ACTIVE',
              createdAt: new Date().toISOString()
            };
            setUserProfile(fallback);
            localStorage.setItem('tv_user_profile', JSON.stringify(fallback));
          }
        } catch (tokenErr) {
          console.warn('Error fetching token:', tokenErr);
        }
      } else {
        setFirebaseUser(null);
        // If not using live firebase user, keep demo profile for inspection
        if (!localStorage.getItem('tv_user_profile')) {
          setUserProfile(DEFAULT_DEMO_USER);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const token = await cred.user.getIdToken();
      setIdToken(token);
      localStorage.setItem('tv_id_token', token);
      api.setToken(token);

      const profile = await api.bootstrapUser({
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || email.split('@')[0]
      });
      setUserProfile(profile);
      localStorage.setItem('tv_user_profile', JSON.stringify(profile));
    } catch (err: any) {
      // In offline / preview sandbox mode, allow simulated login
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/network-request-failed' || !import.meta.env.VITE_FIREBASE_API_KEY) {
        const simulatedProfile: UserProfile = {
          uid: 'uid_' + Math.random().toString(36).substring(2, 9),
          displayName: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'ADMIN' : email.includes('analyst') ? 'REVIEWER' : 'INVESTOR',
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        };
        setUserProfile(simulatedProfile);
        localStorage.setItem('tv_user_profile', JSON.stringify(simulatedProfile));
        setIdToken('simulated_jwt_token_' + simulatedProfile.uid);
        return;
      }
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      const token = await res.user.getIdToken();
      setIdToken(token);
      localStorage.setItem('tv_id_token', token);
      api.setToken(token);

      const profile = await api.bootstrapUser({
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || 'Google User'
      });
      setUserProfile(profile);
      localStorage.setItem('tv_user_profile', JSON.stringify(profile));
    } catch (err: any) {
      console.error('Google sign in error:', err);
      throw err;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await fbUpdateProfile(cred.user, { displayName: name });
        await sendEmailVerification(cred.user);
        const token = await cred.user.getIdToken();
        setIdToken(token);
        localStorage.setItem('tv_id_token', token);
        api.setToken(token);

        const profile = await api.bootstrapUser({
          uid: cred.user.uid,
          email,
          displayName: name,
          role: 'INVESTOR'
        });
        setUserProfile(profile);
        localStorage.setItem('tv_user_profile', JSON.stringify(profile));
      }
    } catch (err: any) {
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/network-request-failed' || !import.meta.env.VITE_FIREBASE_API_KEY) {
        const simulatedProfile: UserProfile = {
          uid: 'uid_' + Math.random().toString(36).substring(2, 9),
          displayName: name,
          email,
          role: 'INVESTOR',
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        };
        setUserProfile(simulatedProfile);
        localStorage.setItem('tv_user_profile', JSON.stringify(simulatedProfile));
        setIdToken('simulated_jwt_token_' + simulatedProfile.uid);
        return;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    setFirebaseUser(null);
    setUserProfile(null);
    setIdToken(null);
    localStorage.removeItem('tv_user_profile');
    localStorage.removeItem('tv_id_token');
    api.setToken(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const switchDemoRole = (role: UserRole) => {
    if (userProfile) {
      const updated = { ...userProfile, role };
      setUserProfile(updated);
      localStorage.setItem('tv_user_profile', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      userProfile,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      resetPassword,
      switchDemoRole,
      idToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
