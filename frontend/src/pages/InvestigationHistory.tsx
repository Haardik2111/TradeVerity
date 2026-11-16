import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpRight, 
  PlusCircle, 
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { CaseReport, InvestigationCategory, RiskBand, CaseStatus } from '../types';

export const InvestigationHistory: React.FC = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState<CaseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await api.getCases();
      setCases(data);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      search === '' ||
      c.entityName.toLowerCase().includes(search.toLowerCase()) ||
      c.caseId.toLowerCase().includes(search.toLowerCase()) ||
      (c.claimedOrg && c.claimedOrg.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesRisk = selectedRisk === 'ALL' || c.riskBand === selectedRisk;

    return matchesSearch && matchesCategory && matchesStatus && matchesRisk;
  });

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = filteredCases.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
            <History size={13} />
            <span>CASE LEDGER & AUDIT TRAIL</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Investigation History
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Permanent record of submitted dossiers, algorithmic risk assessments, and evidence correlations.
          </p>
        </div>

        <button 
          onClick={() => navigate('/app/new-investigation')}
          className="btn btn-primary"
        >
          <PlusCircle size={15} /> Start New Investigation
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="panel" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by ID, entity, or claimed broker..."
              className="form-input"
              style={{ width: '100%', paddingLeft: '32px' }}
            />
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="form-select"
          >
            <option value="ALL">All Categories</option>
            <option value="Trading Application">Trading Application</option>
            <option value="Website or URL">Website or URL</option>
            <option value="Investment Advisor">Investment Advisor</option>
            <option value="Broker Impersonation">Broker Impersonation</option>
            <option value="Suspicious Message">Suspicious Message</option>
            <option value="Social Media Campaign">Social Media Campaign</option>
            <option value="Phone Number / Contact">Phone Number / Contact</option>
            <option value="Payment Identifier">Payment Identifier</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
            className="form-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="FAILED">Failed</option>
          </select>

          {/* Risk Band Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => { setSelectedRisk(e.target.value); setPage(1); }}
            className="form-select"
          >
            <option value="ALL">All Screening Bands</option>
            <option value="HIGH_ATTENTION">High Attention</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="LOW_INDICATORS">Low Indicators</option>
          </select>
        </div>
      </div>

      {/* Main Cases Table */}
      <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px' }} />
            <div>Loading investigation records from PostgreSQL...</div>
          </div>
        ) : paginatedCases.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <FileText size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
              No Investigations Found
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              No cases match your active search filters.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="tv-table">
              <thead>
                <tr>
                  <th>INVESTIGATION ID</th>
                  <th>ENTITY / ORGANIZATION</th>
                  <th>CATEGORY</th>
                  <th>SCREENING BAND</th>
                  <th>RISK SCORE</th>
                  <th>CURRENT STATUS</th>
                  <th>SUBMITTED DATE</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCases.map((c) => {
                  const isHigh = c.riskBand === 'HIGH_ATTENTION';
                  const isLow = c.riskBand === 'LOW_INDICATORS';

                  return (
                    <tr
                      key={c.caseId}
                      onClick={() => navigate(`/app/investigations/${c.caseId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <span className="mono-id" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                          {c.caseId}
                        </span>
                        {c.isDemo && (
                          <span className="badge badge-demo" style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 4px' }}>
                            DEMO
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {c.entityName}
                        </div>
                        {c.claimedOrg && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Claims: {c.claimedOrg}
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {c.category}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isHigh ? 'badge-high' : isLow ? 'badge-low' : 'badge-review'}`}>
                          {c.riskBand.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className="mono-id" style={{
                          fontWeight: 600,
                          color: isHigh ? 'var(--accent-danger)' : isLow ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                        }}>
                          {c.riskScore}/100
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: c.status === 'COMPLETED' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                        }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/investigations/${c.caseId}`);
                          }}
                          className="btn btn-sm btn-secondary"
                        >
                          View Dossier <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div>
            Showing {filteredCases.length === 0 ? 0 : (page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredCases.length)} of {filteredCases.length} records
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="btn btn-sm btn-secondary"
              style={{ opacity: page <= 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="btn btn-sm btn-secondary"
              style={{ opacity: page >= totalPages ? 0.5 : 1 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
