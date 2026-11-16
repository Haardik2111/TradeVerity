import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  FilePlus2, 
  History, 
  Network, 
  ShieldCheck, 
  FileBarChart2, 
  UserCheck, 
  Database, 
  Settings, 
  LogOut, 
  Shield, 
  Radio, 
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const Sidebar: React.FC = () => {
  const { userProfile, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview Radar', path: '/app/overview', icon: Activity },
    { name: 'New Investigation', path: '/app/new-investigation', icon: FilePlus2 },
    { name: 'Investigation History', path: '/app/investigations', icon: History },
    { name: 'Fraud Intelligence Network', path: '/app/intelligence-network', icon: Network },
    { name: 'Entity Verification', path: '/app/entity-verification', icon: ShieldCheck },
    { name: 'Reports & Monitoring', path: '/app/reports', icon: FileBarChart2 },
    { name: 'Reviewer Workspace', path: '/app/review-workspace', icon: UserCheck, roleReq: 'REVIEWER' },
    { name: 'Source Management', path: '/app/source-management', icon: Database, roleReq: 'ADMIN' },
    { name: 'Settings', path: '/app/settings', icon: Settings }
  ];

  const currentRole = userProfile?.role || 'INVESTOR';

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#080C0A',
            boxShadow: '0 0 12px var(--accent-amber-glow)'
          }}>
            <Shield size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '0.4px',
              color: 'var(--text-primary)'
            }}>
              Trade<span style={{ color: 'var(--accent-amber)' }}>Verity</span>
            </div>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.5px',
              fontFamily: 'var(--font-mono)'
            }}>
              OBSIDIAN RADAR v2.4
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 6px',
          borderRadius: '4px',
          background: 'rgba(54, 185, 131, 0.12)',
          color: 'var(--accent-emerald)',
          fontSize: '9.5px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600
        }}>
          <Radio size={10} className="telemetry-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{
          padding: '0 8px 6px',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          fontFamily: 'var(--font-mono)'
        }}>
          INVESTIGATION SUITE
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          // Check role restrictions
          if (item.roleReq === 'ADMIN' && currentRole !== 'ADMIN') return null;
          if (item.roleReq === 'REVIEWER' && currentRole === 'INVESTOR') return null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12.5px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-amber)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                textDecoration: 'none'
              })}
            >
              <Icon 
                size={16} 
                style={{ 
                  color: 'inherit',
                  flexShrink: 0
                }} 
              />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Role Switcher Demo Helper */}
      <div style={{
        padding: '8px 14px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DEMO ROLE:</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['INVESTOR', 'REVIEWER', 'ADMIN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchDemoRole(r)}
              style={{
                background: currentRole === r ? 'var(--accent-amber)' : 'var(--bg-elevated)',
                color: currentRole === r ? '#0B100D' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                padding: '2px 5px',
                fontSize: '9.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title={`Switch simulation role to ${r}`}
            >
              {r[0]}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-sidebar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div 
          onClick={() => navigate('/app/profile')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            minWidth: 0
          }}
          title="Open Profile"
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-amber)',
            fontWeight: 600,
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt={userProfile.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={16} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {userProfile?.displayName || 'Arjun Mehta'}
            </div>
            <div style={{
              fontSize: '10.5px',
              color: 'var(--accent-emerald)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500
            }}>
              {currentRole}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
