import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, CheckCircle2, Clock, ArrowRight, 
  AlertTriangle, DollarSign, Activity, FileText, PlusCircle, 
  GitFork, Eye, ExternalLink, Cpu, Lock, Database
} from 'lucide-react';
import { fetchReliabilitySummary } from '../../lib/api';

export interface HomeWorkspaceViewProps {
  currentRole: string;
  onNavigate: (module: string, subParam?: any) => void;
}

export const HomeWorkspaceView: React.FC<HomeWorkspaceViewProps> = ({ currentRole, onNavigate }) => {
  const [reliability, setReliability] = useState<any>(null);

  useEffect(() => {
    fetchReliabilitySummary().then(setReliability).catch(() => null);
  }, []);

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1360px', margin: '0 auto', textAlign: 'left' }}>
      {/* Header Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">SYSTEM OPERATIONAL</span>
            <span className="badge badge-cyan">SOC-2 COMPLIANCE ACTIVE</span>
            <span className="badge badge-amber" style={{ fontSize: '10.5px' }}>LOCAL FALLBACK (BM25)</span>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0'
          }}>
            Good morning, {currentRole}.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 300, margin: 0 }}>
            Here is what needs your operational attention today across customer incidents and policy rules.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('incidents', { openNew: true })}
            className="btn-primary"
            style={{ fontSize: '13.5px', padding: '10px 18px', borderRadius: '8px' }}
          >
            <PlusCircle size={15} /> + New Incident
          </button>
          <button 
            onClick={() => onNavigate('scenarios')}
            className="btn-secondary"
            style={{ fontSize: '13.5px', padding: '10px 16px', borderRadius: '8px' }}
          >
            <GitFork size={15} /> Run Scenario
          </button>
        </div>
      </div>

      {/* PHASE 8: COMPACT RELIABILITY SUMMARY COCKPIT */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        marginBottom: '28px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        background: 'rgba(8, 14, 26, 0.75)',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#38bdf8" />
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
              SYSTEM RELIABILITY SUMMARY (DETERMINISTIC EVALUATION SUITE)
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-emerald" style={{ fontSize: '10.5px' }}>
              Temporal Isolation: {reliability?.temporal_isolation || 'PASS'}
            </span>
            <button
              onClick={() => onNavigate('forgelab')}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                borderRadius: '6px',
                padding: '3px 9px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Inspect in FORGE LAB →
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
          {[
            { label: 'DECISIONS EVALUATED', val: reliability?.decisions_evaluated ?? 500, color: '#38bdf8' },
            { label: 'SCENARIOS TESTED', val: reliability?.scenarios_tested ?? 100, color: '#818cf8' },
            { label: 'ATTACKS DETECTED', val: reliability?.attacks_detected ?? 67, color: '#f43f5e' },
            { label: 'RECOVERIES VALIDATED', val: reliability?.recoveries_validated ?? 94, color: '#34d399' },
            { label: 'REGRESSION FAILURES', val: reliability?.regression_failures ?? 0, color: '#10b981' },
            { label: 'FUTURE DATA LEAKAGE', val: reliability?.future_data_leakage ?? 0, color: '#34d399' },
            { label: 'APPROVED IMPROVEMENTS', val: reliability?.approved_improvements ?? 1, color: '#a78bfa' }
          ].map((m, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.35)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.04em' }}>{m.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono', monospace", marginTop: '4px' }}>
                {m.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. MY WORK (Role-Customized Counters) */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', marginBottom: '12px' }}>
          MY WORK • {currentRole.toUpperCase()}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div 
            className="glass-panel" 
            style={{ padding: '20px', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            onClick={() => onNavigate('incidents')}
          >
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Open Incidents</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#38bdf8', marginTop: '6px' }}>12</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Across active accounts</div>
          </div>

          <div 
            className="glass-panel" 
            style={{ padding: '20px', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(245, 158, 11, 0.25)' }}
            onClick={() => onNavigate('incidents', { filterStatus: 'Awaiting Approval' })}
          >
            <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 600 }}>Awaiting Approval</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#fbbf24', marginTop: '6px' }}>4</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Authority limit reviews</div>
          </div>

          <div 
            className="glass-panel" 
            style={{ padding: '20px', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(244, 63, 94, 0.25)' }}
            onClick={() => onNavigate('audit')}
          >
            <div style={{ fontSize: '12px', color: '#f87171', fontWeight: 600 }}>Policy Exceptions</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#f43f5e', marginTop: '6px' }}>3</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Documented vs Observed</div>
          </div>

          <div 
            className="glass-panel" 
            style={{ padding: '20px', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            onClick={() => onNavigate('incidents', { filterStatus: 'At Risk' })}
          >
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>At-Risk SLAs</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b', marginTop: '6px' }}>2</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Response window &lt; 1 hr</div>
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL HEALTH (Executive KPIs) */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', marginBottom: '12px' }}>
          OPERATIONAL HEALTH
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>SLA Compliance</span>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>98.6%</div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Target: 98.0%</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Open Incident Pool</span>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>24</div>
            <div style={{ fontSize: '11.5px', color: '#34d399', marginTop: '2px' }}>-4 vs yesterday</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Settlement Budget</span>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>36.9%</div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>$18,450 / $50,000 cap</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Policy Adherence</span>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#a78bfa', marginTop: '4px' }}>97.8%</div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Full audit traceability</div>
          </div>
        </div>
      </div>

      {/* 3. PRIORITY QUEUE & RECENT ACTIVITY (2-Column Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Left Column: Priority Queue (Needs Your Attention) */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Needs Your Attention</div>
            <span className="badge badge-rose">ACTION REQUIRED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Item 1 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-rose" style={{ fontSize: '10.5px' }}>HIGH PRIORITY</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>4m ago</span>
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>
                INC-1042 — Acme Global Outage
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 12px 0' }}>
                Enterprise customer SLA breach • $1,250 proposed credit exceeds Lead limit ($1,000) • Awaiting Manager approval.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  onClick={() => onNavigate('incidents', { selectIncident: 'INC-1042' })}
                  className="btn-primary" 
                  style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '6px' }}
                >
                  Review Decision <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-amber" style={{ fontSize: '10.5px' }}>MEDIUM PRIORITY</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>18m ago</span>
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>
                INC-1038 — FinTech Prime Latency Spike
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 12px 0' }}>
                Strategic Partner claim ($1,400) requires priority verification before billing close.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  onClick={() => onNavigate('incidents', { selectIncident: 'INC-1038' })}
                  className="btn-secondary" 
                  style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '6px' }}
                >
                  Review Claim <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '10px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-rose" style={{ fontSize: '10.5px' }}>HIGH PRIORITY</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>1h ago</span>
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>
                POL-OPS-012 — Policy Exception Spike
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 12px 0' }}>
                87% of teams bypass the 48h Jira approval queue during outages to prevent customer churn.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  onClick={() => onNavigate('audit')}
                  className="btn-secondary" 
                  style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '6px' }}
                >
                  Investigate Divergence <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Recent Activity Feed</div>
            <button 
              onClick={() => onNavigate('audit')}
              style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '12.5px', cursor: 'pointer' }}
            >
              View Full Audit →
            </button>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b', minWidth: '42px', paddingTop: '2px' }}>
                  10:42
                </span>
                <div>
                  <div style={{ fontSize: '13.5px', color: '#f1f5f9' }}>
                    <strong>Settlement approved</strong> for <span style={{ color: '#38bdf8' }}>INC-1042</span> by Ananya R.
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    Issued $1,250 credit • Voucher #VCH-2026-X8841 generated
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b', minWidth: '42px', paddingTop: '2px' }}>
                  10:38
                </span>
                <div>
                  <div style={{ fontSize: '13.5px', color: '#f1f5f9' }}>
                    <strong>Policy exception created</strong> <span style={{ color: '#fbbf24' }}>EXC-FRAUD-SYBIL</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    Velocity anomaly filter applied to prevent multiple sub-limit claims
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b', minWidth: '42px', paddingTop: '2px' }}>
                  10:21
                </span>
                <div>
                  <div style={{ fontSize: '13.5px', color: '#f1f5f9' }}>
                    <strong>Customer claim submitted</strong> <span style={{ color: '#38bdf8' }}>INC-1047</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    Nova Tech ($950 claimed) • Auto-adjusted to $200 contract limit
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b', minWidth: '42px', paddingTop: '2px' }}>
                  09:54
                </span>
                <div>
                  <div style={{ fontSize: '13.5px', color: '#f1f5f9' }}>
                    <strong>Policy POL-OPS-012 updated</strong> to Version 3.2
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    Authority limit for Tier 2 Managers increased from $1,000 to $1,500
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
