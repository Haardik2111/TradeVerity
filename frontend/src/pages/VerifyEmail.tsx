import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MailCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your registered address';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-root)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-emerald-subtle)',
          border: '1px solid rgba(54, 185, 131, 0.4)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-emerald)',
          marginBottom: '18px'
        }}>
          <MailCheck size={28} />
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Verification Email Dispatched
        </h1>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          We have issued a verification link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Please confirm your email address to enable regulatory query and report generation privileges.
        </p>

        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontSize: '11.5px',
          color: 'var(--text-muted)',
          marginBottom: '26px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'left'
        }}>
          <ShieldCheck size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
          <span>
            Firebase ID token verification will activate your PostgreSQL user record upon first login.
          </span>
        </div>

        <Link to="/app/overview" className="btn btn-primary" style={{ width: '100%', padding: '10px 16px' }}>
          Continue to Investigation Radar <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
