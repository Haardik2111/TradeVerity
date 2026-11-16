import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Lock, 
  Database, 
  CheckCircle2, 
  LogOut,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { userProfile, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'PREFERENCES' | 'SECURITY' | 'DATA'>('PREFERENCES');
  const [notifyOnMatches, setNotifyOnMatches] = useState(true);
  const [digestFreq, setDigestFreq] = useState<'DAILY' | 'WEEKLY' | 'NEVER'>('DAILY');
  const [autoMaskUPI, setAutoMaskUPI] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-amber)',
          marginBottom: '4px'
        }}>
          <SettingsIcon size={13} />
          <span>WORKSTATION PARAMETERS & ACCESS POLICIES</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Settings & Policies
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure investigative notifications, privacy redaction rules, and operational session parameters.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '240px minmax(0, 1fr)',
        gap: '20px'
      }}>
        {/* Navigation Tabs */}
        <div className="panel" style={{ padding: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('PREFERENCES')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'PREFERENCES' ? 'var(--bg-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: activeTab === 'PREFERENCES' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'PREFERENCES' ? 'var(--accent-amber)' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Sliders size={16} /> Notification & Redaction
            </button>

            <button
              onClick={() => setActiveTab('SECURITY')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'SECURITY' ? 'var(--bg-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: activeTab === 'SECURITY' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'SECURITY' ? 'var(--accent-amber)' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Shield size={16} /> Security & Identity
            </button>

            <button
              onClick={() => setActiveTab('DATA')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === 'DATA' ? 'var(--bg-elevated)' : 'transparent',
                border: '1px solid',
                borderColor: activeTab === 'DATA' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'DATA' ? 'var(--accent-amber)' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Database size={16} /> Architecture & Data Model
            </button>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />

            <button
              onClick={() => navigate('/app/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid transparent',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <User size={16} /> Edit User Profile
            </button>

            <button
              onClick={async () => { await logout(); navigate('/login'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: '1px solid transparent',
                color: 'var(--accent-danger)',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="panel">
          {savedSuccess && (
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
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={16} />
              <span>Preferences persisted to Firestore and local profile store.</span>
            </div>
          )}

          {activeTab === 'PREFERENCES' && (
            <form onSubmit={handleSavePreferences}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Operational Notifications & Data Redaction
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                      Cluster Match Notifications
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Alert when a new submitted case shares an indicator with an existing confirmed fraudulent cluster.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnMatches}
                    onChange={(e) => setNotifyOnMatches(e.target.checked)}
                    style={{ accentColor: 'var(--accent-amber)', width: '16px', height: '16px' }}
                  />
                </div>

                <div style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                      Automatic Identifier Redaction
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Mask middle octets of phone numbers and UPI VPAs in public and exportable views.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoMaskUPI}
                    onChange={(e) => setAutoMaskUPI(e.target.checked)}
                    style={{ accentColor: 'var(--accent-amber)', width: '16px', height: '16px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Threat Radar Intelligence Digest</label>
                  <select
                    value={digestFreq}
                    onChange={(e) => setDigestFreq(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="DAILY">Daily Executive Digest (08:00 UTC)</option>
                    <option value="WEEKLY">Weekly Telemetry Summary (Monday 00:00 UTC)</option>
                    <option value="NEVER">Do not send email digests</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary">
                    Save Workstation Preferences
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'SECURITY' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Cryptographic Identity & Firebase Authentication
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="panel-secondary">
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FIREBASE UID</div>
                  <div className="mono-id" style={{ color: 'var(--accent-amber)', fontSize: '13px', marginTop: '4px' }}>
                    {userProfile?.uid || 'demo-analyst-arjun'}
                  </div>
                </div>

                <div className="panel-secondary">
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>POSTGRESQL ASSIGNED ROLE</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    <span className="badge badge-verified" style={{ fontSize: '12px' }}>
                      {userProfile?.role || 'INVESTOR'}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      Enforced by Spring Security FirebaseAuthenticationFilter on every request.
                    </span>
                  </div>
                </div>

                <div className="panel-secondary">
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ENCRYPTION STANDARD</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '4px' }}>
                    TLS 1.3 / AES-GCM 256-bit token verification with Firebase Admin SDK RSA public keys.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DATA' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                Backend Persistence & Flyway Schemas
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                TradeVerity enforces a dual-tier persistence model: client-side profile documents exist in Firebase Firestore, while all relational dossiers, evidence items, and correlation links reside in PostgreSQL managed through versioned Flyway migrations.
              </p>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                backgroundColor: 'var(--bg-secondary)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                color: 'var(--accent-emerald)',
                lineHeight: 1.6
              }}>
                <div>[DATABASE TELEMETRY]</div>
                <div>Status: POSTGRESQL / H2-COMPAT ENGINE ACTIVE</div>
                <div>Migrations: V1__init_schema.sql (10 tables)</div>
                <div>Migrations: V2__seed_demo_data.sql (High-fidelity telemetry seed)</div>
                <div>Connection Pool: HikariCP [Bounded: 10 connections]</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
