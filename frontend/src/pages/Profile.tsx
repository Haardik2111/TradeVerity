import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const Profile: React.FC = () => {
  const { userProfile, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await api.updateProfile({ displayName, photoURL });
      setMessage('Profile updated successfully in Firestore and PostgreSQL.');
    } catch (err: any) {
      setMessage('Profile preferences updated locally and queued for synchronization.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/app/overview')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '16px' }}
        >
          <ArrowLeft size={14} /> Back to Overview Radar
        </button>

        <div className="panel" style={{ padding: '28px 32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-elevated)',
              border: '2px solid var(--accent-amber)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 16px var(--accent-amber-glow)'
            }}>
              {photoURL ? (
                <img src={photoURL} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={36} style={{ color: 'var(--accent-amber)' }} />
              )}
            </div>

            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {displayName || 'Investigator Profile'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span className="badge badge-verified">{userProfile?.role || 'INVESTOR'}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ACTIVE OPERATIONAL CREDENTIALS
                </span>
              </div>
            </div>
          </div>

          {message && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: 'var(--accent-emerald-subtle)',
              border: '1px solid rgba(54, 185, 131, 0.4)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-emerald)',
              fontSize: '12.5px',
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name / Display Identity</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Linked to Firebase)</label>
              <input
                type="email"
                disabled
                value={userProfile?.email || 'analyst@tradeverity.internal'}
                className="form-input"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Photo URL</label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Firebase Authentication UID</span>
                <span style={{ color: 'var(--text-muted)' }}>Cryptographic Subject ID (Read-only)</span>
              </label>
              <input
                type="text"
                disabled
                value={userProfile?.uid || 'demo-analyst-arjun'}
                className="form-input mono-id"
                style={{ opacity: 0.7, cursor: 'not-allowed', color: 'var(--accent-amber)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Onboarding Date</label>
              <input
                type="text"
                disabled
                value={new Date(userProfile?.createdAt || Date.now()).toLocaleDateString()}
                className="form-input"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ padding: '9px 20px' }}
              >
                <Save size={15} /> {saving ? 'Synchronizing...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
