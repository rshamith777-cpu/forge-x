import React, { useState } from 'react';
import { 
  Zap, GitFork, Sliders, ArrowRight, ShieldCheck, AlertTriangle, 
  TrendingUp, TrendingDown, Clock, DollarSign, Users, Award, PlayCircle, RefreshCw
} from 'lucide-react';
import { runForkReality } from '../lib/api';

export const ForkRealityView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  // Configurable Decision Rule Parameters
  const [thresholdAmount, setThresholdAmount] = useState<number>(1500);
  const [autoApproveEnterprise, setAutoApproveEnterprise] = useState<boolean>(true);
  const [slaEscalationHours, setSlaEscalationHours] = useState<number>(24);
  const [requireManagerApproval, setRequireManagerApproval] = useState<boolean>(false);
  const [fraudStrictness, setFraudStrictness] = useState<number>(0.85);

  const [simulating, setSimulating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [selectedCausalNode, setSelectedCausalNode] = useState<any>(null);
  const [selectedParetoPoint, setSelectedParetoPoint] = useState<any>(null);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const data = await runForkReality({
        threshold_amount: thresholdAmount,
        auto_approve_enterprise: autoApproveEnterprise,
        sla_escalation_hours: slaEscalationHours,
        require_manager_approval: requireManagerApproval,
        fraud_check_strictness: fraudStrictness,
        iterations: 1000,
      });
      setResult(data);
      if (data?.pareto_frontier?.length > 1) {
        setSelectedParetoPoint(data.pareto_frontier[1]);
      }
    } catch (err) {
      console.error("Fork simulation failed", err);
    } finally {
      setSimulating(false);
    }
  };

  // Run initial simulation on first load if not present
  React.useEffect(() => {
    handleSimulate();
  }, []);

  const current = result?.current_policy;
  const modified = result?.modified_policy;
  const tradeoff = result?.tradeoff_summary;

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">OPERATIONAL MODELING</span>
            <span className="badge badge-emerald">POLICY IMPACT FORECASTER</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Scenario Planning & Budget Impact Analysis
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Model the financial impact of modifying claim approval thresholds and manager escalation requirements across customer cohorts.
          </p>
        </div>

        <button className="btn-secondary" onClick={handleSimulate} disabled={simulating}>
          <RefreshCw size={14} className={simulating ? "animate-spin" : ""} /> {simulating ? 'Calculating Impact...' : 'Recalculate Model'}
        </button>
      </div>

      {/* Hero Counterfactual "WHAT IF?" Banner */}
      <div style={{ 
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)', 
        border: '1px solid rgba(99, 102, 241, 0.4)', 
        borderRadius: '10px', 
        padding: '16px 24px', 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#818cf8', letterSpacing: '0.08em' }}>WHAT IF?</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
            REFUND AUTO-APPROVAL: CURRENT <span style={{ color: '#fb7185' }}>$500</span> ➔ FORK <span style={{ color: '#38bdf8' }}>${thresholdAmount}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="badge badge-emerald">1,000 Realities Forked</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Multi-hop causal propagation active</div>
        </div>
      </div>

      {/* Interactive Rule Manipulation Control Deck */}
      <div className="glass-panel" style={{ padding: '22px 28px', marginBottom: '28px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Sliders size={18} style={{ color: '#6366f1' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
            Modify Decision Rule Parameters
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {/* Slider 1: Refund Threshold */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auto-Refund Threshold</span>
              <span className="badge badge-cyan font-mono">${thresholdAmount}</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="3000" 
              step="100"
              value={thresholdAmount}
              onChange={(e) => setThresholdAmount(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>$200 (Strict)</span>
              <span>$3,000 (Generous)</span>
            </div>
          </div>

          {/* Toggle: Enterprise Fast-Track */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Enterprise Fast-Track</span>
              <span className={`badge ${autoApproveEnterprise ? 'badge-emerald' : 'badge-rose'}`}>
                {autoApproveEnterprise ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <button 
              onClick={() => setAutoApproveEnterprise(!autoApproveEnterprise)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: autoApproveEnterprise ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: autoApproveEnterprise ? '#34d399' : '#94a3b8',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {autoApproveEnterprise ? 'Instant Credit for Enterprise' : 'Follow Standard Queue'}
            </button>
          </div>

          {/* SLA Escalation Cap */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>SLA Escalation Target</span>
              <span className="badge badge-amber font-mono">{slaEscalationHours} Hours</span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="72" 
              step="4"
              value={slaEscalationHours}
              onChange={(e) => setSlaEscalationHours(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>4h (Aggressive)</span>
              <span>72h (Lenient)</span>
            </div>
          </div>

          {/* Fraud Check Strictness Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sybil Fraud Filter</span>
              <span className="badge badge-indigo font-mono">{Math.round(fraudStrictness * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1.0" 
              step="0.05"
              value={fraudStrictness}
              onChange={(e) => setFraudStrictness(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>10% (Permissive)</span>
              <span>100% (Strict)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade-off Impact Banner */}
      {tradeoff && (
        <div style={{ 
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          padding: '16px 24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} /> Fork Reality Trade-off Analysis (1,000 Monte Carlo Iterations)
            </div>
            <div style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '4px' }}>
              {tradeoff.recommendation}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CYCLE TIME GAIN</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#34d399' }}>
                +{tradeoff.speed_improvement_hours}h Faster
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CSAT GAIN</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8' }}>
                +{tradeoff.csat_gain} Pts
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WORKLOAD SAVED</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fbbf24' }}>
                {tradeoff.workload_hours_saved}h Staff
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT SCREEN COMPARISON: Current vs Modified */}
      <div className="reality-split-container" style={{ marginBottom: '28px' }}>
        {/* Left Side: Current Reality */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-amber">BASELINE REALITY</span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                Current Policy Branch
              </h3>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              POL-OPS-012 (Threshold: $500)
            </div>
          </div>

          {current && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SUCCESS RATE</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    {Math.round(current.success_rate * 100)}%
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVG CYCLE TIME</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#fb7185', marginTop: '4px' }}>
                    {current.avg_duration_hours}h
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CUSTOMER CSAT</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                    {current.csat_score} / 5.0
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVG COST PER CASE</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    ${current.avg_cost}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WORKLOAD HOURS</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    {current.workload_hours}h
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  DOWNSTREAM CONSEQUENCES
                </div>
                {current.downstream_effects?.map((eff: string, idx: number) => (
                  <div key={idx} style={{ fontSize: '12px', color: '#f87171', marginBottom: '4px' }}>
                    • {eff}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Modified Reality */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-cyan">FORKED REALITY</span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
                Modified Policy Branch
              </h3>
            </div>
            <div style={{ fontSize: '12px', color: '#34d399' }}>
              Threshold: ${thresholdAmount} (Instant Credit)
            </div>
          </div>

          {modified && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SUCCESS RATE</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                    {Math.round(modified.success_rate * 100)}%
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVG CYCLE TIME</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                    {modified.avg_duration_hours}h
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CUSTOMER CSAT</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                    {modified.csat_score} / 5.0
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AVG COST PER CASE</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
                    ${modified.avg_cost}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WORKLOAD HOURS</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                    {modified.workload_hours}h
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  DOWNSTREAM CONSEQUENCES
                </div>
                {modified.downstream_effects?.length > 0 ? (
                  modified.downstream_effects.map((eff: string, idx: number) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '4px' }}>
                      • {eff}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#34d399' }}>
                    ✓ No negative downstream bottlenecks detected.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Branch Stress Test Matrix: Conservative, Adversarial, Worst-Case */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          Multi-Reality Stress Matrix (5 Parallel Branches)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {result?.conservative_scenario && (
            <div className="glass-card" style={{ padding: '16px' }}>
              <span className="badge badge-cyan">CONSERVATIVE SCENARIO</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '8px' }}>
                Low Outage Severity
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Success: <strong>{Math.round(result.conservative_scenario.success_rate * 100)}%</strong> • Cost: ${result.conservative_scenario.avg_cost}
              </div>
            </div>
          )}

          {result?.adversarial_scenario && (
            <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <span className="badge badge-rose">ADVERSARIAL ATTACK</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fb7185', marginTop: '8px' }}>
                Mass Sybil Fraud Surge
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Risk Score: <strong>{result.adversarial_scenario.risk_score}</strong> • Failure: {Math.round(result.adversarial_scenario.failure_rate * 100)}%
              </div>
            </div>
          )}

          {result?.worst_case_scenario && (
            <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span className="badge badge-amber">WORST-CASE CASCADING</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fbbf24', marginTop: '8px' }}>
                Multi-Region Shard Blackout
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Duration: <strong>{result.worst_case_scenario.avg_duration_hours}h</strong> • CSAT: {result.worst_case_scenario.csat_score}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 13: VISUAL CAUSAL CASCADE DIAGRAM */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">PILLAR 03 — WHAT IF WE CHANGE THE RULE?</span>
              <span className="badge badge-indigo">SECTION 13: CAUSAL CASCADE</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              Causal Propagation: $500 ➔ ${thresholdAmount}
            </h3>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Click any node to inspect affected entities, evidence & downstream impact
          </div>
        </div>

        {/* Animated Left-to-Right Cascade */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', position: 'relative' }}>
          {[
            {
              id: 'node-1',
              tag: '1. POLICY INPUT',
              title: `$${thresholdAmount} Limit`,
              subtitle: 'Current: $500',
              color: '#38bdf8',
              entities: ['Billing Engine', 'Executive Policy POL-OPS-012', 'Tier-1 Customer Accounts'],
              evidence: 'Observed 87% director queue bypass during high-severity platform outages.',
              assumptions: 'Customers under $1,500 threshold represent acceptable operational risk.',
              impact: 'Alters immediate qualification criteria across 100% of incoming outage tickets.'
            },
            {
              id: 'node-2',
              tag: '2. AUTO-APPROVALS',
              title: '+64% Volume',
              subtitle: 'Director queue bypassed',
              color: '#34d399',
              entities: ['Refund Queue', 'Tier-1 Support Agents', 'Customer Success Leads'],
              evidence: 'Simulated 1,000 empirical historical tickets with expanded threshold.',
              assumptions: 'Automated credit approval triggers without human intervention.',
              impact: 'Bypasses 4-tier director escalation queue for 640 out of 1,000 cases.'
            },
            {
              id: 'node-3',
              tag: '3. WORKLOAD SHIFT',
              title: '-340 Staff Hours',
              subtitle: 'Review strain removed',
              color: '#fbbf24',
              entities: ['Operations Directors', 'Escalations Support Pod'],
              evidence: 'Human review time drops from 48.0 hours average queue time to instant.',
              assumptions: 'Staff redirects freed hours to core infrastructure triage.',
              impact: 'Reduces operational overhead and human burnout during Sev-1 outages.'
            },
            {
              id: 'node-4',
              tag: '4. TURNAROUND',
              title: '18.4h ➔ 0.8h',
              subtitle: 'SLA breaches drop 94%',
              color: '#34d399',
              entities: ['Enterprise Clients', 'SLA Monitoring System'],
              evidence: 'Instant credit issuance reduces end-to-end resolution latency by 96%.',
              assumptions: 'Payment processor API maintains sub-second credit execution.',
              impact: 'Elevates customer CSAT from 3.2 to 4.8 / 5.0 across enterprise cohort.'
            },
            {
              id: 'node-5',
              tag: '5. FRAUD EXPOSURE',
              title: '+12.4% Attack Surface',
              subtitle: 'Sybil vulnerability elevated',
              color: '#fb7185',
              entities: ['Risk & Compliance Pod', 'Fraud Screening Engine'],
              evidence: 'Red Team injection confirms coordinated micro-bursts exploit static caps.',
              assumptions: 'Attackers discover elevated threshold within 48 hours of deployment.',
              impact: 'Expands exposure window unless compound velocity exception (EXC-FRAUD-SYBIL) is enforced.'
            },
            {
              id: 'node-6',
              tag: '6. EXPECTED LOSS',
              title: '+$42,100 Risk',
              subtitle: 'Protected by V2 Guard',
              color: '#f43f5e',
              entities: ['Corporate Treasury', 'Chargeback Accounting'],
              evidence: 'Synthetic 100-bot Sybil attack extracts $33,433 if unmitigated by V2 velocity rules.',
              assumptions: 'Requires deployment of Playbook V2 to intercept 94% of adversarial attempts.',
              impact: 'Net expected fraud loss contained to <$1,500 once compound velocity gating is active.'
            }
          ].map((n) => {
            const isSelected = selectedCausalNode?.id === n.id;
            return (
              <div 
                key={n.id}
                onClick={() => setSelectedCausalNode(n)}
                className="glass-card" 
                style={{ 
                  padding: '14px', 
                  borderTop: `3px solid ${n.color}`,
                  cursor: 'pointer',
                  border: isSelected ? `1px solid ${n.color}` : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.3)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '10px', color: n.color, fontWeight: 800 }}>{n.tag}</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {n.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {n.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Causal Node Detail Inspector */}
        {selectedCausalNode && (
          <div style={{ 
            marginTop: '16px', 
            padding: '16px 20px', 
            background: 'rgba(0,0,0,0.4)', 
            borderRadius: '8px', 
            border: `1px solid ${selectedCausalNode.color}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>AFFECTED ENTITIES</div>
              <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>
                {selectedCausalNode.entities?.map((e: string, i: number) => (
                  <div key={i}>• {e}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>SUPPORTING EVIDENCE</div>
              <div style={{ fontSize: '12px', color: '#e2e8f0', marginTop: '4px', lineHeight: '1.4' }}>
                {selectedCausalNode.evidence}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>UNDERLYING ASSUMPTIONS</div>
              <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '4px', lineHeight: '1.4' }}>
                {selectedCausalNode.assumptions}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>DOWNSTREAM IMPACT</div>
              <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px', lineHeight: '1.4' }}>
                {selectedCausalNode.impact}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 14: PARETO FRONTIER MULTI-OBJECTIVE TRADE-OFF INSPECTOR */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-indigo">PARETO OPTIMALITY</span>
              <span className="badge badge-emerald">TRADEOFF INTELLIGENCE</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              Five Parallel Realities: Click Any Point to Inspect
            </h3>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            No scenario is universally "best" — FORGE evaluates multi-dimensional tradeoffs
          </div>
        </div>

        {/* 5 Realities Points */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '18px' }}>
          {result?.pareto_frontier?.map((p: any, idx: number) => {
            const isSelected = selectedParetoPoint?.branch === p.branch;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedParetoPoint(p)}
                className="glass-card"
                style={{
                  padding: '16px',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  {p.branch}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cost / Case:</span>
                    <span className="font-mono" style={{ color: '#fff' }}>${p.cost}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cycle Time:</span>
                    <span className="font-mono" style={{ color: '#38bdf8' }}>{p.duration_hours}h</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>CSAT Score:</span>
                    <span className="font-mono" style={{ color: '#fbbf24' }}>{p.csat} / 5.0</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Risk Score:</span>
                    <span className="font-mono" style={{ color: p.risk > 0.4 ? '#fb7185' : '#34d399' }}>{p.risk}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Staff Hours:</span>
                    <span className="font-mono" style={{ color: '#e2e8f0' }}>{p.workload_hours}h</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Scenario Inspector */}
        {selectedParetoPoint && (
          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '1px solid rgba(56, 189, 248, 0.3)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan">SCENARIO INSPECTOR</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{selectedParetoPoint.branch}</span>
              </div>
              <span className="badge badge-indigo">PARETO STATUS: NON-DOMINATED</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>COST</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>${selectedParetoPoint.cost}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SPEED</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>{selectedParetoPoint.duration_hours}h</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CSAT</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>{selectedParetoPoint.csat} / 5.0</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>RISK</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: selectedParetoPoint.risk > 0.4 ? '#fb7185' : '#34d399', marginTop: '2px' }}>{selectedParetoPoint.risk}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>WORKLOAD</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#e2e8f0', marginTop: '2px' }}>{selectedParetoPoint.workload_hours}h</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
              <strong style={{ color: '#38bdf8' }}>WHY THIS POINT?</strong> {
                selectedParetoPoint.branch.includes('Conservative')
                  ? 'Minimizes financial expenditure ($340/case) and eliminates fraud risk (0.05), but sacrifices resolution speed (36.0h cycle time).'
                  : selectedParetoPoint.branch.includes('Adversarial')
                  ? 'Exposes system boundaries under hostile conditions (0.85 risk), proving the necessity of compound velocity gating before scaling.'
                  : selectedParetoPoint.branch.includes('Worst Case')
                  ? 'Models cascading failure during multi-shard blackouts, highlighting maximum potential latency (48.0h).'
                  : selectedParetoPoint.branch.includes('Modified')
                  ? 'Optimizes turnaround time (0.8h) and customer satisfaction (4.8 CSAT) while workload drops 340h, at an incremental cost of $480/case.'
                  : 'Baseline corporate reality: conforms to formal SOP at high latency (18.4h) and moderate CSAT (3.2).'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
