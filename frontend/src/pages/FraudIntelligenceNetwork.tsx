import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  Node, 
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Network, 
  ShieldAlert, 
  Download, 
  Search, 
  Filter, 
  Info, 
  ExternalLink, 
  Layers, 
  Radio, 
  Tag, 
  Share2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const FraudIntelligenceNetwork: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusParam = searchParams.get('focus') || '';

  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);
  const [clusterFilter, setClusterFilter] = useState('Alpha-ShantiNidhi Cluster');
  const [searchQuery, setSearchQuery] = useState(focusParam);

  // Initial High-Fidelity Graph matching the Stitch Screenshot
  const initialNodes: Node[] = useMemo(() => [
    {
      id: 'node-upi',
      type: 'default',
      position: { x: 380, y: 220 },
      data: { 
        label: 'dhanvridhi.pay@okfictiobank',
        entityType: 'UPI',
        riskBand: 'HIGH_ATTENTION',
        threatVector: 'Fast-Flux VPA Mule Account',
        reportsCount: 14,
        cluster: 'Alpha-ShantiNidhi Cluster',
        firstSeen: '12 Oct 2026',
        lastSeen: '16 Nov 2026',
        cases: ['CRV-2026-9137', 'CRV-2026-5590']
      },
      style: {
        background: '#121915',
        color: '#E27D42',
        border: '2px solid #E27D42',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '12px',
        fontFamily: 'IBM Plex Mono, monospace',
        boxShadow: '0 0 16px rgba(226, 125, 66, 0.3)',
        fontWeight: 600,
        width: 250
      }
    },
    {
      id: 'node-apk',
      type: 'default',
      position: { x: 120, y: 110 },
      data: { 
        label: 'sharenidhi-trading-apk.site',
        entityType: 'WEBSITE',
        riskBand: 'HIGH_ATTENTION',
        threatVector: 'Unregistered APK Direct Download',
        reportsCount: 9,
        cluster: 'Alpha-ShantiNidhi Cluster',
        firstSeen: '18 Oct 2026',
        lastSeen: '16 Nov 2026',
        cases: ['CRV-2026-9137']
      },
      style: {
        background: '#121915',
        color: '#D9685E',
        border: '1.5px solid #D9685E',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '11px',
        fontFamily: 'IBM Plex Mono, monospace',
        width: 220
      }
    },
    {
      id: 'node-phone',
      type: 'default',
      position: { x: 620, y: 90 },
      data: { 
        label: '+91 98765 ***** (Admin Contact)',
        entityType: 'PHONE',
        riskBand: 'HIGH_ATTENTION',
        threatVector: 'Telegram VIP Group Co-admin',
        reportsCount: 6,
        cluster: 'Alpha-ShantiNidhi Cluster',
        firstSeen: '05 Oct 2026',
        lastSeen: '15 Nov 2026',
        cases: ['CRV-2026-8814']
      },
      style: {
        background: '#121915',
        color: '#E27D42',
        border: '1.5px solid #E27D42',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '11px',
        fontFamily: 'IBM Plex Mono, monospace',
        width: 220
      }
    },
    {
      id: 'node-advisor',
      type: 'default',
      position: { x: 140, y: 350 },
      data: { 
        label: 'Apex Alpha Wealth Advisors',
        entityType: 'ADVISOR',
        riskBand: 'HIGH_ATTENTION',
        threatVector: 'Unverified RIA Impersonation',
        reportsCount: 5,
        cluster: 'Alpha-ShantiNidhi Cluster',
        firstSeen: '24 Oct 2026',
        lastSeen: '16 Nov 2026',
        cases: ['CRV-2026-8814']
      },
      style: {
        background: '#121915',
        color: '#E4EAE5',
        border: '1.5px solid #E27D42',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '11.5px',
        fontWeight: 600,
        width: 210
      }
    },
    {
      id: 'node-ria',
      type: 'default',
      position: { x: 400, y: 440 },
      data: { 
        label: 'INA00009871 (SEBI Mismatch)',
        entityType: 'ADVISOR',
        riskBand: 'HIGH_ATTENTION',
        threatVector: 'Mismatched Regulatory Identity',
        reportsCount: 4,
        cluster: 'Alpha-ShantiNidhi Cluster',
        firstSeen: '24 Oct 2026',
        lastSeen: '16 Nov 2026',
        cases: ['CRV-2026-8814']
      },
      style: {
        background: '#121915',
        color: '#D9685E',
        border: '1.5px solid #D9685E',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '11px',
        fontFamily: 'IBM Plex Mono, monospace',
        width: 210
      }
    },
    {
      id: 'node-legit',
      type: 'default',
      position: { x: 640, y: 340 },
      data: { 
        label: 'BluePeak Capital India (Legit)',
        entityType: 'WEBSITE',
        riskBand: 'LOW_INDICATORS',
        threatVector: 'Authentic Registered Intermediary',
        reportsCount: 1,
        cluster: 'Regulatory Benchmark',
        firstSeen: '16 Nov 2026',
        lastSeen: '16 Nov 2026',
        cases: ['CRV-2026-6419']
      },
      style: {
        background: '#121915',
        color: '#36B983',
        border: '1.5px solid #36B983',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: 600,
        width: 210
      }
    }
  ], []);

  const initialEdges: Edge[] = useMemo(() => [
    {
      id: 'e-apk-upi',
      source: 'node-apk',
      target: 'node-upi',
      label: 'Embedded Payment Target',
      animated: true,
      style: { stroke: '#E27D42', strokeWidth: 2 },
      labelStyle: { fill: '#9BA79F', fontSize: 10, fontFamily: 'IBM Plex Mono' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#E27D42' }
    },
    {
      id: 'e-phone-upi',
      source: 'node-phone',
      target: 'node-upi',
      label: 'Shared Fund Solicitations',
      animated: true,
      style: { stroke: '#E27D42', strokeWidth: 1.5 },
      labelStyle: { fill: '#9BA79F', fontSize: 10, fontFamily: 'IBM Plex Mono' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#E27D42' }
    },
    {
      id: 'e-advisor-apk',
      source: 'node-advisor',
      target: 'node-apk',
      label: 'Pushes App Download Link',
      style: { stroke: '#28352D', strokeWidth: 1.5 },
      labelStyle: { fill: '#9BA79F', fontSize: 10, fontFamily: 'IBM Plex Mono' }
    },
    {
      id: 'e-advisor-ria',
      source: 'node-advisor',
      target: 'node-ria',
      label: 'False Credentials Claim',
      style: { stroke: '#D9685E', strokeWidth: 2, strokeDasharray: '4,4' },
      labelStyle: { fill: '#D9685E', fontSize: 10, fontFamily: 'IBM Plex Mono' }
    },
    {
      id: 'e-legit-ria',
      source: 'node-legit',
      target: 'node-ria',
      label: 'Official Record Contrast',
      style: { stroke: '#36B983', strokeWidth: 1.5, strokeDasharray: '4,4' },
      labelStyle: { fill: '#36B983', fontSize: 10, fontFamily: 'IBM Plex Mono' }
    }
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Set default selected node
  useEffect(() => {
    setSelectedNodeData(initialNodes[0].data);
  }, [initialNodes]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

  return (
    <div className="page-wrapper" style={{ maxWidth: '100%' }}>
      {/* Top Threat Telemetry Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '16px'
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
            <Radio size={12} className="telemetry-pulse" />
            <span>FORENSIC GRAPH TELEMETRY | SUBSYS.04.12: D-49819-VOL</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Global Threat Radar & Intercept Stream
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Tactical graph analysis of syndicated investment scams, common payment endpoints, and lookalike domain clusters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => alert('Dossier exported to investigation vault.')}
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} /> Export Dossier
          </button>
          <button 
            onClick={() => navigate('/app/new-investigation')}
            className="btn btn-primary btn-sm"
          >
            + New Intercept Vector
          </button>
        </div>
      </div>

      {/* 4 Metric Pill Boxes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div className="panel" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>IDENTIFIED ENTITIES</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            142 <span style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>+12.4%</span>
          </div>
        </div>

        <div className="panel" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUSPICIOUS CAPITAL FLOW</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '2px' }}>
            ₹184.2M <span className="badge badge-high" style={{ fontSize: '9px', padding: '1px 4px' }}>FLAGGED</span>
          </div>
        </div>

        <div className="panel" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TARGETED VICTIMS</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            5.2k+ <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>HIGH / MED</span>
          </div>
        </div>

        <div className="panel" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FILTERING INTELLIGENCE</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '2px' }}>
            9,428 <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SIGNALS</span>
          </div>
        </div>
      </div>

      {/* Cluster Filter & Legend Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '10px 16px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIVE CLUSTER:</span>
          <span className="badge badge-demo" style={{ fontSize: '11px' }}>
            {clusterFilter} (14 entities)
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)' }} />
            <span>Verified Legal Entity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)' }} />
            <span>Reported Indicator</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-danger)' }} />
            <span>Critical / High-Attention</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ borderTop: '2px dashed #9BA79F', width: '14px' }} />
            <span>Inferred Relationship</span>
          </div>
        </div>
      </div>

      {/* Forensic Disclaimer Alert */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        backgroundColor: 'rgba(226, 125, 66, 0.08)',
        border: '1px solid rgba(226, 125, 66, 0.25)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11.5px',
        color: 'var(--text-secondary)',
        marginBottom: '16px'
      }}>
        <ShieldAlert size={15} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
        <span>
          <strong>IMPORTANT FORENSIC NOTICE:</strong> Graph displays co-reported indicators based on submitted evidence and technical telemetry. Relationships represent analytic correlation, not established legal guilt.
        </span>
      </div>

      {/* Main Grid: Interactive Canvas + Right-Hand Dossier Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 380px',
        gap: '16px',
        height: '620px'
      }}>
        {/* React Flow Canvas */}
        <div style={{
          backgroundColor: '#0A0F0C',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background color="#1A2820" gap={20} size={1} />
            <Controls style={{ backgroundColor: '#121915', borderColor: '#28352D' }} />
          </ReactFlow>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(11, 16, 13, 0.85)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            CLICK NODE TO INSPECT DOSSIER | SCROLL TO ZOOM
          </div>
        </div>

        {/* Right-Hand Entity Dossier Panel */}
        <div className="panel" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedNodeData ? (
            <>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    TARGET IDENTIFIER ({selectedNodeData.entityType})
                  </span>
                  <span className={`badge ${selectedNodeData.riskBand === 'HIGH_ATTENTION' ? 'badge-high' : 'badge-verified'}`}>
                    {selectedNodeData.riskBand?.replace('_', ' ')}
                  </span>
                </div>
                <div className="mono-id" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedNodeData.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  First Seen: {selectedNodeData.firstSeen} | Last Seen: {selectedNodeData.lastSeen}
                </div>
              </div>

              {/* Threat Vector */}
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--accent-amber)'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  THREAT VECTOR / HEURISTIC
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {selectedNodeData.threatVector}
                </div>
              </div>

              {/* Dossier Summary Stats */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  DOSSIER METRICS
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px'
                }}>
                  <div className="panel-secondary" style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>REPORTS LINKED</div>
                    <div className="mono-id" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-amber)' }}>
                      {selectedNodeData.reportsCount}
                    </div>
                  </div>
                  <div className="panel-secondary" style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ASSOCIATED DOSSIERS</div>
                    <div className="mono-id" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedNodeData.cases?.length || 1}
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Cases */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  ASSOCIATED CASE DOSSIERS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedNodeData.cases?.map((cId: string) => (
                    <div
                      key={cId}
                      onClick={() => navigate(`/app/investigations/${cId}`)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span className="mono-id" style={{ color: 'var(--accent-amber)', fontSize: '12px' }}>
                        {cId}
                      </span>
                      <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Forensic Notes */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  FORENSIC OBSERVATIONS
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Telemetry indicates repeated routing through WhatsApp investment blast campaigns. APK file signature matches unverified third-party financial build.
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => alert(`Node ${selectedNodeData.label} flagged for active monitoring.`)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Mark Node Linked
                </button>
                <button
                  onClick={() => alert('Exporting node telemetry dossier.')}
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={14} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              Select any graph node to inspect telemetry details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
