import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Activity, ShieldAlert, Download, RefreshCw, Bell } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {/* Top Telemetry Header */}
        <header className="telemetry-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>FORENSIC RADAR TELEMETRY</span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--accent-amber)' }}>SUBSYS.04.12: D-49819-VOL</span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span className="telemetry-tag">
              <span className="telemetry-pulse"></span>
              SURVEILLANCE NODE #08
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>
              SEC-LAYER: <span style={{ color: 'var(--accent-emerald)' }}>ISOLATED TLS/256</span>
            </span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <button
              onClick={() => navigate('/app/new-investigation')}
              className="btn btn-sm btn-primary"
            >
              + NEW INVESTIGATION
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
