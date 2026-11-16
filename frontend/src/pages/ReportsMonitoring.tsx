import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileBarChart2, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Printer
} from 'lucide-react';
import { api } from '../services/api';

export const ReportsMonitoring: React.FC = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState<Array<{
    reportId: string;
    caseId: string;
    entityName: string;
    riskBand: string;
    generatedAt: string;
    fileSize: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      // Fallback sample reports
      setReports([
        {
          reportId: 'REP-2026-8814-A',
          caseId: 'CRV-2026-8814',
          entityName: 'Apex Alpha Wealth Advisors',
          riskBand: 'HIGH_ATTENTION',
          generatedAt: '2026-11-16T19:02:00Z',
          fileSize: '245 KB'
        },
        {
          reportId: 'REP-2026-9137-A',
          caseId: 'CRV-2026-9137',
          entityName: 'ShareNidhi Online App',
          riskBand: 'HIGH_ATTENTION',
          generatedAt: '2026-11-16T17:48:00Z',
          fileSize: '310 KB'
        },
        {
          reportId: 'REP-2026-6419-A',
          caseId: 'CRV-2026-6419',
          entityName: 'BluePeak Capital India Advisory LLP',
          riskBand: 'LOW_INDICATORS',
          generatedAt: '2026-11-16T11:32:00Z',
          fileSize: '180 KB'
        },
        {
          reportId: 'REP-2026-5590-A',
          caseId: 'CRV-2026-5590',
          entityName: 'Vanguard Securities Global VIP Tips',
          riskBand: 'HIGH_ATTENTION',
          generatedAt: '2026-11-15T20:12:00Z',
          fileSize: '290 KB'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (caseId: string, reportId: string) => {
    setDownloadingId(reportId);
    try {
      const blob = await api.downloadReportPdf(caseId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TradeVerity-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Report PDF will be generated via the backend OpenPDF service.');
    } finally {
      setDownloadingId(null);
    }
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
            <FileBarChart2 size={13} />
            <span>EXECUTIVE DOSSIERS & AUDIT EXPORTS</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Reports & Monitoring
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Structured 10-point investigation reports generated with OpenPDF, complete with indicator citations and official registry disclaimers.
          </p>
        </div>

        <button 
          onClick={() => navigate('/app/new-investigation')}
          className="btn btn-primary"
        >
          + Generate New Report
        </button>
      </div>

      {/* Reports Table */}
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Available Forensic Dossiers
          </h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {reports.length} ARCHIVED
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tv-table">
            <thead>
              <tr>
                <th>REPORT ID</th>
                <th>CASE DOSSIER</th>
                <th>ENTITY UNDER REVIEW</th>
                <th>SCREENING BAND</th>
                <th>GENERATED DATE</th>
                <th>FILE SIZE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.reportId}>
                  <td className="mono-id" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                    {r.reportId}
                  </td>
                  <td>
                    <span 
                      onClick={() => navigate(`/app/investigations/${r.caseId}`)}
                      className="mono-id"
                      style={{ color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {r.caseId}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {r.entityName}
                  </td>
                  <td>
                    <span className={`badge ${
                      r.riskBand === 'HIGH_ATTENTION' ? 'badge-high' :
                      r.riskBand === 'LOW_INDICATORS' ? 'badge-low' : 'badge-review'
                    }`}>
                      {r.riskBand.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(r.generatedAt).toLocaleString()}
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {r.fileSize}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/app/investigations/${r.caseId}`)}
                        className="btn btn-sm btn-secondary"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => handleDownload(r.caseId, r.reportId)}
                        disabled={downloadingId === r.reportId}
                        className="btn btn-sm btn-outline-amber"
                      >
                        <Download size={13} /> {downloadingId === r.reportId ? 'Exporting...' : 'PDF'}
                      </button>
                    </div>
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
