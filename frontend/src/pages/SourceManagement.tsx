import React, { useState, useEffect } from 'react';
import { 
  Database, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  ShieldAlert,
  Edit,
  Power
} from 'lucide-react';
import { api } from '../services/api';
import { SourceRecord, SourceStatus } from '../types';

export const SourceManagement: React.FC = () => {
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('REGULATORY');
  const [newStatus, setNewStatus] = useState<SourceStatus>('CACHED');

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await api.getSources();
      setSources(data);
    } catch (err) {
      // Fallback initial sources
      setSources([
        {
          sourceId: 1,
          sourceCode: 'SEBI_REG',
          sourceName: 'SEBI Intermediary Registration Database',
          sourceUrl: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13',
          category: 'REGULATORY',
          dataFreshness: 'CACHED',
          status: 'CACHED',
          datasetVersion: 'v2026.11-DEMO',
          lastCheckedAt: '2026-11-16T18:00:00Z'
        },
        {
          sourceId: 2,
          sourceCode: 'RBI_SACHET',
          sourceName: 'RBI Sachet Fraud Reporting Repository',
          sourceUrl: 'https://sachet.rbi.org.in',
          category: 'REGULATORY',
          dataFreshness: 'CACHED',
          status: 'CACHED',
          datasetVersion: 'v2026.10-DEMO',
          lastCheckedAt: '2026-11-16T12:00:00Z'
        },
        {
          sourceId: 3,
          sourceCode: 'NSE_ALERTS',
          sourceName: 'NSE Unauthorized Scheme Warnings & Cautions',
          sourceUrl: 'https://www.nseindia.com/invest/caution-notices-against-unauthorized-schemes',
          category: 'REGULATORY',
          dataFreshness: 'LIVE',
          status: 'LIVE',
          datasetVersion: 'v2026.11-LIVE',
          lastCheckedAt: '2026-11-16T19:30:00Z'
        },
        {
          sourceId: 4,
          sourceCode: 'BSE_CAUTION',
          sourceName: 'BSE Caution Notices on Market Manipulation',
          sourceUrl: 'https://www.bseindia.com/investors/caution_investor.aspx',
          category: 'REGULATORY',
          dataFreshness: 'LIVE',
          status: 'LIVE',
          datasetVersion: 'v2026.11-LIVE',
          lastCheckedAt: '2026-11-16T19:25:00Z'
        },
        {
          sourceId: 5,
          sourceCode: 'CYBER_CRIME',
          sourceName: 'National Cyber Crime Reporting Coordination Feed',
          sourceUrl: 'https://cybercrime.gov.in',
          category: 'THREAT_FEED',
          dataFreshness: 'LIVE',
          status: 'LIVE',
          datasetVersion: 'v2026.10-PORTAL',
          lastCheckedAt: '2026-11-16T16:00:00Z'
        },
        {
          sourceId: 6,
          sourceCode: 'WHOIS_INTEL',
          sourceName: 'Global Domain RDAP & Fast-Flux Telemetry',
          sourceUrl: 'https://rdap.org',
          category: 'WHOIS_LOOKUP',
          dataFreshness: 'LIVE',
          status: 'LIVE',
          datasetVersion: 'v2026.11-RDAP',
          lastCheckedAt: '2026-11-16T20:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (src: SourceRecord) => {
    const nextStatus: SourceStatus = src.status === 'LIVE' ? 'UNAVAILABLE' : 'LIVE';
    try {
      await api.updateSource(src.sourceId, { status: nextStatus });
    } catch (e) {
      // Local fallback
    }
    setSources(prev => prev.map(s => s.sourceId === src.sourceId ? { ...s, status: nextStatus } : s));
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim() || !newUrl.trim()) return;

    try {
      const created = await api.addSource({
        sourceCode: newCode.trim(),
        sourceName: newName.trim(),
        sourceUrl: newUrl.trim(),
        category: newCategory,
        status: newStatus,
        dataFreshness: newStatus,
        datasetVersion: 'v2026.1'
      });
      setSources(prev => [created, ...prev]);
    } catch (e) {
      const mockNew: SourceRecord = {
        sourceId: Date.now(),
        sourceCode: newCode.trim(),
        sourceName: newName.trim(),
        sourceUrl: newUrl.trim(),
        category: newCategory,
        dataFreshness: newStatus,
        status: newStatus,
        datasetVersion: 'v2026.1',
        lastCheckedAt: new Date().toISOString()
      };
      setSources(prev => [mockNew, ...prev]);
    }

    setShowAddModal(false);
    setNewCode('');
    setNewName('');
    setNewUrl('');
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-amber)',
            marginBottom: '4px'
          }}>
            <Database size={13} />
            <span>AUTHORITATIVE SOURCE ARCHITECTURE</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Source Management (Admin)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Configure and audit regulatory feeds, public database connector endpoints, and caching intervals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <PlusCircle size={15} /> Add Intelligence Source
        </button>
      </div>

      {/* Sources Table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Configured Intelligence & Regulatory Providers
          </h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {sources.length} SOURCES ACTIVE
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tv-table">
            <thead>
              <tr>
                <th>CODE</th>
                <th>SOURCE NAME</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th>DATA FRESHNESS</th>
                <th>DATASET VERSION</th>
                <th>LAST AUDITED</th>
                <th style={{ textAlign: 'right' }}>CONTROLS</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.sourceId}>
                  <td className="mono-id" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                    {s.sourceCode}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.sourceName}
                    </div>
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                    >
                      {s.sourceUrl.substring(0, 40)}... <ExternalLink size={10} />
                    </a>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{s.category}</span>
                  </td>
                  <td>
                    <span className={`badge ${
                      s.status === 'LIVE' ? 'badge-verified' :
                      s.status === 'CACHED' ? 'badge-demo' :
                      s.status === 'DEMO' ? 'badge-demo' : 'badge-high'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {s.dataFreshness}
                  </td>
                  <td className="mono-id" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {s.datasetVersion}
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(s.lastCheckedAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleStatus(s)}
                      className="btn btn-sm btn-secondary"
                      title={s.status === 'LIVE' ? 'Disable Source' : 'Enable Source'}
                    >
                      <Power size={12} style={{ color: s.status === 'LIVE' ? 'var(--accent-emerald)' : 'var(--accent-danger)' }} />
                      {s.status === 'LIVE' ? 'Active' : 'Offline'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Register Authoritative Intelligence Source
            </h3>

            <form onSubmit={handleCreateSource}>
              <div className="form-group">
                <label className="form-label">Source Identifier Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MCX_MEMBERS, AMFI_REG"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Source Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Association of Mutual Funds in India"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Source URL / REST Endpoint</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.amfiindia.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Source Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="REGULATORY">REGULATORY (Official statutory index)</option>
                  <option value="THREAT_FEED">THREAT_FEED (Law enforcement warning)</option>
                  <option value="WHOIS_LOOKUP">WHOIS_LOOKUP (Domain telemetry)</option>
                  <option value="INTERNAL_CORRELATION">INTERNAL_CORRELATION (Peer reports)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="form-select"
                >
                  <option value="LIVE">LIVE (Direct connection)</option>
                  <option value="CACHED">CACHED (Static snapshot)</option>
                  <option value="DEMO">DEMO (Curated verification benchmark)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Source Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
