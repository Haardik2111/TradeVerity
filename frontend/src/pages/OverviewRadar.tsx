import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Filter, 
  PlusCircle,
  FileText,
  Radio,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CaseReport, DashboardMetrics } from '../types';

export const OverviewRadar: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [cases, setCases] = useState<CaseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [instantVerifyInput, setInstantVerifyInput] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsData, casesData] = await Promise.all([
        api.getDashboardMetrics().catch(() => null),
        api.getCases().catch(() => [])
      ]);

      if (metricsData) {
        setMetrics(metricsData);
      } else {
        // Fallback default matching the Stitch screenshot
        setMetrics({
          totalInvestigations: 1284,
          highAttentionCases: 318,
          verifiedEntities: 842,
          pendingReviews: 612,
          threatDistribution: {
            whatsappTelegram: 538,
            unregisteredUpiApps: 361,
            fraudulentRIA: 231,
            deceptivePortals: 154
          },
          recentActivities: [
            {
              id: 'ACT-1',
              type: 'INVESTIGATION_SUBMITTED',
              title: 'Telegram Threat Vector Reported',
              detail: 'Case CRV-2026-8814 flagged for 35% weekly ROI claim',
              timestamp: '2m ago',
              badge: 'NEW CASE'
            },
            {
              id: 'ACT-2',
              type: 'VERIFICATION_COMPLETED',
              title: 'Regulatory Registry Mismatch Detected',
              detail: 'INA00009871 does not resolve to Apex Alpha in database',
              timestamp: '14m ago',
              badge: 'MISMATCH'
            },
            {
              id: 'ACT-3',
              type: 'RELATIONSHIP_DETECTED',
              title: 'Co-reported UPI Identified in App APK',
              detail: 'dhanvridhi.pay linked across 14 distinct submissions',
              timestamp: '32m ago',
              badge: 'CLUSTER'
            },
            {
              id: 'ACT-4',
              type: 'REPORT_GENERATED',
              title: 'Evidence Dossier Compiled',
              detail: 'Automated 12-point regulatory audit exported as PDF',
              timestamp: '1h ago',
              badge: 'REPORT'
            }
          ]
        });
      }

      setCases(casesData.length > 0 ? casesData : [
        {
          caseId: 'CRV-2026-8814',
          entityName: 'Apex Alpha Wealth Advisors',
          category: 'Investment Advisor',
          claimedOrg: 'Apex Capital Markets',
          registrationNo: 'INA00009871 (Claimed)',
          websiteUrl: 'https://apexalpha-invest.online',
          contactInfo: '+91 98765 43210',
          summaryNarrative: 'Telegram channel promising 35% weekly returns with unregistered RIA claim.',
          status: 'COMPLETED',
          riskBand: 'HIGH_ATTENTION',
          riskScore: 88,
          evidenceConfidence: 'HIGH',
          relationshipConfidence: 'HIGH',
          isDemo: true,
          createdAt: '2026-11-16T18:30:00Z',
          updatedAt: '2026-11-16T19:00:00Z'
        },
        {
          caseId: 'CRV-2026-9137',
          entityName: 'ShareNidhi Online App',
          category: 'Trading Application',
          claimedOrg: 'ShareNidhi FinTech Pvt Ltd',
          registrationNo: 'UNREGISTERED',
          websiteUrl: 'https://sharenidhi-trading-apk.site',
          contactInfo: 'dhanvridhi.pay@okfictiobank',
          summaryNarrative: 'Direct APK download instructing transfer to personal UPI account.',
          status: 'NEEDS_REVIEW',
          riskBand: 'HIGH_ATTENTION',
          riskScore: 92,
          evidenceConfidence: 'HIGH',
          relationshipConfidence: 'HIGH',
          isDemo: true,
          createdAt: '2026-11-16T17:15:00Z',
          updatedAt: '2026-11-16T17:45:00Z'
        },
        {
          caseId: 'CRV-2026-7201',
          entityName: 'Kisan Samriddhi Mutual Syndicate',
          category: 'Social Media Campaign',
          claimedOrg: 'Samriddhi Agro Equity',
          registrationNo: 'UNREGISTERED',
          websiteUrl: 'https://samriddhi-kisan-wealth.in',
          contactInfo: '+91 91234 56789',
          summaryNarrative: 'Agricultural derivative investment scheme on Instagram.',
          status: 'NEEDS_REVIEW',
          riskBand: 'NEEDS_REVIEW',
          riskScore: 64,
          evidenceConfidence: 'MEDIUM',
          relationshipConfidence: 'HIGH',
          isDemo: true,
          createdAt: '2026-11-16T14:20:00Z',
          updatedAt: '2026-11-16T15:00:00Z'
        },
        {
          caseId: 'CRV-2026-6419',
          entityName: 'BluePeak Capital India Advisory LLP',
          category: 'Stock Broker',
          claimedOrg: 'BluePeak Capital LLP',
          registrationNo: 'INZ000214838',
          websiteUrl: 'https://bluepeakcapital.in',
          contactInfo: 'support@bluepeakcapital.in',
          summaryNarrative: 'Verification check for legitimate onboarding correspondence.',
          status: 'COMPLETED',
          riskBand: 'LOW_INDICATORS',
          riskScore: 12,
          evidenceConfidence: 'HIGH',
          relationshipConfidence: 'HIGH',
          isDemo: true,
          createdAt: '2026-11-16T11:00:00Z',
          updatedAt: '2026-11-16T11:30:00Z'
        },
        {
          caseId: 'CRV-2026-5590',
          entityName: 'Vanguard Securities Global VIP Tips',
          category: 'Broker Impersonation',
          claimedOrg: 'Vanguard Group (Impersonated)',
          registrationNo: 'MISMATCH_REF',
          websiteUrl: 'https://vanguard-vip-india.cc',
          contactInfo: '+91 88990 01122',
          summaryNarrative: 'Impersonating multinational fund manager via deceptive clone site.',
          status: 'COMPLETED',
          riskBand: 'HIGH_ATTENTION',
          riskScore: 95,
          evidenceConfidence: 'HIGH',
          relationshipConfidence: 'HIGH',
          isDemo: true,
          createdAt: '2026-11-15T19:40:00Z',
          updatedAt: '2026-11-15T20:10:00Z'
        }
      ]);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (instantVerifyInput.trim()) {
      navigate(`/app/entity-verification?q=${encodeURIComponent(instantVerifyInput.trim())}`);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = quickSearch === '' || 
      c.entityName.toLowerCase().includes(quickSearch.toLowerCase()) ||
      c.caseId.toLowerCase().includes(quickSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(quickSearch.toLowerCase());
    
    const matchesRisk = filterRisk === 'ALL' || c.riskBand === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="page-wrapper">
      {/* Page Header */}
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
            color: 'var(--accent-emerald)',
            marginBottom: '4px'
          }}>
            <Radio size={12} className="telemetry-pulse" />
            <span>SURVEILLANCE SECTOR: ASIA-PACIFIC / SEBI REGION</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            Good morning, {userProfile?.displayName?.split(' ')[0] || 'Investigator'} — Threat Radar
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '780px' }}>
            Your financial intelligence workspace. Review incoming signals, inspect potential fraudulent syndicates, and verify financial intermediaries against public references.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/app/reports')}
            className="btn btn-secondary"
          >
            <FileText size={15} /> Export Daily Digest
          </button>
          <button 
            onClick={() => navigate('/app/new-investigation')}
            className="btn btn-primary"
          >
            <PlusCircle size={15} /> New Investigation
          </button>
        </div>
      </div>

      {/* Global Quick Search Bar */}
      <div style={{
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '22px'
      }}>
        <Search size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
        <input
          type="text"
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          placeholder="QUICK SEC-ID / INVESTIGATION ENGINE: Identify entities, registration codes, domains, UPI VPAs or case IDs..."
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            width: '100%',
            outline: 'none'
          }}
        />
        <span className="badge badge-demo" style={{ flexShrink: 0 }}>DEMO TELEMETRY</span>
      </div>

      {/* Four Metric Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Metric 1 */}
        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">INVESTIGATIONS ARCHIVED</span>
            <span style={{ color: 'var(--accent-emerald)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>+14 TODAY</span>
          </div>
          <div className="stat-value">{metrics?.totalInvestigations.toLocaleString() || '1,284'}</div>
          <div className="stat-sub">
            <span style={{ color: 'var(--accent-emerald)' }}>98.2%</span> processed with explainable rules
          </div>
        </div>

        {/* Metric 2 */}
        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">HIGH-ATTENTION CASES</span>
            <span style={{ color: 'var(--accent-danger)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>URGENT</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-danger)' }}>
            {metrics?.highAttentionCases.toLocaleString() || '318'}
          </div>
          <div className="stat-sub">
            <span style={{ color: 'var(--accent-danger)' }}>78</span> flagged for payment redirect
          </div>
        </div>

        {/* Metric 3 */}
        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">VERIFIED ENTITIES</span>
            <span style={{ color: 'var(--accent-emerald)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>OFFICIAL</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {metrics?.verifiedEntities.toLocaleString() || '842'}
          </div>
          <div className="stat-sub">
            <span>Validated against regulatory registry</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">PENDING REVIEWS</span>
            <span style={{ color: 'var(--accent-amber)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>REDTEAM</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            {metrics?.pendingReviews.toLocaleString() || '612'}
          </div>
          <div className="stat-sub">
            <span>Awaiting human analyst confirmation</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Intercepts Pool & Right-Hand Widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 360px',
        gap: '20px'
      }}>
        {/* Left Column: Live Intercepts Table */}
        <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} style={{ color: 'var(--accent-amber)' }} />
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Live Intercepts & Regulatory Alert Pool
                </h2>
                <span className="badge badge-demo">DEMO</span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Real-time queue of ingested investment claims, APK links and Telegram channels.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {(['ALL', 'HIGH_ATTENTION', 'NEEDS_REVIEW', 'LOW_INDICATORS'] as const).map((band) => (
                <button
                  key={band}
                  onClick={() => setFilterRisk(band)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '4px',
                    background: filterRisk === band ? 'var(--bg-elevated)' : 'transparent',
                    border: '1px solid',
                    borderColor: filterRisk === band ? 'var(--accent-amber)' : 'var(--border-subtle)',
                    color: filterRisk === band ? 'var(--accent-amber)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {band === 'ALL' ? 'ALL' : band.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="tv-table">
              <thead>
                <tr>
                  <th>ENTITY / CASE ID</th>
                  <th>CATEGORY</th>
                  <th>SCREENING BAND</th>
                  <th>STATUS</th>
                  <th>TIMESTAMP</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => {
                  const isHigh = c.riskBand === 'HIGH_ATTENTION';
                  const isLow = c.riskBand === 'LOW_INDICATORS';
                  return (
                    <tr 
                      key={c.caseId}
                      onClick={() => navigate(`/app/investigations/${c.caseId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                          {c.entityName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span className="mono-id" style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>
                            {c.caseId}
                          </span>
                          {c.isDemo && <span className="badge badge-demo" style={{ fontSize: '9px', padding: '1px 4px' }}>DEMO</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                          {c.category}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isHigh ? 'badge-high' : isLow ? 'badge-low' : 'badge-review'}`}>
                          {c.riskBand.replace('_', ' ')}
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
                          Inspect <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: 'var(--text-muted)'
          }}>
            <span>Showing {filteredCases.length} of {cases.length} active intelligence records</span>
            <button 
              onClick={() => navigate('/app/investigations')} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-amber)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Full Archive Archive <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Widget 1: Instant Entity Verification */}
          <div className="panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Instant Entity Verification
              </h3>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
              Cross-reference RIA registration numbers, broker member codes or domain identities against official references.
            </p>

            <form onSubmit={handleInstantVerify}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  value={instantVerifyInput}
                  onChange={(e) => setInstantVerifyInput(e.target.value)}
                  placeholder="e.g. INA00009871 or BluePeak"
                  className="form-input"
                  style={{ width: '100%', fontSize: '12.5px' }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-outline-amber"
                style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
              >
                Run Official Reference Search <ArrowUpRight size={14} />
              </button>
            </form>
          </div>

          {/* Widget 2: Threat Distribution by Medium */}
          <div className="panel">
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Threat Distribution by Medium</span>
              <span className="badge badge-demo">DEMO</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>WhatsApp / Telegram Channels</span>
                  <span className="mono-id" style={{ color: 'var(--accent-amber)' }}>42% (538)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '42%', height: '100%', backgroundColor: 'var(--accent-amber)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Distributed UPI & Cloned Apps</span>
                  <span className="mono-id" style={{ color: 'var(--accent-danger)' }}>28% (361)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '28%', height: '100%', backgroundColor: 'var(--accent-danger)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Fraudulent RIA & Impersonation</span>
                  <span className="mono-id" style={{ color: 'var(--accent-emerald)' }}>18% (231)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '18%', height: '100%', backgroundColor: 'var(--accent-emerald)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Deceptive Investment Portals</span>
                  <span className="mono-id" style={{ color: 'var(--accent-info)' }}>12% (154)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '12%', height: '100%', backgroundColor: 'var(--accent-info)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: Recent Defense Activity */}
          <div className="panel">
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Recent Defense Activity</span>
              <RefreshCw size={13} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={loadDashboardData} />
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {metrics?.recentActivities.map((act) => (
                <div 
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-amber)',
                    marginTop: '5px',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {act.title}
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {act.timestamp}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {act.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
