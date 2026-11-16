import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-root)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '440px',
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-danger-subtle)',
          border: '1px solid rgba(217, 104, 94, 0.4)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-danger)',
          marginBottom: '16px'
        }}>
          <ShieldAlert size={28} />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          404 — Vector Not Found
        </h1>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
          The requested surveillance route or investigation identifier does not exist within the current security domain.
        </p>

        <Link to="/app/overview" className="btn btn-primary" style={{ width: '100%', padding: '10px 16px' }}>
          <ArrowLeft size={16} /> Return to Threat Radar
        </Link>
      </div>
    </div>
  );
};
