import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Clock, 
  Database, 
  Layers, 
  FileText, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Flame,
  UserCheck,
  Building,
  RotateCcw
} from 'lucide-react';
import { decideDecision } from '../../lib/api';
import type { OrganizationProfile } from '../layout/AppShell';

interface ActiveDecisionViewProps {
  currentOrg?: OrganizationProfile;
  onNavigateToRedTeam?: () => void;
  onNavigateToTrace?: (traceId: string) => void;
}

export const ActiveDecisionView: React.FC<ActiveDecisionViewProps> = ({
  currentOrg,
  onNavigateToRedTeam,
  onNavigateToTrace
}) => {
  const [customerTier, setCustomerTier] = useState<string>('enterprise');
  const [claimedAmount, setClaimedAmount] = useState<number>(750.0);
  const [incidentActive, setIncidentActive] = useState<boolean>(true);
  const [durationHours, setDurationHours] = useState<number>(2.5);
  const [entropy, setEntropy] = useState<number>(0.85); // 0.85 normal, 0.25 sybil
  const [situationText, setSituationText] = useState<string>(
    'Enterprise customer demanding SLA credit following API gateway disruption'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [decisionResult, setDecisionResult] = useState<any>(null);

  // Sync state whenever currentOrg changes
  useEffect(() => {
    if (currentOrg) {
      if (currentOrg.defaultSituation) {
        setSituationText(currentOrg.defaultSituation);
      }
      if (currentOrg.defaultClaim) {
        setClaimedAmount(currentOrg.defaultClaim);
      }
      if (currentOrg.slaHours) {
        setDurationHours(currentOrg.slaHours);
      }
      if (
        currentOrg.tier.toLowerCase().includes('enterprise') ||
        currentOrg.tier.toLowerCase().includes('banking') ||
        currentOrg.tier.toLowerCase().includes('critical') ||
        currentOrg.tier.toLowerCase().includes('mission')
      ) {
        setCustomerTier('enterprise');
      } else if (
        currentOrg.tier.toLowerCase().includes('pro') ||
        currentOrg.tier.toLowerCase().includes('volume')
      ) {
        setCustomerTier('pro');
      } else {
        setCustomerTier('starter');
      }
    }
  }, [currentOrg]);

  const handleExecuteHotPath = async () => {
    setLoading(true);
    try {
      const res = await decideDecision({
        situation: situationText,
        customer_tier: customerTier,
        claimed_amount: claimedAmount,
        incident_active: incidentActive,
        signals: {
          duration_hours: durationHours,
          subnet_cluster_entropy: entropy,
          claims_in_last_10m: entropy < 0.45 ? 5 : 1,
          mrr: customerTier === 'enterprise' ? (currentOrg?.mrr || 45000.0) : 8000.0,
          org_id: currentOrg?.id || 'org-apexcloud',
          moss_namespace: currentOrg?.mossNamespace || 'org-apexcloud-production',
        },
      });
      setDecisionResult(res);
    } catch (err) {
      console.error('Failed to execute decision hot path:', err);
    } finally {
      setLoading(false);
    }
  };

  const trace = decisionResult?.trace;

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1440px', margin: '0 auto', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.10)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              SYNCHRONOUS HOT PATH
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              SUB-10MS GUARANTEE
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '24px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '6px 0'
          }}>
            Active Decision Intake
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 400, margin: 0 }}>
            Real-time organizational decision pipeline: User/Event → Moss Retrieval → Decision Engine → Governance → Trace.
          </p>
        </div>

        <button
          onClick={handleExecuteHotPath}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 22px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            border: 'none',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 18px rgba(6, 182, 212, 0.3)',
            opacity: loading ? 0.7 : 1
          }}
        >
          <Zap size={16} />
          {loading ? 'Evaluating via Moss...' : 'EXECUTE DECISION HOT PATH'}
        </button>
      </div>

      {/* Active Organization Context Banner */}
      {currentOrg && (
        <div style={{
          marginBottom: '24px',
          background: 'rgba(6, 12, 24, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '12px',
          padding: '16px 20px',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: currentOrg.avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
            }}>
              {currentOrg.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                  {currentOrg.name}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  {currentOrg.id}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: currentOrg.riskLevel === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: currentOrg.riskLevel === 'Critical' ? '#f87171' : '#34d399',
                  border: `1px solid ${currentOrg.riskLevel === 'Critical' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}>
                  {currentOrg.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <span><strong>Domain:</strong> {currentOrg.domain}</span>
                <span>•</span>
                <span><strong>MRR:</strong> ${currentOrg.mrr.toLocaleString()}</span>
                <span>•</span>
                <span><strong>SLA:</strong> {currentOrg.slaHours}h response</span>
                <span>•</span>
                <span style={{ color: '#38bdf8' }}><strong>Moss Fabric:</strong> {currentOrg.mossNamespace}</span>
                <span>•</span>
                <span style={{ color: '#34d399' }}><strong>Policy:</strong> {currentOrg.activePolicyId}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (currentOrg) {
                setSituationText(currentOrg.defaultSituation);
                setClaimedAmount(currentOrg.defaultClaim);
                setDurationHours(currentOrg.slaHours);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#e2e8f0',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RotateCcw size={13} />
            Reset To Org Defaults
          </button>
        </div>
      )}

      {/* Main Grid: Decision Inputs & Real-Time Output */}
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Intake Parameters */}
        <div style={{
          background: 'rgba(6, 12, 24, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '12px',
          padding: '22px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
        }}>
          <h3 style={{ fontSize: '13px', color: '#38bdf8', letterSpacing: '0.06em', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} /> OBSERVABLE OPERATIONAL SIGNALS
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginBottom: '6px' }}>Customer Tier</label>
            <select
              value={customerTier}
              onChange={(e) => setCustomerTier(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '13px'
              }}
            >
              <option value="enterprise">Enterprise Tier ($45k MRR, 2h SLA)</option>
              <option value="pro">Pro Tier ($12k MRR, 4h SLA)</option>
              <option value="starter">Starter Tier ($4.2k MRR, 24h SLA)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginBottom: '6px' }}>Claimed Compensation Amount ($)</label>
            <input
              type="number"
              value={claimedAmount}
              onChange={(e) => setClaimedAmount(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#34d399',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 700
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginBottom: '6px' }}>Disruption Duration (Hours)</label>
            <input
              type="number"
              step="0.5"
              value={durationHours}
              onChange={(e) => setDurationHours(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '13px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginBottom: '6px' }}>Subnet Cluster Entropy (Sybil Attack Probe)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="range"
                min="0.10"
                max="1.0"
                step="0.05"
                value={entropy}
                onChange={(e) => setEntropy(parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: entropy < 0.45 ? '#f43f5e' : '#34d399',
                fontWeight: 700
              }}>
                {entropy.toFixed(2)} {entropy < 0.45 ? '(ANOMALY)' : '(NORMAL)'}
              </span>
            </div>
            <span style={{ fontSize: '10.5px', color: '#64748b' }}>
              Entropy &lt; 0.45 simulates coordinated Sybil bot attack pattern.
            </span>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11.5px', color: '#94a3b8', marginBottom: '6px' }}>Decision Context / Problem Statement</label>
            <textarea
              rows={3}
              value={situationText}
              onChange={(e) => setSituationText(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '12.5px',
                resize: 'none'
              }}
            />
          </div>

          <button
            onClick={handleExecuteHotPath}
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '6px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: '#38bdf8',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Processing via Moss...' : 'Trigger Decision Evaluation'}
          </button>
        </div>

        {/* Right Column: Hot Path Output & Decision Trace */}
        <div>
          {!decisionResult && !loading && (
            <div style={{
              background: 'rgba(6, 12, 24, 0.85)',
              border: '1px dashed rgba(255, 255, 255, 0.20)',
              borderRadius: '12px',
              padding: '60px 24px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
            }}>
              <Zap size={36} color="#06b6d4" style={{ marginBottom: '12px', opacity: 0.85 }} />
              <div style={{ fontSize: '17px', color: '#ffffff', fontWeight: 700, letterSpacing: '-0.01em' }}>Hot Path Decision Ready</div>
              <p style={{ color: '#94a3b8', fontSize: '13.5px', maxWidth: '440px', margin: '8px auto 20px auto', lineHeight: '1.5' }}>
                Click "EXECUTE DECISION HOT PATH" to trigger instant sub-10ms Moss retrieval, ground the decision against corporate policies, and produce an auditable Decision Trace.
              </p>
              <button
                onClick={handleExecuteHotPath}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.18)',
                  border: '1px solid rgba(6, 182, 212, 0.45)',
                  color: '#38bdf8',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Run Standard Enterprise Test Case
              </button>
            </div>
          )}

          {loading && (
            <div style={{
              background: 'rgba(6, 12, 24, 0.85)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              borderRadius: '12px',
              padding: '60px 24px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
            }}>
              <div style={{ color: '#38bdf8', fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em' }}>
                MOSS SUB-10MS RETRIEVAL IN PROGRESS...
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
                Grounding situation against active operating policies &amp; historical precedents for {currentOrg?.name || 'organization'}.
              </div>
            </div>
          )}

          {decisionResult && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Telemetry Bar */}
              <div style={{
                background: 'rgba(6, 12, 24, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
              }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>MOSS RETRIEVAL</div>
                  <div style={{ fontSize: '20px', color: '#34d399', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginTop: '2px' }}>
                    {decisionResult.moss_retrieval_latency_ms} ms
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL LATENCY</div>
                  <div style={{ fontSize: '20px', color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginTop: '2px' }}>
                    {decisionResult.total_latency_ms} ms
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>GROUNDING CONFIDENCE</div>
                  <div style={{ fontSize: '20px', color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginTop: '2px' }}>
                    {Math.round(decisionResult.confidence * 100)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>GOVERNANCE STATE</div>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: decisionResult.governance_state === 'EXECUTED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: decisionResult.governance_state === 'EXECUTED' ? '#34d399' : '#fbbf24',
                    border: `1px solid ${decisionResult.governance_state === 'EXECUTED' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                  }}>
                    {decisionResult.governance_state}
                  </span>
                </div>
              </div>

              {/* Action Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.45)',
                borderRadius: '12px',
                padding: '20px 24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.08em' }}>
                    DECISION ENGINE VERDICT • ID: {decisionResult.decision_id}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                    Version: {trace?.version_info?.playbook_version || '1.0.0'}
                  </span>
                </div>
                <div style={{ fontSize: '20px', color: '#ffffff', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {decisionResult.selected_action}
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '14px', marginTop: '8px', marginBottom: 0, lineHeight: '1.5' }}>
                  <strong style={{ color: '#38bdf8' }}>Reasoning:</strong> {trace?.reasoning}
                </p>
              </div>

              {/* Decision Trace Breakdown */}
              {trace && (
                <div style={{
                  background: 'rgba(6, 12, 24, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.10)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={17} color="#38bdf8" />
                      <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: 700 }}>
                        STRUCTURED DECISION TRACE
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>
                      MOSS PROVENANCE VERIFIED
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {/* Governing Policy */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
                        APPLICABLE POLICIES ({trace.applicable_policies?.length || 0})
                      </div>
                      {trace.applicable_policies?.map((pol: any, idx: number) => (
                        <div key={idx} style={{ fontSize: '12.5px', color: '#38bdf8', marginBottom: '6px' }}>
                          • <strong>{pol.code || pol.id}:</strong> {pol.title}
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
                        POLICY CONSTRAINTS
                      </div>
                      {trace.constraints?.map((con: string, idx: number) => (
                        <div key={idx} style={{ fontSize: '12.5px', color: '#e2e8f0', marginBottom: '6px' }}>
                          • {con}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Actions Considered */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
                      CANDIDATE ACTIONS EVALUATED
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {trace.candidate_actions?.map((act: any, idx: number) => {
                        const isChosen = act.action_name === trace.selected_action;
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderRadius: '6px',
                              background: isChosen ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                              border: `1px solid ${isChosen ? 'rgba(6, 182, 212, 0.45)' : 'rgba(255, 255, 255, 0.08)'}`
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {isChosen ? <CheckCircle2 size={16} color="#34d399" /> : <XCircle size={16} color="#64748b" />}
                              <span style={{ fontSize: '13px', color: isChosen ? '#38bdf8' : '#e2e8f0', fontWeight: isChosen ? 700 : 400 }}>
                                {act.action_name}
                              </span>
                            </div>
                            <span style={{ fontSize: '11.5px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                              {act.authority_required}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Action: Trigger Red Team / Async Loop */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.10)'
                  }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Decision emitted to Async Event Bus for background reliability evaluation.
                    </span>
                    <button
                      onClick={onNavigateToRedTeam}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        background: 'rgba(244, 63, 94, 0.18)',
                        border: '1px solid rgba(244, 63, 94, 0.35)',
                        color: '#f43f5e',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Flame size={14} /> Send to Red Team Stress-Test
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
