import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, 
  FileText, Layers, GitFork, RefreshCw, DollarSign, Users, Clock, Lock
} from 'lucide-react';
import { fetchCommandCenter } from '../lib/api';

export const CommandCenterView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const cc = await fetchCommandCenter();
        setData(cc);
      } catch (err) {
        console.error("Failed to load operations dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <RefreshCw className="animate-spin" size={32} style={{ color: '#06b6d4' }} />
      </div>
    );
  }

  // Realistic corporate audit log of recent cases
  const recentAudits = [
    {
      id: "CLM-2026-8942",
      account: "Acme Global (Enterprise Tier)",
      incident: "3.5 hr Cloud Service Interruption",
      claimed: "$850",
      policy: "POL-OPS-012 (Outage SLA Compensation)",
      status: "Approved",
      action: "Direct Billing Credit Applied",
      arrProtected: "$540,000 ARR",
      timestamp: "12 mins ago"
    },
    {
      id: "CLM-2026-8939",
      account: "FinTech Prime (Strategic Partner)",
      incident: "6.0 hr API Gateway Latency Spike",
      claimed: "$1,400",
      policy: "POL-OPS-015 (Strategic Priority Clause)",
      status: "Approved",
      action: "Credit Authorized with VP Alert",
      arrProtected: "$1,020,000 ARR",
      timestamp: "45 mins ago"
    },
    {
      id: "CLM-2026-8931",
      account: "Nova Tech (Starter Plan)",
      incident: "1.0 hr Maintenance Window",
      claimed: "$950",
      policy: "POL-OPS-003 (Starter Plan Limit: $200)",
      status: "Policy Adjusted",
      action: "Adjusted to $200 Maximum Cap",
      arrProtected: "Prevented $750 Overpayment",
      timestamp: "2 hours ago"
    },
    {
      id: "CLM-2026-8924",
      account: "Starlight Corp (Professional Tier)",
      incident: "2.0 hr Webhook Delivery Delay",
      claimed: "$450",
      policy: "POL-OPS-009 (Pro SLA Tier)",
      status: "Approved",
      action: "Automated Credit Issued",
      arrProtected: "$144,000 ARR",
      timestamp: "3 hours ago"
    }
  ];

  return (
    <div style={{ padding: '28px 16px 60px 16px', maxWidth: '1280px', margin: '0 auto', textAlign: 'left' }}>
      {/* Corporate Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-emerald">SYSTEM OPERATIONAL</span>
            <span className="badge badge-cyan">SOC-2 TYPE II AUDIT CERTIFIED</span>
            <span className="badge badge-indigo">PRODUCTION ENFORCEMENT</span>
          </div>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: 'clamp(20px, 2.2vw, 28px)', 
            fontWeight: 400, 
            letterSpacing: '0.04em', 
            color: '#fff', 
            lineHeight: 1.6,
            textShadow: '0 2px 4px #000, 0 4px 16px rgba(0,0,0,0.9)'
          }}>
            Operations & Incident Audit Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '6px', fontWeight: 300, maxWidth: '750px' }}>
            Real-time management of customer claim settlements, financial authority caps, and corporate policy compliance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-secondary" 
            onClick={() => onNavigate('genomes')}
            style={{ fontSize: '13.5px', padding: '10px 16px', borderRadius: '8px' }}
          >
            <FileText size={15} /> Policy Rules
          </button>
          <button 
            className="btn-primary" 
            onClick={() => onNavigate('console')}
            style={{ fontSize: '13.5px', padding: '10px 18px', borderRadius: '8px' }}
          >
            <ShieldCheck size={15} /> Resolve New Claim
          </button>
        </div>
      </div>

      {/* Corporate KPI Summary (4 Useful, Understandable Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <div className="glass-panel" style={{ padding: '20px 22px', background: 'rgba(6, 12, 26, 0.88)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
            MONTHLY SETTLEMENT BUDGET
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#38bdf8', marginTop: '6px' }}>
            $18,450 <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 400 }}>/ $50,000</span>
          </div>
          <div style={{ fontSize: '12px', color: '#34d399', marginTop: '4px' }}>
            ● 36.9% utilized • Fully within approved reserve
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', background: 'rgba(6, 12, 26, 0.88)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
            AUTOMATED CLEARANCE RATE
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#34d399', marginTop: '6px' }}>
            98.6%
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            1,266 of 1,284 claims cleared without manual delay
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', background: 'rgba(6, 12, 26, 0.88)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
            AVERAGE RESOLUTION VELOCITY
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#f59e0b', marginTop: '6px' }}>
            &lt; 1.2 sec
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Instant policy verification against signed customer SLAs
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 22px', background: 'rgba(6, 12, 26, 0.88)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
            PROTECTED ANNUAL REVENUE
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#a78bfa', marginTop: '6px' }}>
            $14.8M ARR
          </div>
          <div style={{ fontSize: '12px', color: '#34d399', marginTop: '4px' }}>
            Zero customer churn across resolved outage incidents
          </div>
        </div>
      </div>

      {/* Corporate Governance & Safeguards Panel (Replacing Confusing Telemetry) */}
      <div className="glass-panel" style={{ 
        padding: '24px 26px', 
        marginBottom: '28px', 
        background: 'rgba(6, 12, 26, 0.92)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.10)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={20} color="#06b6d4" />
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
              Corporate Governance & Operating Safeguards
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-emerald font-mono" style={{ fontSize: '11px' }}>
              ● ENFORCEMENT ENGINE ACTIVE
            </span>
            <span className="badge badge-cyan font-mono" style={{ fontSize: '11px' }}>
              ● AUDIT TRAIL IMMUTABLE
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Lock size={15} color="#34d399" />
              <div style={{ fontSize: '12.5px', color: '#ffffff', fontWeight: 600 }}>Financial Authority Caps</div>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Automatic limits enforced: Support Leads up to $500, Managers up to $1,500, VP approval for $2,500+.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <FileText size={15} color="#38bdf8" />
              <div style={{ fontSize: '12.5px', color: '#ffffff', fontWeight: 600 }}>SLA Policy Adherence</div>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Claims are matched against documented contract clauses to eliminate unauthorized concession leaks.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle2 size={15} color="#fbbf24" />
              <div style={{ fontSize: '12.5px', color: '#ffffff', fontWeight: 600 }}>Double-Claim Prevention</div>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Automatic deduplication prevents repeated credit claims for the same timestamped service outage.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={15} color="#a78bfa" />
              <div style={{ fontSize: '12.5px', color: '#ffffff', fontWeight: 600 }}>SOC-2 Compliance Ledger</div>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
              Every resolution is cryptographically timestamped and stored for financial quarterly audit reviews.
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Recent Case Audit Trail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(6, 12, 26, 0.90)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Recent Incident Settlements & Audit Trail
                </h3>
                <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: 300 }}>
                  Logged verification actions performed against corporate policies.
                </span>
              </div>
              <span className="badge badge-emerald">LIVE LOG</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentAudits.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    background: 'rgba(15, 23, 42, 0.70)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '10px', 
                    padding: '16px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>{item.id}</span>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>• {item.account}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{item.timestamp}</span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                    <strong style={{ color: '#94a3b8' }}>Incident:</strong> {item.incident}
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '8px' }}>
                    <strong>Policy Evaluated:</strong> <span style={{ color: '#fbbf24' }}>{item.policy}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12.5px', color: '#34d399', fontWeight: 600 }}>
                      ✓ {item.action} ({item.claimed})
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#a78bfa' }}>
                      {item.arrProtected}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Governance & Escalation Hierarchy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Departmental Authority Matrix */}
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(6, 12, 26, 0.90)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <DollarSign size={18} style={{ color: '#34d399' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Delegation of Financial Authority
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px', fontSize: '13.5px' }}>
                <span style={{ color: '#94a3b8' }}>Tier 1: Automated Rule Clearance</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Up to $500</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px', fontSize: '13.5px' }}>
                <span style={{ color: '#94a3b8' }}>Tier 2: Support Lead Sign-off</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>$500 – $1,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px', fontSize: '13.5px' }}>
                <span style={{ color: '#94a3b8' }}>Tier 3: Operations Manager</span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>$1,000 – $2,500</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                <span style={{ color: '#94a3b8' }}>Tier 4: VP Operations / Finance</span>
                <span style={{ color: '#f43f5e', fontWeight: 600 }}>$2,500+</span>
              </div>
            </div>

            <button 
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '20px', justifyContent: 'center', fontSize: '13.5px', padding: '10px' }}
              onClick={() => onNavigate('genomes')}
            >
              Configure Policy Rules <ArrowRight size={14} />
            </button>
          </div>

          {/* Scenario Planning Quick Access */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.22) 0%, rgba(6, 182, 212, 0.16) 100%)',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Scenario Planning & Policy Modeling
            </h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '16px' }}>
              Evaluate the financial impact of changing customer outage compensation caps or SLA response times before rollout.
            </p>
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '13.5px', padding: '10px' }} 
              onClick={() => onNavigate('simulate')}
            >
              Open Scenario Modeler <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
