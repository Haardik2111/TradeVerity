import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ExternalLink, 
  Shield, 
  Info,
  ChevronRight,
  Database,
  Lock,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { CaseReport, EvidenceItem, RiskAssessment, VerificationCheck, ReviewerNote } from '../types';

export const InvestigationDetails: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [caseReport, setCaseReport] = useState<CaseReport | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [verifications, setVerifications] = useState<VerificationCheck[]>([]);
  const [notes, setNotes] = useState<ReviewerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (caseId) {
      loadCaseData(caseId);
    }
  }, [caseId]);

  const loadCaseData = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getCaseById(id);
      setCaseReport(data.caseReport);
      setEvidence(data.evidence);
      setAssessments(data.assessments);
      setVerifications(data.verificationChecks);
      setNotes(data.reviewerNotes);
    } catch (err) {
      console.error('Failed to load case details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!caseId) return;
    setDownloadingPdf(true);
    try {
      const blob = await api.downloadReportPdf(caseId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TradeVerity-Dossier-${caseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('PDF generation endpoint will complete via backend service.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Retrieving Case Telemetry #{caseId}...
        </div>
      </div>
    );
  }

  if (!caseReport) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Investigation Not Found</h2>
        <button onClick={() => navigate('/app/investigations')} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          Back to History
        </button>
      </div>
    );
  }

  const isHigh = caseReport.riskBand === 'HIGH_ATTENTION';
  const isLow = caseReport.riskBand === 'LOW_INDICATORS';

  return (
    <div className="page-wrapper">
      {/* Top Navigation Back Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate('/app/investigations')}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={14} /> Back to History
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate(`/app/intelligence-network?focus=${encodeURIComponent(caseReport.entityName)}`)}
            className="btn btn-secondary btn-sm"
          >
            <Share2 size={14} /> View in Intelligence Network
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="btn btn-primary btn-sm"
          >
            <Download size={14} /> {downloadingPdf ? 'Exporting PDF...' : 'Download Official PDF Dossier'}
          </button>
        </div>
      </div>

      {/* Case Header Banner */}
      <div className="panel" style={{ marginBottom: '22px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="mono-id" style={{ fontSize: '13px', color: 'var(--accent-amber)', fontWeight: 600 }}>
                {caseReport.caseId}
              </span>
              <span className="badge badge-neutral">{caseReport.category}</span>
              {caseReport.isDemo && <span className="badge badge-demo">DEMO CASE</span>}
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: caseReport.status === 'COMPLETED' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
              }}>
                STATUS: {caseReport.status}
              </span>
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {caseReport.entityName}
            </h1>

            {caseReport.claimedOrg && (
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Claimed Financial Institution: <strong style={{ color: 'var(--text-primary)' }}>{caseReport.claimedOrg}</strong>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '6px'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Ingested: {new Date(caseReport.createdAt).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Last Verified: {new Date(caseReport.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Narrative Box */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '3px solid var(--accent-amber)',
          fontSize: '12.5px',
          color: 'var(--text-primary)',
          lineHeight: 1.5
        }}>
          <strong style={{ color: 'var(--accent-amber)' }}>Reported Narrative: </strong>
          {caseReport.summaryNarrative}
        </div>
      </div>

      {/* 3-Dimensional Assessment Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '22px'
      }}>
        {/* Dimension 1: Screening Band */}
        <div className="panel" style={{ borderLeft: `4px solid ${isHigh ? 'var(--accent-danger)' : isLow ? 'var(--accent-emerald)' : 'var(--accent-amber)'}` }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            DIMENSION 1: SCREENING BAND
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: isHigh ? 'var(--accent-danger)' : isLow ? 'var(--accent-emerald)' : 'var(--accent-amber)', margin: '6px 0 2px' }}>
            {caseReport.riskBand.replace('_', ' ')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Score: <span className="mono-id">{caseReport.riskScore}/100</span> based on explainable indicators
          </div>
        </div>

        {/* Dimension 2: Evidence Confidence */}
        <div className="panel" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            DIMENSION 2: EVIDENCE CONFIDENCE
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
            {caseReport.evidenceConfidence} CONFIDENCE
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Evaluated from {evidence.length} corroborated raw indicators
          </div>
        </div>

        {/* Dimension 3: Relationship Confidence */}
        <div className="panel" style={{ borderLeft: '4px solid var(--accent-info)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            DIMENSION 3: RELATIONSHIP CONFIDENCE
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
            {caseReport.relationshipConfidence} CORRELATION
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Matches existing cluster nodes & shared contact telemetry
          </div>
        </div>
      </div>

      {/* Investigation Timeline */}
      <div className="panel" style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Verification Pipeline Timeline
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowX: 'auto',
          paddingBottom: '8px',
          gap: '12px'
        }}>
          {[
            { step: '1. Ingestion', status: 'COMPLETED' },
            { step: '2. Normalization', status: 'COMPLETED' },
            { step: '3. Rule Analysis', status: 'COMPLETED' },
            { step: '4. Source Check', status: 'COMPLETED' },
            { step: '5. Correlation', status: 'COMPLETED' },
            { step: '6. Report Ready', status: 'COMPLETED' }
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                fontSize: '11.5px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600
              }}>
                ✓ {item.step}
              </div>
              {idx < 5 && <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Explainable Findings Section */}
      <div className="panel" style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Explainable Heuristic Findings ({assessments.length})
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Transparent rules evaluated by the Java backend engine. Findings specify exact rationale without black-box conclusions.
            </p>
          </div>
          <span className="badge badge-demo">RULE ENGINE v1.0</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assessments.map((item) => (
            <div
              key={item.assessmentId || item.ruleId}
              style={{
                padding: '14px 16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                borderLeft: `4px solid ${item.severity === 'HIGH' ? 'var(--accent-danger)' : 'var(--accent-amber)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="mono-id" style={{ color: 'var(--accent-amber)', fontSize: '11px', fontWeight: 600 }}>
                    {item.ruleId}
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                    {item.ruleName}
                  </span>
                </div>
                <span className={`badge ${item.severity === 'HIGH' ? 'badge-high' : 'badge-review'}`}>
                  {item.severity}
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {item.explanation}
              </div>

              {item.evidenceRef && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>EVIDENCE REFERENCE:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{item.evidenceRef}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Verification Outcome */}
      <div className="panel" style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Official Reference Cross-Checks
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {verifications.map((v) => (
            <div
              key={v.checkId}
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {v.providerName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {v.explanation}
                </div>
              </div>
              <span className={`badge ${v.outcome === 'VERIFIED_REFERENCE' ? 'badge-verified' : 'badge-high'}`}>
                {v.outcome.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Items Ledger */}
      <div className="panel" style={{ marginBottom: '22px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Collected Evidence Items & Masked Identifiers
        </h3>
        <table className="tv-table">
          <thead>
            <tr>
              <th>TYPE</th>
              <th>SUBMITTED VALUE (MASKED)</th>
              <th>NORMALIZED IDENTIFIER</th>
              <th>SOURCE ORIGIN</th>
              <th>VERIFICATION STATE</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((ev) => (
              <tr key={ev.evidenceId}>
                <td><span className="badge badge-neutral">{ev.evidenceType}</span></td>
                <td className="mono-id" style={{ color: 'var(--accent-amber)' }}>
                  {ev.maskedValue || ev.rawValue}
                </td>
                <td className="mono-id" style={{ color: 'var(--text-muted)' }}>
                  {ev.normalizedValue || ev.rawValue}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{ev.sourceOrigin}</td>
                <td>
                  <span className="badge badge-verified">{ev.verificationState}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Responsible Investor Guidance & Disclaimer */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'rgba(226, 125, 66, 0.08)',
        border: '1px solid rgba(226, 125, 66, 0.3)',
        borderRadius: 'var(--radius-md)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        lineHeight: 1.6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 600, marginBottom: '6px' }}>
          <ShieldAlert size={16} /> RESPONSIBLE INVESTOR GUIDANCE & SYSTEM DISCLAIMER
        </div>
        <div>
          TradeVerity evaluates heuristic risk indicators and public reference databases. A screening band of <strong>HIGH ATTENTION</strong> indicates that claims (such as guaranteed returns or unverified RIA credentials) deviate from regulatory standards, but does not constitute a legal or criminal determination. Always verify intermediaries via official SEBI registries and avoid transferring capital to unverified personal UPI accounts.
        </div>
      </div>
    </div>
  );
};
