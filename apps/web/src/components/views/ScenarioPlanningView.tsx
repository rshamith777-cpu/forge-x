import React, { useState, useEffect } from 'react';
import { 
  GitFork, Sliders, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, Download, Save, ShieldCheck, DollarSign, Clock, Users
} from 'lucide-react';
import { runForkReality } from '../../lib/api';

export interface ScenarioPlanningViewProps {
  prefillScenarioName?: string;
  onApplyToPolicy?: (policyId: string, rule: string) => void;
}

export const ScenarioPlanningView: React.FC<ScenarioPlanningViewProps> = ({ prefillScenarioName, onApplyToPolicy }) => {
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
      const data = await runForkReality({
        threshold_amount: thresholdAmount,
        auto_approve_enterprise: autoApproveEnterprise,
        sla_escalation_hours: slaHours,
        require_manager_approval: requireManagerApproval,
        fraud_check_strictness: fraudStrictness,
        iterations: 1000,
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
  }, []);

  const current = result?.current_policy;
  const modified = result?.modified_policy;
  const tradeoff = result?.tradeoff_summary;

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Side-by-Side Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Current Policy */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>BASELINE (CURRENT RULE)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>$500 Limit • 48h Queue</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Annual Concession Cost:</span>
                  <strong style={{ color: '#fff' }}>${(current?.annual_cost || 142000).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Customer Churn Rate:</span>
                  <strong style={{ color: '#f87171' }}>{((current?.churn_rate || 0.14) * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Avg Resolution Time:</span>
                  <strong style={{ color: '#fbbf24' }}>{current?.avg_resolution_time_hours || 18.4}h</strong>
                </div>
              </div>
            </div>

            {/* Proposed Policy */}
            <div style={{ background: 'rgba(6, 12, 26, 0.95)', border: '1px solid rgba(6, 182, 212, 0.4)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.05em' }}>PROPOSED SCENARIO</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>${thresholdAmount} Limit • {slaHours}h Target</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Annual Concession Cost:</span>
                  <strong style={{ color: '#38bdf8' }}>${(modified?.annual_cost || 168000).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Customer Churn Rate:</span>
                  <strong style={{ color: '#34d399' }}>{((modified?.churn_rate || 0.048) * 100).toFixed(1)}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Avg Resolution Time:</span>
                  <strong style={{ color: '#34d399' }}>{modified?.avg_resolution_time_hours || 1.2}h</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Support Tradeoffs Box */}
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '10px', padding: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px 0' }}>
              Key Tradeoffs & Decision Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
              <div>
                • <strong>Customer Retention:</strong> Reduces churn by ~65% among Enterprise Tier clients by resolving outage claims in under 2 hours.
              </div>
              <div>
                • <strong>Budget Exposure:</strong> Increases monthly concession outflow by ~18% ($26,000 annually), offset by $480,000 in retained enterprise ARR.
              </div>
              <div>
                • <strong>Operational Burden:</strong> Frees an estimated 170 staff hours per quarter previously spent on director approval tickets.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={() => alert(`Scenario saved as 'Threshold Proposal $${thresholdAmount}'.`)}
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
