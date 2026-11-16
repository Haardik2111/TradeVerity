import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FilePlus2, 
  UploadCloud, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  FileCheck,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { InvestigationCategory, EvidenceItem } from '../types';

export const NewInvestigation: React.FC = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<InvestigationCategory>('Trading Application');
  const [entityName, setEntityName] = useState('');
  const [claimedOrg, setClaimedOrg] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [summaryNarrative, setSummaryNarrative] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Evidence Attachments
  const [evidenceList, setEvidenceList] = useState<Array<{
    type: EvidenceItem['evidenceType'];
    raw: string;
    fileName?: string;
  }>>([]);
  const [customEvidenceRaw, setCustomEvidenceRaw] = useState('');
  const [customEvidenceType, setCustomEvidenceType] = useState<EvidenceItem['evidenceType']>('URL');

  const categories: InvestigationCategory[] = [
    'Trading Application',
    'Website or URL',
    'Investment Advisor',
    'Broker Impersonation',
    'Suspicious Message',
    'Social Media Campaign',
    'Phone Number / Contact',
    'Payment Identifier',
    'Other'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'txt', 'csv'];
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (!ext || !validExtensions.includes(ext)) {
        setError('Unsupported file type. Only PDF, PNG, JPG, TXT, and CSV are permitted.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds the 10 MB limit.');
        return;
      }

      const fileEvidenceType = ext === 'pdf' || ext === 'csv' || ext === 'txt' ? 'DOCUMENT' : 'SCREENSHOT';
      setEvidenceList(prev => [
        ...prev,
        {
          type: fileEvidenceType,
          raw: `Uploaded file: ${file.name} (${Math.round(file.size / 1024)} KB)`,
          fileName: file.name
        }
      ]);
    }
  };

  const handleAddEvidenceItem = () => {
    if (!customEvidenceRaw.trim()) return;
    setEvidenceList(prev => [
      ...prev,
      {
        type: customEvidenceType,
        raw: customEvidenceRaw.trim()
      }
    ]);
    setCustomEvidenceRaw('');
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!entityName.trim()) {
      setError('Please provide the entity or application name.');
      return;
    }

    if (!summaryNarrative.trim()) {
      setError('Please provide an investigation narrative explaining why this activity is suspicious.');
      return;
    }

    setSubmitting(true);

    try {
      const newCase = await api.submitCase({
        entityName: entityName.trim(),
        category,
        claimedOrg: claimedOrg.trim() || undefined,
        registrationNo: registrationNo.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        contactInfo: contactInfo.trim() || undefined,
        summaryNarrative: summaryNarrative.trim(),
        evidence: evidenceList.map(item => ({
          evidenceType: item.type,
          rawValue: item.raw,
          sourceOrigin: 'Investigator Direct Submission'
        }))
      });

      // Trigger asynchronous rule-based analysis
      await api.triggerAnalysis(newCase.caseId).catch(() => {});

      // Navigate to detailed case investigation
      navigate(`/app/investigations/${newCase.caseId}`);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-amber)',
            marginBottom: '4px'
          }}>
            <FilePlus2 size={13} />
            <span>CASE INGESTION & HEURISTIC SCREENING</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Start New Investigation
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Submit suspicious investment information for structured verification, indicator extraction, and fraud network correlation.
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: 'var(--accent-danger-subtle)',
            border: '1px solid rgba(217, 104, 94, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-danger)',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Investigation Category */}
          <div className="panel" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
              1. Select Investigation Category
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '10px'
            }}>
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-amber)' : 'var(--border-color)',
                      color: isSelected ? 'var(--accent-amber)' : 'var(--text-secondary)',
                      textAlign: 'left',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Dynamic Form Fields */}
          <div className="panel" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
              2. Entity Details ({category})
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Entity / App / Advisor Name *</span>
                  <span style={{ color: 'var(--text-muted)' }}>Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="e.g. Apex Wealth Pro, ShareNidhi App, or Advisor Profile"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Claimed Organization / Broker</span>
                </label>
                <input
                  type="text"
                  value={claimedOrg}
                  onChange={(e) => setClaimedOrg(e.target.value)}
                  placeholder="e.g. Apex Capital Markets / BluePeak"
                  className="form-input"
                />
              </div>

              {(category === 'Investment Advisor' || category === 'Broker Impersonation' || category === 'Trading Application') && (
                <div className="form-group">
                  <label className="form-label">
                    <span>Claimed SEBI / RIA / Broker Registration Number</span>
                  </label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="e.g. INA00009871, INZ000214838"
                    className="form-input"
                  />
                </div>
              )}

              {(category === 'Website or URL' || category === 'Trading Application' || category === 'Social Media Campaign') && (
                <div className="form-group">
                  <label className="form-label">
                    <span>Website URL or Download Source</span>
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://suspicious-trading-site.online"
                    className="form-input"
                  />
                </div>
              )}

              {(category === 'Phone Number / Contact' || category === 'Suspicious Message' || category === 'Payment Identifier') && (
                <div className="form-group">
                  <label className="form-label">
                    <span>Phone, Telegram Handle, or UPI VPA</span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or dhanvridhi.pay@okfictiobank"
                    className="form-input"
                  />
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label className="form-label">
                <span>Reason for Suspicion & Narrative Details *</span>
                <span style={{ color: 'var(--text-muted)' }}>Plain-language observations</span>
              </label>
              <textarea
                required
                rows={4}
                value={summaryNarrative}
                onChange={(e) => setSummaryNarrative(e.target.value)}
                placeholder="Describe how contact was made, claims of guaranteed profit percentages, requests for remote access or APK installations, or demands to remit deposits to private UPI identifiers..."
                className="form-textarea"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Section 3: Evidence Submission & File Upload */}
          <div className="panel" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              3. Evidence Collection & Normalization
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Add supporting URLs, screenshots, message transcripts, or UPI identifiers for cross-report correlation.
            </p>

            {/* Manual Evidence Item Input */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '16px'
            }}>
              <select
                value={customEvidenceType}
                onChange={(e) => setCustomEvidenceType(e.target.value as any)}
                className="form-select"
                style={{ width: '180px' }}
              >
                <option value="URL">URL / Domain</option>
                <option value="PAYMENT_UPI">UPI / VPA Handle</option>
                <option value="PHONE_NUMBER">Phone / WhatsApp</option>
                <option value="MESSAGE_TEXT">Message Snippet</option>
                <option value="REGISTRATION_NO">Registration Number</option>
              </select>

              <input
                type="text"
                value={customEvidenceRaw}
                onChange={(e) => setCustomEvidenceRaw(e.target.value)}
                placeholder="Enter evidence value (e.g. payment VPA, channel link, phone number)..."
                className="form-input"
                style={{ flex: 1, minWidth: '240px' }}
              />

              <button
                type="button"
                onClick={handleAddEvidenceItem}
                className="btn btn-secondary"
              >
                + Add Indicator
              </button>
            </div>

            {/* File Upload Drop Area */}
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
                onChange={handleFileUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <UploadCloud size={32} style={{ color: 'var(--accent-amber)', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Drag & drop evidence files or <span style={{ color: 'var(--accent-amber)' }}>browse workstation</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Permitted: PDF, PNG, JPG, TXT, CSV (Max 10 MB per attachment). Executables are strictly disallowed.
              </div>
            </div>

            {/* Evidence List Preview */}
            {evidenceList.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  ATTACHED EVIDENCE INDICATORS ({evidenceList.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {evidenceList.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {item.raw}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEvidence(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-danger)',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '10px'
          }}>
            <button
              type="button"
              onClick={() => navigate('/app/overview')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '13.5px' }}
            >
              {submitting ? 'Triggering Heuristic Engine...' : 'Analyze Submission'}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
