import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Database,
  ExternalLink,
  RefreshCw,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { VerificationCheck, VerificationOutcome } from '../types';

export const EntityVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('Investment Advisor');
  const [provider, setProvider] = useState('SEBI_REG');
  const [history, setHistory] = useState<VerificationCheck[]>([]);
  const [activeResult, setActiveResult] = useState<VerificationCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const loadHistory = async () => {
    try {
      const data = await api.getVerificationHistory();
      setHistory(data);
    } catch (err) {
      // Fallback sample history
      setHistory([
        {
          checkId: 101,
          entityIdentifier: 'INA00009871',
          providerName: 'SEBI Intermediary Registry Provider',
          outcome: 'INFORMATION_MISMATCH',
          explanation: 'Registration number INA00009871 is active in reference records, but assigned to a registered entity in Mumbai with different legal identity than "Apex Alpha".',
          isDemo: true,
          checkedAt: '2026-11-16T18:45:00Z'
        },
        {
          checkId: 102,
          entityIdentifier: 'INZ000214838',
          providerName: 'SEBI Intermediary Registry Provider',
          outcome: 'VERIFIED_REFERENCE',
          explanation: 'Registration code verified. BluePeak Capital India holds active Stock Broker member credentials on NSE and BSE.',
          isDemo: true,
          checkedAt: '2026-11-16T11:20:00Z'
        },
        {
          checkId: 103,
          entityIdentifier: 'ShareNidhi FinTech Pvt Ltd',
          providerName: 'SEBI Intermediary Registry Provider',
          outcome: 'NO_MATCH_FOUND',
          explanation: 'No record found under Stock Broker, Investment Advisor, or Research Analyst classifications.',
          isDemo: true,
          checkedAt: '2026-11-16T17:30:00Z'
        }
      ]);
    }
  };

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await api.runVerification({
        entityIdentifier: q.trim(),
        category,
        provider
      });
      setActiveResult(res);
      setHistory(prev => [res, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Verification provider request failed.');
    } finally {
      setLoading(false);
    }
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
          color: 'var(--accent-emerald)',
          marginBottom: '4px'
        }}>
          <ShieldCheck size={13} />
          <span>REGULATORY PROVIDER ORCHESTRATION</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Entity Verification
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Query official public registries and exchange caution lists to verify registration claims, intermediary licensing and domain provenance.
        </p>
      </div>

      {/* Query Formulation Form */}
      <div className="panel" style={{ marginBottom: '24px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 200px 220px auto',
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                <span>Entity Name, Registration Code or Domain</span>
                <span style={{ color: 'var(--text-muted)' }}>e.g. INA00009871, BluePeak</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search advisor, broker, intermediary or registration number..."
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '34px' }}
                />
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Intermediary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
                style={{ width: '100%' }}
              >
                <option value="Investment Advisor">Investment Advisor</option>
                <option value="Stock Broker">Stock Broker</option>
                <option value="Research Analyst">Research Analyst</option>
                <option value="Trading Application">Trading Application</option>
                <option value="Website">Website</option>
                <option value="Other Intermediary">Other Intermediary</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Verification Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="form-select"
                style={{ width: '100%' }}
              >
                <option value="SEBI_REG">SEBI Intermediary Registry</option>
                <option value="RBI_SACHET">RBI Sachet Fraud Portal</option>
                <option value="NSE_ALERTS">NSE Caution Notice Index</option>
                <option value="WHOIS_INTEL">RDAP Domain Telemetry</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ height: '37px', padding: '0 20px' }}
            >
              {loading ? 'Querying...' : 'Verify Entity'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Verification Result Card */}
      {activeResult && (
        <div className="panel" style={{
          marginBottom: '24px',
          borderLeft: `4px solid ${
            activeResult.outcome === 'VERIFIED_REFERENCE' ? 'var(--accent-emerald)' :
            activeResult.outcome === 'INFORMATION_MISMATCH' ? 'var(--accent-danger)' :
            'var(--accent-amber)'
          }`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="mono-id" style={{ color: 'var(--accent-amber)', fontSize: '13px', fontWeight: 600 }}>
                  {activeResult.entityIdentifier}
                </span>
                <span className={`badge ${
                  activeResult.outcome === 'VERIFIED_REFERENCE' ? 'badge-verified' :
                  activeResult.outcome === 'INFORMATION_MISMATCH' ? 'badge-high' :
                  'badge-review'
                }`}>
                  {activeResult.outcome.replace(/_/g, ' ')}
                </span>
                {activeResult.isDemo && <span className="badge badge-demo">DEMO / CACHED</span>}
              </div>

              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {activeResult.providerName}
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                {activeResult.explanation}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Timestamp: {new Date(activeResult.checkedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Historical Verification Queries Table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Verification Audit Checks
          </h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {history.length} CHECKS LOGGED
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tv-table">
            <thead>
              <tr>
                <th>TARGET IDENTIFIER</th>
                <th>PROVIDER CHECKED</th>
                <th>OUTCOME</th>
                <th>EXPLANATION</th>
                <th>DATA FRESHNESS</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={item.checkId || idx}>
                  <td className="mono-id" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                    {item.entityIdentifier}
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                    {item.providerName}
                  </td>
                  <td>
                    <span className={`badge ${
                      item.outcome === 'VERIFIED_REFERENCE' ? 'badge-verified' :
                      item.outcome === 'INFORMATION_MISMATCH' ? 'badge-high' :
                      'badge-review'
                    }`}>
                      {item.outcome.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px', maxWidth: '400px' }}>
                    {item.explanation}
                  </td>
                  <td>
                    <span className="badge badge-demo">
                      {item.isDemo ? 'DEMO / CACHED' : 'LIVE'}
                    </span>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(item.checkedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
