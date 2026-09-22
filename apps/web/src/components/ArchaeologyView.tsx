import React, { useState, useEffect } from 'react';
import { Layers, AlertOctagon, CheckCircle2, Clock, GitCompare, ArrowRight, Zap } from 'lucide-react';
import { fetchArchaeology } from '../lib/api';

export const ArchaeologyView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchaeology().then((res: any) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em', color: '#38bdf8' }}>
          RECONSTRUCTING ORGANIZATIONAL STATE...
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Mining empirical execution paths from 5,000 trace events across Slack, Jira, and Stripe.
        </div>
      </div>
    );
  }

  const docWf = data?.documented_workflow;
  const discWf = data?.discovered_workflow;
  const conf = data?.conformance_report;

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-cyan">AUDIT & COMPLIANCE</span>
            <span className="badge badge-amber">CONFORMANCE: {conf ? `${Math.round(conf.conformance_rate * 100)}%` : '38%'}</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Process Compliance & Execution Audit
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Comparing documented standard operating procedures (SOPs) against verified operational execution records.
          </p>
        </div>

        <button className="btn-primary" onClick={() => onNavigate('genomes')}>
          Review Policy Rules <ArrowRight size={15} />
        </button>
      </div>

      {/* Hero Contradiction Bridge (The Core Story) */}
      <div className="glass-panel" style={{ 
        padding: '24px 32px', 
        marginBottom: '28px', 
        border: '1px solid rgba(244, 63, 94, 0.4)',
        background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '32px' }}>
          {/* What Documentation Says */}
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#fb7185', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              WHAT DOCUMENTATION SAYS
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginTop: '8px' }}>
              48h approval workflow
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              POL-OPS-012 • 4-tier Director Escalation Queue
            </div>
          </div>

          {/* Visual Divergence Bridge */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#f43f5e', letterSpacing: '0.05em' }}>
              VS
            </div>
            <div style={{ 
              padding: '6px 14px', 
              background: 'rgba(244, 63, 94, 0.2)', 
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
              FORGE found the organization's hidden workflow.
            </div>
          </div>

          {/* What People Actually Do */}
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              WHAT PEOPLE ACTUALLY DO
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#34d399', marginTop: '8px' }}>
              65m war-room fast-track
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Discovered Reality • Slack War Room & Direct Credit
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Documented Workflow */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-indigo">THEORETICAL STANDARD</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                Documented Policy (POL-OPS-012)
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SLA Target</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fbbf24' }}>48.0 Hours</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
            {docWf?.nodes?.map((node: any, idx: number) => {
              const isBottleneck = docWf.bottlenecks?.includes(node.id);
              return (
                <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '100%',
                    background: isBottleneck ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isBottleneck ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: isBottleneck ? '#fb7185' : '#fff' }}>
                        {node.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Stage Type: {node.stage_type.toUpperCase()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge" style={{ background: isBottleneck ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.06)' }}>
                        <Clock size={12} /> {node.avg_duration_minutes} min
                      </span>
                      {isBottleneck && (
                        <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700, marginTop: '4px' }}>
                          BOTTLENECK DETECTED
                        </div>
                      )}
                    </div>
                  </div>

                  {idx < docWf.nodes.length - 1 && (
                    <div style={{ color: 'var(--text-muted)', margin: '4px 0', fontSize: '16px' }}>↓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Discovered Reality */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-cyan">EMPIRICAL REALITY</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', marginTop: '6px' }}>
                Discovered Working Process
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Actual Cycle Time</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#34d399' }}>1.1 Hours</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {discWf?.nodes?.map((node: any, idx: number) => {
              const isUndoc = node.is_undocumented;
              return (
                <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    width: '100%',
                    background: isUndoc ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: isUndoc ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{node.label}</span>
                        {isUndoc && <span className="badge badge-cyan">TACIT STEP</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Discovered from {node.is_undocumented ? 'Slack & Incident Logs' : 'Ticketing System'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-emerald">
                        <Clock size={12} /> {node.avg_duration_minutes} min
                      </span>
                    </div>
                  </div>

                  {idx < discWf.nodes.length - 1 && (
                    <div style={{ color: '#06b6d4', margin: '4px 0', fontSize: '16px' }}>↓</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
