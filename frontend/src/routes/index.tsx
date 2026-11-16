import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../layouts/AppLayout';

// Public Pages
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { VerifyEmail } from '../pages/VerifyEmail';
import { NotFound } from '../pages/NotFound';

// Authenticated Pages
import { OverviewRadar } from '../pages/OverviewRadar';
import { NewInvestigation } from '../pages/NewInvestigation';
import { InvestigationHistory } from '../pages/InvestigationHistory';
import { InvestigationDetails } from '../pages/InvestigationDetails';
import { FraudIntelligenceNetwork } from '../pages/FraudIntelligenceNetwork';
import { EntityVerification } from '../pages/EntityVerification';
import { ReportsMonitoring } from '../pages/ReportsMonitoring';
import { ReviewerWorkspace } from '../pages/ReviewerWorkspace';
import { SourceManagement } from '../pages/SourceManagement';
import { Settings } from '../pages/Settings';
import { Profile } from '../pages/Profile';

// Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; roleReq?: 'REVIEWER' | 'ADMIN' }> = ({ children, roleReq }) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-root)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-amber)',
        fontFamily: 'var(--font-mono)'
      }}>
        INITIALIZING SECURITY CONTEXT...
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (roleReq === 'ADMIN' && userProfile.role !== 'ADMIN') {
    return <Navigate to="/app/overview" replace />;
  }

  if (roleReq === 'REVIEWER' && userProfile.role === 'INVESTOR') {
    return <Navigate to="/app/overview" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/app/overview" replace />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Authenticated Application Shell */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/overview" replace />} />
        <Route path="overview" element={<OverviewRadar />} />
        <Route path="new-investigation" element={<NewInvestigation />} />
        <Route path="investigations" element={<InvestigationHistory />} />
        <Route path="investigations/:caseId" element={<InvestigationDetails />} />
        <Route path="intelligence-network" element={<FraudIntelligenceNetwork />} />
        <Route path="entity-verification" element={<EntityVerification />} />
        <Route path="reports" element={<ReportsMonitoring />} />
        
        {/* Role-protected workspaces */}
        <Route 
          path="review-workspace" 
          element={
            <ProtectedRoute roleReq="REVIEWER">
              <ReviewerWorkspace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="source-management" 
          element={
            <ProtectedRoute roleReq="ADMIN">
              <SourceManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Handler */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
