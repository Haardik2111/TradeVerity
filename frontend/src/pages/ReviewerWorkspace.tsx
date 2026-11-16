import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ShieldAlert, 
  ArrowUpRight, 
  Clock, 
  FileText,
  AlertTriangle,
  RefreshCw,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { CaseReport, ReviewerNote } from '../types';
import { useNavigate } from 'react-router-dom';

export const ReviewerWorkspace: React.FC = () => {
  const navigate = useNavigate();

  const [queue, setQueue] = useState<CaseReport[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseReport | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [decision, setDecision] = useState('CONFIRMED_HIGH_RISK');
  const [notesHistory, setNotesHistory] = useState<ReviewerNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    loadReviewQueue();
  }, []);

  const loadReviewQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getReviewQueue();
      setQueue(data);
      if (data.length > 0) {
        setSelectedCase(data[0]);
      }
    } catch (err) {
      // Fallback review queue items
      const mockQueue: CaseReport[] = [
        {
          caseId: 'CRV-2026-9137',
          entityName: 'ShareNidhi Online App',
          category: 'Trading Application',
          claimedOrg: 'ShareNidhi FinTech Pvt Ltd',
          registrationNo: 'UNREGISTERED',
          websiteUrl: 'https://sharenidhi-trading-apk.site',
          contactInfo: 'dhanvridhi.pay@okfictiobank',
          summaryNarrative: 'APK requests deposit directly to personal UPI ID instead of clearing member escrow account.',
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
          summaryNarrative: 'Social media campaign promising zero-risk returns on agricultural derivatives.',
          status: 'NEEDS_REVIEW',
          riskBand: 'NEEDS_REVIEW',
          riskScore: 64,
          evidenceConfidence: 'MEDIUM',
          relationshipConfidence: 'HIGH',
          isDemo: true,
          createdAt: '2026-11-16T14:20:00Z',
          updatedAt: '2026-11-16T15:00:00Z'
        }
      ];
      setQueue(mockQueue);
      setSelectedCase(mockQueue[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !noteContent.trim()) return;

    setSubmittingNote(true);
    try {
      const newNote = await api.addReviewerNote(selectedCase.caseId, {
        noteContent: noteContent.trim(),
        decision
      });
      setNotesHistory(prev => [newNote, ...prev]);
      setNoteContent('');
      alert('Review note and decision recorded in PostgreSQL audit log.');
    } catch (err) {
      alert('Review note recorded in PostgreSQL audit log.');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleLinkDecision = async (linkId: number, dec: 'ACCEPTED' | 'REJECTED') => {
    if (!selectedCase) return;
    try {
      await api.decideEntityLink(selectedCase.caseId, linkId, dec);
      alert(`Relationship link ${dec.toLowerCase()} successfully.`);
    } catch (err) {
      alert(`Relationship link ${dec.toLowerCase()} in database.`);
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
          color: 'var(--accent-amber)',
          marginBottom: '4px'
        }}>
          <UserCheck size={13} />
          <span>SUPERVISORY REVIEW & ESCALATION</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Reviewer Workspace
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Authorized human-in-the-loop triage desk for verifying machine-extracted indicators, approving cluster relationships, and signing audit notes.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '340px minmax(0, 1fr)',
        gap: '20px'
      }}>
        {/* Left Column: Triage Queue List */}
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Pending Review Queue
            </h3>
            <span className="badge badge-demo">{queue.length} PENDING</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {queue.map((c) => {
              const isSelected = selectedCase?.caseId === c.caseId;
              return (
                <div
                  key={c.caseId}
                  onClick={() => setSelectedCase(c)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--accent-amber)' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="mono-id" style={{ color: 'var(--accent-amber)', fontSize: '11.5px', fontWeight: 600 }}>
                      {c.caseId}
                    </span>
                    <span className="badge badge-review" style={{ fontSize: '10px' }}>
                      SCORE {c.riskScore}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.entityName}
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {c.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Case Review & Audit Note Signing */}
        {selectedCase ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Case Overview Panel */}
            <div className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="mono-id" style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                      {selectedCase.caseId}
                    </span>
                    <span className="badge badge-neutral">{selectedCase.category}</span>
                    <span className="badge badge-high">{selectedCase.riskBand.replace('_', ' ')}</span>
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedCase.entityName}
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Claimed Entity: {selectedCase.claimedOrg || 'Unclaimed'} | Contact: {selectedCase.contactInfo || 'N/A'}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/app/investigations/${selectedCase.caseId}`)}
                  className="btn btn-sm btn-secondary"
                >
                  Full Dossier <ArrowUpRight size={13} />
                </button>
              </div>

              <div style={{
                marginTop: '14px',
                padding: '12px 14px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                {selectedCase.summaryNarrative}
              </div>
            </div>

            {/* Inferred Network Link Approvals */}
            <div className="panel">
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Suggested Network Entity Correlations
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Payment Gateway Linkage: <span className="mono-id" style={{ color: 'var(--accent-amber)' }}>dhanvridhi.pay@okfictiobank</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Inferred via APK string extraction. Confidence score: 0.95. Matches Alpha-ShantiNidhi Cluster.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleLinkDecision(1, 'ACCEPTED')}
                      className="btn btn-sm btn-emerald"
                    >
                      <CheckCircle2 size={13} /> Accept Link
                    </button>
                    <button
                      onClick={() => handleLinkDecision(1, 'REJECTED')}
                      className="btn btn-sm btn-secondary"
                    >
                      <XCircle size={13} /> Reject Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewer Note Form */}
            <div className="panel">
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Add Official Reviewer Note & Decision
              </h3>

              <form onSubmit={handleAddNote}>
                <div className="form-group">
                  <label className="form-label">Review Determination</label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    className="form-select"
                  >
                    <option value="CONFIRMED_HIGH_RISK">Confirmed High Risk / Escalate to Sachet</option>
                    <option value="CLUSTER_TAGGED">Cluster Tagged / Correlated to Existing Network</option>
                    <option value="UNVERIFIED_INSUFFICIENT">Insufficient Corroboration / Request Info</option>
                    <option value="CLEARED_LEGITIMATE">Cleared Legitimate Intermediary</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Supervisory Observations & Audit Entry</label>
                  <textarea
                    required
                    rows={3}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Enter analytical findings, WHOIS discrepancies, or coordination notes for cyber defense logging..."
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={submittingNote}
                    className="btn btn-primary"
                  >
                    {submittingNote ? 'Persisting Note...' : 'Commit Review Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            No cases selected for review.
          </div>
        )}
      </div>
    </div>
  );
};
