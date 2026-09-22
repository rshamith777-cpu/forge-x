import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Filter, 
  ArrowRight,
  ChevronRight,
  FileText,
  Activity,
  Gauge,
  Percent,
  RefreshCw
} from 'lucide-react';

interface OperationsOverviewViewProps {
  onNavigateToIncidents: (filter?: string) => void;
  onNavigateToPolicies: () => void;
  onNavigateToAudit: () => void;
}

export const OperationsOverviewView: React.FC<OperationsOverviewViewProps> = ({
  onNavigateToIncidents,
  onNavigateToPolicies,
  onNavigateToAudit
}) => {
  const [subTab, setSubTab] = useState<'overview' | 'sli_sla' | 'my_work' | 'activity'>('overview');

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1400px', margin: '0 auto', textAlign: 'left', fontFamily: "'Rowdies', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '20px',
              color: '#ffffff',
              letterSpacing: '0.04em',
              margin: 0
            }}>
              Operations Center
            </h1>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              LIVE WORKLOAD & SLI
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14.5px', fontWeight: 300, margin: 0 }}>
            Monitor organizational queue throughput, Service Level Indicators (SLI), SLA compliance targets, and operational approvals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#64748b',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '5px 12px',
            borderRadius: '6px'
          }}>
            DEMO ENVIRONMENT • SYNTHETIC ENTERPRISE DATA
          </span>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Workload Overview' },
          { id: 'sli_sla', label: 'SLI / SLA Performance' },
          { id: 'my_work', label: 'My Work Queue (4)' },
          { id: 'activity', label: 'Real-Time Activity' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 400,
              fontFamily: "'Rowdies', sans-serif",
              border: 'none',
              background: subTab === tab.id ? '#2563eb' : 'rgba(255, 255, 255, 0.05)',
              color: subTab === tab.id ? '#ffffff' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: Overview */}
      {subTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div 
              onClick={() => onNavigateToIncidents('open')}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                <span>Active Incidents</span>
                <Briefcase size={16} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
                24
              </div>
              <p style={{ color: '#38bdf8', fontSize: '12px', margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>12 in triage queue</span> <ArrowUpRight size={13} />
              </p>
            </div>

            <div 
              onClick={() => onNavigateToIncidents('awaiting')}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fbbf24'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                <span>Awaiting Manager Approval</span>
                <Clock size={16} color="#fbbf24" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>
                4
              </div>
              <p style={{ color: '#fde047', fontSize: '12px', margin: '6px 0 0 0' }}>
                High-value settlements ($1,250+)
              </p>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                <span>SLA Compliance (SLI)</span>
                <CheckCircle2 size={16} color="#34d399" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>
                98.6%
              </div>
              <p style={{ color: '#6ee7b7', fontSize: '12px', margin: '6px 0 0 0' }}>
                Objective: &gt; 95.0% • 1 breach this week
              </p>
            </div>

            <div 
              onClick={onNavigateToPolicies}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c084fc'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                <span>Policy Adherence</span>
                <ShieldCheck size={16} color="#c084fc" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
                97.8%
              </div>
              <p style={{ color: '#d8b4fe', fontSize: '12px', margin: '6px 0 0 0' }}>
                3 active exceptions recorded
              </p>
            </div>
          </div>

          {/* SLA Performance & Authority Matrix Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
            {/* SLA by Tier */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SLA Compliance by Customer Tier
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>Trailing 30 Days</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                    <span>Enterprise Tier (4h SLA)</span>
                    <span style={{ fontFamily: 'monospace', color: '#34d399', fontWeight: 700 }}>99.1% on-time</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '99.1%', background: '#10b981', height: '100%', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                    <span>Growth Tier (12h SLA)</span>
                    <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>98.2% on-time</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '98.2%', background: '#0ea5e9', height: '100%', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                    <span>Standard Tier (24h SLA)</span>
                    <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>97.5% on-time</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '97.5%', background: '#0ea5e9', height: '100%', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Authority Threshold Utilization */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Operational Authority Utilization
                </h3>
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>Active Rules</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '13px' }}>Customer Success Lead</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>Approval Limit: ≤ $500 per incident</div>
                  </div>
                  <span style={{ fontFamily: 'monospace', color: '#34d399', fontSize: '12.5px', fontWeight: 700 }}>84 cases approved</span>
                </div>

                <div style={{ padding: '12px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '13px' }}>Operations Manager</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>Approval Limit: ≤ $1,500 per incident</div>
                  </div>
                  <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '12.5px', fontWeight: 700 }}>32 cases approved</span>
                </div>

                <div style={{ padding: '12px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '13px' }}>Vice President (Executive)</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>Approval Limit: &gt; $2,500 escalation</div>
                  </div>
                  <span style={{ fontFamily: 'monospace', color: '#fbbf24', fontSize: '12.5px', fontWeight: 700 }}>3 cases approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SLI / SLA Detail Matrix */}
      {subTab === 'sli_sla' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700, margin: '0 0 4px 0' }}>
                  Service Level Indicators (SLI) & Objectives (SLO)
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  Real-time operational indicators measured against customer contract commitments.
                </p>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '12px', fontFamily: 'monospace' }}>
                ALL SLIs HEALTHY
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.10)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    <th style={{ padding: '10px 14px' }}>Indicator Name</th>
                    <th style={{ padding: '10px 14px' }}>Target (SLO)</th>
                    <th style={{ padding: '10px 14px' }}>Current SLI</th>
                    <th style={{ padding: '10px 14px' }}>Error Budget Remaining</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Incident First-Response Time', target: '< 15 mins', current: '7.4 mins', budget: '88.2%', status: 'Normal' },
                    { name: 'Credit Resolution Approval Speed', target: '< 4 hours', current: '1.2 hours', budget: '94.0%', status: 'Optimal' },
                    { name: 'SLA Outage Breach Rate', target: '< 2.0%', current: '1.4%', budget: '71.5%', status: 'Within Limits' },
                    { name: 'Disputed Concessions Ratio', target: '< 5.0%', current: '0.8%', budget: '96.2%', status: 'Optimal' },
                    { name: 'Voucher Cryptographic Audit Integrity', target: '100.0%', current: '100.0%', budget: '100.0%', status: 'Optimal' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '14px', color: '#ffffff', fontWeight: 600 }}>{row.name}</td>
                      <td style={{ padding: '14px', color: '#94a3b8', fontFamily: 'monospace' }}>{row.target}</td>
                      <td style={{ padding: '14px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>{row.current}</td>
                      <td style={{ padding: '14px', color: '#34d399', fontFamily: 'monospace' }}>{row.budget}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: My Work Queue */}
      {subTab === 'my_work' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
              Pending Operations Tasks Requiring Your Authorization
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(2, 6, 15, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px' }}>Review Outage Settlement INC-1042</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                    Acme Enterprise ($1,250 proposed credit for 3h 42m disruption • Awaiting Manager Approval)
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateToIncidents('awaiting')}
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontFamily: "'Rowdies', sans-serif",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Review Decision <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ padding: '14px 18px', background: 'rgba(2, 6, 15, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px' }}>Policy Exception Authorization: EXC-FRAUD-SYBIL</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                    Risk team submitted sub-threshold claim cluster rate limiter on POL-OPS-012
                  </div>
                </div>
                <button 
                  onClick={onNavigateToPolicies}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontFamily: "'Rowdies', sans-serif",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Inspect Policy <ChevronRight size={14} />
                </button>
              </div>

              <div style={{ padding: '14px 18px', background: 'rgba(2, 6, 15, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px' }}>Q3 Proof Verification Ledger Export</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                    Compliance export ready for SOC-2 & Financial Auditor review (42 audited traces)
                  </div>
                </div>
                <button 
                  onClick={onNavigateToAudit}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontFamily: "'Rowdies', sans-serif",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  View Audit Ledger <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Real-Time Activity */}
      {subTab === 'activity' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            Live Operations Stream
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { time: '10:42', title: 'Settlement approved for INC-1042', actor: 'Ananya R. (Ops Lead)', code: 'VCH-2026-X8841', status: 'Approved' },
              { time: '10:38', title: 'Policy exception rule triggered: EXC-FRAUD-SYBIL', actor: 'Automated Fraud Guard', code: 'EXC-FRAUD-SYBIL', status: 'Flagged' },
              { time: '10:21', title: 'Customer claim submitted: INC-1047', actor: 'Devin K. (Support)', code: 'SLA-BREACH-ENTERPRISE', status: 'Open' },
              { time: '09:54', title: 'Operating policy amendment updated: POL-OPS-012 v3.2', actor: 'Rahul M. (VP Ops)', code: 'POL-OPS-012', status: 'Published' }
            ].map((ev, i) => (
              <div key={i} style={{ padding: '12px 16px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '12px' }}>{ev.time}</span>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px' }}>{ev.title}</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>By {ev.actor} • Ref: {ev.code}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  {ev.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
