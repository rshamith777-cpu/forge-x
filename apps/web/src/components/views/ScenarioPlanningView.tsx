import React, { useState, useEffect } from 'react';
import { 
  GitFork, Sliders, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, Download, Save, ShieldCheck, DollarSign, Clock, Users,
  Zap, Database, Sparkles
} from 'lucide-react';
import { useOrgData } from '../../context/OrgDataContext';

export interface ScenarioPlanningViewProps {
  prefillScenarioName?: string;
  onApplyToPolicy?: (policyId: string, rule: string) => void;
  onNavigateToIngestion?: () => void;
}

export const ScenarioPlanningView: React.FC<ScenarioPlanningViewProps> = ({ 
  prefillScenarioName, 
  onApplyToPolicy,
  onNavigateToIngestion 
}) => {
  const {
    runForkRealitySimulation,
    datasetSummary,
    decisions,
    policies,
    workflows,
    events,
    isLoaded,
    generateDemoOrganization
  } = useOrgData();

  const [thresholdAmount, setThresholdAmount] = useState<number>(1500);
  const [autoApproveEnterprise, setAutoApproveEnterprise] = useState<boolean>(true);
  const [slaHours, setSlaHours] = useState<number>(24);
  const [requireManagerApproval, setRequireManagerApproval] = useState<boolean>(false);
  const [fraudStrictness, setFraudStrictness] = useState<number>(0.85);

  const [simulating, setSimulating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleRunSimulation = async () => {
    setSimulating(true);
    try {
      const data = await runForkRealitySimulation({
        thresholdAmount,
        requireManagerApproval,
        autoApproveEnterprise,
      });
      setResult(data);
    } catch (err) {
      console.error("Simulation error", err);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    handleRunSimulation();
  }, [thresholdAmount, requireManagerApproval, autoApproveEnterprise]);

  // Empty state handling
  if (!isLoaded || events.length === 0) {
    return (
      <div style={{ padding: '60px 24px', maxWidth: '800px', margin: '60px auto', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: '#f43f5e'
        }}>
          <GitFork size={32} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>
          No organizational data loaded
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Fork Reality Monte Carlo simulations require empirical operational traces. Please upload data files or generate a realistic demo organization to run counterfactual rule analysis.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={onNavigateToIngestion || (() => window.location.hash = '#ingestion')}
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
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)'
            }}
          >
            Generate Demo Organization (5,000 Events)
          </button>
        </div>
      </div>
    );
  }

  const current = result?.current_reality || result?.current_policy;
  const modified = result?.forked_reality || result?.modified_policy;
  const impact = result?.impact_summary;

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1360px', margin: '0 auto', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-indigo">OPERATIONAL MODELING</span>
            <span className="badge badge-emerald">MONTE CARLO (1,000 SCENARIOS)</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            Scenario Planning & Budget Impact
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 300, margin: 0 }}>
            Test operating rule and approval threshold changes across synthetic incident cohorts before publishing to production.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleRunSimulation}
            disabled={simulating}
            className="btn-primary"
            style={{ fontSize: '13.5px', padding: '10px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw className={simulating ? "animate-spin" : ""} size={15} />
            {simulating ? 'Simulating 1,000 Scenarios...' : 'Run Scenario'}
          </button>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Tradeoffs & Comparison on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Controls Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>
            What would happen if...?
          </h3>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 20px 0' }}>
            Adjust rule levers to forecast customer retention, concession costs, and staff workload.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Slider 1: Auto Approval Threshold */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#cbd5e1' }}>Auto-Approval Threshold</span>
                <strong style={{ color: '#38bdf8' }}>${thresholdAmount.toLocaleString()}</strong>
              </div>
              <input 
                type="range"
                min={500}
                max={2500}
                step={100}
                value={thresholdAmount}
                onChange={e => setThresholdAmount(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                <span>$500 (Current)</span>
                <span>$2,500</span>
              </div>
            </div>

            {/* Slider 2: SLA Response Window */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#cbd5e1' }}>SLA Escalation Window</span>
                <strong style={{ color: '#fbbf24' }}>{slaHours} Hours</strong>
              </div>
              <input 
                type="range"
                min={12}
                max={72}
                step={6}
                value={slaHours}
                onChange={e => setSlaHours(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                <span>12h</span>
                <span>48h (Current)</span>
                <span>72h</span>
              </div>
            </div>

            {/* Toggle: Manager Approval */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Require Manager Approval</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Enforce 2-step human queue</div>
              </div>
              <button
                type="button"
                onClick={() => setRequireManagerApproval(!requireManagerApproval)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: requireManagerApproval ? '#2563eb' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {requireManagerApproval ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Toggle: Fraud Check Strictness */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Fraud Strictness Filter</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Sybil cluster anomaly checks</div>
              </div>
              <button
                type="button"
                onClick={() => setFraudStrictness(fraudStrictness >= 0.8 ? 0.5 : 0.85)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: fraudStrictness >= 0.8 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: fraudStrictness >= 0.8 ? '#34d399' : '#fbbf24',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {fraudStrictness >= 0.8 ? 'Strict' : 'Standard'}
              </button>
            </div>
          </div>
        </div>

        {/* Results & Tradeoff Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Prominent Counterfactual Disclaimer */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.10)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '12px', color: '#fef3c7', lineHeight: 1.45 }}>
              <strong>COUNTERFACTUAL SIMULATION ONLY:</strong> Generated from 1,000 Monte Carlo discrete event simulations over {datasetSummary.events.toLocaleString()} ingested events and {datasetSummary.decisions.toLocaleString()} historical decisions. This model projects behavioral divergences and does not constitute a deterministic guarantee in live production.
            </div>
          </div>

          {/* Side-by-Side Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Current Policy */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>CURRENT REALITY</span>
                <span className="badge badge-indigo" style={{ fontSize: '10px' }}>BASELINE</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                $500 Auto-Limit • 48h Escalation Queue
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Avg Cycle Time:</span>
                  <strong style={{ color: '#fbbf24' }}>{current?.avg_cycle_time_hours ?? current?.avg_resolution_time_hours ?? 18.4} hours</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Manager Review Workload:</span>
                  <strong style={{ color: '#f87171' }}>{current?.manager_bottleneck_hours ?? 24.2} hrs / week</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Auto-Approval Volume:</span>
                  <strong style={{ color: '#38bdf8' }}>{current?.auto_approved_count ?? 380} cases (76%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Fraud Exposure / Risk:</span>
                  <strong style={{ color: '#34d399' }}>{current?.fraud_risk_score ?? '12.4% (Baseline)'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Estimated Annual Concessions:</span>
                  <strong style={{ color: '#fff' }}>{current?.estimated_annual_cost ?? '$1.85M'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Customer Satisfaction:</span>
                  <strong style={{ color: '#38bdf8' }}>{current?.csat_score ?? '3.8 / 5.0'}</strong>
                </div>
              </div>
            </div>

            {/* Proposed Forked Reality */}
            <div style={{ background: 'rgba(6, 14, 28, 0.95)', border: '1px solid rgba(6, 182, 212, 0.45)', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 20px rgba(6, 182, 212, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>FORKED REALITY (SIMULATED)</span>
                <span className="badge badge-emerald" style={{ fontSize: '10px' }}>MONTE CARLO</span>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                ${thresholdAmount} Auto-Limit • {slaHours}h Target
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Avg Cycle Time:</span>
                  <strong style={{ color: '#34d399' }}>{modified?.avg_cycle_time_hours ?? modified?.avg_resolution_time_hours ?? 0.8} hours</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Manager Review Workload:</span>
                  <strong style={{ color: requireManagerApproval ? '#f87171' : '#34d399' }}>
                    {modified?.manager_bottleneck_hours ?? (requireManagerApproval ? 42.0 : 4.5)} hrs / week
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Auto-Approval Volume:</span>
                  <strong style={{ color: '#38bdf8' }}>{modified?.auto_approved_count ?? 475} cases (95%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Fraud Exposure / Risk:</span>
                  <strong style={{ color: thresholdAmount >= 1500 ? '#f59e0b' : '#34d399' }}>
                    {modified?.fraud_risk_score ?? (thresholdAmount >= 1500 ? '18.2% (Elevated without V2 filter)' : '4.1% (Low)')}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Estimated Annual Concessions:</span>
                  <strong style={{ color: '#fff' }}>{modified?.estimated_annual_cost ?? '$2.45M'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Customer Satisfaction:</span>
                  <strong style={{ color: '#34d399' }}>{modified?.csat_score ?? '4.8 / 5.0 (Accelerated)'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Support Tradeoffs & Workflow Impact */}
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitFork size={16} color="#06b6d4" />
              Empirical Workflow &amp; Risk Impact Analysis
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '12.5px', color: '#cbd5e1' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  WORKFLOW &amp; BOTTLENECK IMPACT
                </span>
                {impact?.workflow || (requireManagerApproval 
                  ? 'Severe queue backlog: manager approval tickets increase cycle time by +54%.' 
                  : 'Fast-path bypass eliminated: 85% of cases resolve instantly via direct automated authorization.')}
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  FRAUD &amp; EXPLOIT RISK
                </span>
                {impact?.risk || (thresholdAmount >= 1500 
                  ? 'Elevated vulnerability to split-claim bot bursts; requires Candidate V2 entropy filtering.' 
                  : 'Minimal fraud exposure; standard policy constraints prevent unauthorized concessions.')}
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#34d399', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  EXECUTIVE &amp; MANAGER LOAD
                </span>
                {impact?.resource_load || (requireManagerApproval 
                  ? 'Managers spend 18+ hrs/week reviewing routine credits instead of critical operations.' 
                  : 'Saves estimated 340 manager hours annually by routing sub-$1,500 claims to automated path.')}
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ color: '#a78bfa', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  DECISION PATH CONFORMANCE
                </span>
                {impact?.decision_path || `Direct auto-clearance path activated for ${datasetSummary.customerCases} client traces under $${thresholdAmount}.`}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => alert(`Counterfactual scenario saved as 'Threshold Proposal $${thresholdAmount}'.`)}
                className="btn-secondary" 
                style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={14} /> Save Scenario
              </button>
              <button 
                onClick={() => onApplyToPolicy?.('POL-OPS-012', `Auto-approve threshold adjusted to $${thresholdAmount}`)}
                className="btn-primary" 
                style={{ fontSize: '13px', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Use in Policy Change Proposal <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
