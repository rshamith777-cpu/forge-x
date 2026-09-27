import React, { useState } from 'react';
import { 
  Layers, AlertOctagon, CheckCircle2, Clock, GitCompare, ArrowRight, 
  Zap, AlertTriangle, Activity, FileText, ExternalLink, RefreshCw
} from 'lucide-react';
import { useOrgData } from '../../context/OrgDataContext';

export interface ObserveWorkflowViewProps {
  onNavigateToDecide?: () => void;
  onNavigateToTwin?: () => void;
  onNavigateToIngestion?: () => void;
}

export const ObserveWorkflowView: React.FC<ObserveWorkflowViewProps> = ({
  onNavigateToDecide,
  onNavigateToTwin,
  onNavigateToIngestion
}) => {
  const { isLoaded, workflows, datasetSummary, generateDemoOrganization } = useOrgData();

  const [selectedWorkflowIndex, setSelectedWorkflowIndex] = useState<number>(0);
  const [highlightDeviations, setHighlightDeviations] = useState<boolean>(true);

  if (!isLoaded) {
    return (
      <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(6, 12, 24, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '48px 32px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#f43f5e'
          }}>
            <Layers size={32} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>
            No organizational data loaded
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Workflow discovery requires operational event traces to mine empirical execution paths. Please upload data or generate a demo organization.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateToIngestion}
              style={{
                padding: '11px 22px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Upload Data
            </button>
            <button
              onClick={generateDemoOrganization}
              style={{
                padding: '11px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.45)'
              }}
            >
              Generate Demo Organization
            </button>
          </div>
        </div>
      </div>
    );
  }

  const docWorkflow = workflows.find(w => w.type === 'documented') || workflows[0];
  const discWorkflow = workflows.find(w => w.type === 'discovered') || workflows[1];

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1440px', margin: '0 auto', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        paddingBottom: '18px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontWeight: 700
            }}>
              STAGE 02: PROCESS ARCHAEOLOGY
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#fb7185',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              fontWeight: 700
            }}>
              87% TRACE DIVERGENCE DETECTED
            </span>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Observe & Workflow Discovery
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, maxWidth: '850px' }}>
            Comparing documented standard operating procedures (SOPs) against real operational execution discovered from <strong>{datasetSummary.events.toLocaleString()} ingested events</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setHighlightDeviations(!highlightDeviations)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: highlightDeviations ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: highlightDeviations ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
              color: highlightDeviations ? '#fca5a5' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {highlightDeviations ? 'Hide Deviations' : 'Highlight Deviations'}
          </button>
          <button
            onClick={onNavigateToDecide}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Decision DNA</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Hero Divergence Comparison Banner */}
      <div 
        data-demo-target="discovered-workflow"
        style={{
          background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.10) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '32px' }}>
          {/* Documented Theory */}
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '10px',
            border: '1px solid rgba(244, 63, 94, 0.3)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#fb7185', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              WHAT DOCUMENTATION SAYS
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', marginTop: '6px' }}>
              48h approval queue
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              POL-OPS-012 • 4-tier Director Escalation Bottleneck
            </div>
          </div>

          {/* Divergence Arrow */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#f43f5e', letterSpacing: '0.05em' }}>
              VS
            </div>
            <div style={{
              padding: '6px 14px',
              background: 'rgba(244, 63, 94, 0.25)',
              border: '1px solid #f43f5e',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#fca5a5'
            }}>
              87% of traces diverge
            </div>
            <div style={{ fontSize: '18px', color: '#38bdf8', fontWeight: 800 }}>
              ➔
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
              Discovered Reality
            </div>
          </div>

          {/* Discovered Reality */}
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '10px',
            border: '1px solid rgba(6, 182, 212, 0.4)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              WHAT PEOPLE ACTUALLY DO
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#34d399', marginTop: '6px' }}>
              65m war-room fast-track
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Empirical Path • Slack War Room & Direct Stripe Credit
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Flow Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Left: Documented Process */}
        <div style={{
          background: 'rgba(6, 12, 24, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                DOCUMENTED SOP STANDARD
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '6px 0 0 0' }}>
                {docWorkflow.name}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>SLA Target</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace" }}>48.0 Hours</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {docWorkflow.nodes.map((node, idx) => {
              const isBottleneck = node.isBottleneck;
              return (
                <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    background: isBottleneck ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isBottleneck ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: isBottleneck ? '#fb7185' : '#ffffff' }}>
                        {idx + 1}. {node.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Type: {node.type.toUpperCase()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '11px',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isBottleneck ? '#f43f5e' : '#94a3b8',
                        fontWeight: 700
                      }}>
                        {node.durationMinutes > 0 ? `${node.durationMinutes} min` : 'Instant'}
                      </span>
                      {isBottleneck && (
                        <div style={{ fontSize: '10px', color: '#f87171', fontWeight: 700 }}>
                          CRITICAL BOTTLENECK
                        </div>
                      )}
                    </div>
                  </div>

                  {idx < docWorkflow.nodes.length - 1 && (
                    <div style={{ color: '#475569', fontSize: '14px', margin: '4px 0' }}>↓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Discovered Actual Process */}
        <div style={{
          background: 'rgba(6, 12, 24, 0.75)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                MINED FROM 5,000 EVENTS
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '6px 0 0 0' }}>
                {discWorkflow.name}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Empirical Mean</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>65 Minutes</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {discWorkflow.nodes.map((node, idx) => {
              const isBypass = node.isUndocumented;
              return (
                <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    background: isBypass ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isBypass ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: isBypass ? '#38bdf8' : '#ffffff' }}>
                        {idx + 1}. {node.label}
                      </div>
                      <div style={{ fontSize: '11px', color: isBypass ? '#38bdf8' : '#64748b', marginTop: '2px' }}>
                        {isBypass ? '⚡ UNDOCUMENTED WAR-ROOM HEURISTIC' : `Type: ${node.type.toUpperCase()}`}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '11px',
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isBypass ? '#38bdf8' : '#94a3b8',
                        fontWeight: 700
                      }}>
                        {node.durationMinutes > 0 ? `${node.durationMinutes} min` : 'Instant'}
                      </span>
                      {isBypass && (
                        <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                          FAST-TRACK
                        </div>
                      )}
                    </div>
                  </div>

                  {idx < discWorkflow.nodes.length - 1 && (
                    <div style={{ color: isBypass ? '#38bdf8' : '#475569', fontSize: '14px', margin: '4px 0' }}>↓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Discovered Deviations & Heuristics List */}
      <div style={{
        background: 'rgba(6, 12, 24, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '24px',
        backdropFilter: 'blur(20px)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={18} color="#f43f5e" />
          <span>Observed Process Anomalies & Deviations</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.35)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fb7185', marginBottom: '4px' }}>
              1. 4-Tier Manager Queue Bypass (87% frequency)
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Staff support leads bypass formal Confluence POL-OPS-012 approvals for enterprise clients during outages to resolve cases within 65 minutes rather than 48 hours.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.35)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' }}>
              2. Tacit Precedent Substitution
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Engineers rely on a single prior VP message in Slack (#incidents-war-room) as authority to grant up to $1,500 credits without opening a Jira ticket first.
            </p>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.35)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
              3. Telemetry Verification Pre-condition
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Discovered traces prove that staff engineers always check Datadog shard latency before granting credits, a critical safety heuristic never written into formal SOPs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
