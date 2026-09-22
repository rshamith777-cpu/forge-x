import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Flame, 
  FileText, 
  Lock, 
  RefreshCw, 
  Sliders,
  ExternalLink,
  FlaskConical,
  Award
} from 'lucide-react';
import { fetchCandidateV2, approveCandidatePolicy } from '../../lib/api';

interface CandidateV2ViewProps {
  onNavigateToLab?: () => void;
  onNavigateToMemory?: () => void;
}

export const CandidateV2View: React.FC<CandidateV2ViewProps> = ({
  onNavigateToLab,
  onNavigateToMemory
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [approving, setApproving] = useState<boolean>(false);
  const [approvalSuccess, setApprovalSuccess] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchCandidateV2();
      setData(res);
    } catch (err) {
      console.error('Failed to load candidate V2:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await approveCandidatePolicy({
        candidate_id: data?.candidate_playbook_v2?.candidate_id || "CAND-PB-V2-SYBIL-HARDENED",
        reviewer: "Sarah Jenkins (VP of Operations)",
        action: "APPROVE",
        notes: "Approved following empirical verification in FORGE LAB (94% adversarial defense rate)."
      });
      setApprovalSuccess(res);
      await loadData();
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setApproving(false);
    }
  };

  const cand = data?.candidate_playbook_v2;
  const isApproved = cand?.status === 'APPROVED' || approvalSuccess !== null;

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1440px', margin: '0 auto', textAlign: 'left', fontFamily: "'Rowdies', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(244, 63, 94, 0.15)',
              color: '#f43f5e',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              FAILURE ANALYSIS &amp; POLICY EVOLUTION
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isApproved ? '#34d399' : '#fbbf24',
              border: `1px solid ${isApproved ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}>
              {isApproved ? 'STATUS: APPROVED & ACTIVE' : 'STATUS: PENDING HUMAN APPROVAL'}
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '20px',
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: '8px 0'
          }}>
            Candidate Playbook V2
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 300, margin: 0 }}>
            Controlled policy evolution: AI generates Candidate V2 from failure analysis, verified in FORGE LAB, requiring human authorization.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onNavigateToLab}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: '#38bdf8',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <FlaskConical size={16} /> Open in FORGE LAB
          </button>

          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={approving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: approving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckCircle2 size={16} />
              {approving ? 'Promoting to Memory...' : 'APPROVE & PROMOTE V2 TO PRODUCTION'}
            </button>
          ) : (
            <button
              onClick={onNavigateToMemory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Award size={16} /> View in Organizational Memory
            </button>
          )}
        </div>
      </div>

      {/* Security Invariant Alert */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Lock size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: '#fef3c7' }}>
          <strong>CRITICAL SECURITY INVARIANT:</strong> The AI never directly modifies production policies. Red Team attacks only generate Candidate Playbook V2. It remains quarantined until verified through FORGE LAB regression tests and authorized by human leadership.
        </span>
      </div>

      {/* Grid: Failure Pattern & Candidate V2 Specification */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Failure Pattern Extraction */}
        <div style={{
          background: '#0d1527',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Flame size={18} color="#f43f5e" />
            <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.04em', margin: 0 }}>
              EXPOSED FAILURE PATTERN
            </h3>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700, marginBottom: '4px' }}>
              ATTACK VECTOR DETECTED
            </div>
            <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>
              Coordinated Sub-Threshold Sybil Payout Burst
            </div>
            <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '6px' }}>
              Exploits the $500 auto-refund threshold by deploying 100 synthetic bot accounts claiming $485-$499 in parallel during active outages.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>V1 BREACH RATE</div>
              <div style={{ fontSize: '24px', color: '#f43f5e', fontFamily: 'monospace', fontWeight: 700 }}>
                67%
              </div>
              <div style={{ fontSize: '11px', color: '#fb7185' }}>67 of 100 bots auto-cleared</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>ESTIMATED LOSS</div>
              <div style={{ fontSize: '24px', color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700 }}>
                $33,433
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Unrestricted fraudulent payout</div>
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#cbd5e1' }}>
            <strong>Root Cause:</strong> POL-OPS-012 checked absolute refund amounts ($500) but lacked compound velocity controls across IP subnets and account clusters.
          </div>
        </div>

        {/* Right Column: Candidate Playbook V2 Solution */}
        <div style={{
          background: '#0d1527',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitBranch size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.04em', margin: 0 }}>
                PROPOSED CANDIDATE PLAYBOOK V2
              </h3>
            </div>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8' }}>
              ID: {cand?.candidate_id || 'CAND-PB-V2-SYBIL-HARDENED'}
            </span>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700, marginBottom: '4px' }}>
              PROPOSED POLICY AMENDMENT
            </div>
            <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>
              {cand?.proposed_change || 'Codify Fast-Track Direct Credit up to $1,500 for enterprise accounts with EXC-FRAUD-SYBIL compound velocity exception.'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>ROBUSTNESS DELTA</div>
              <div style={{ fontSize: '24px', color: '#34d399', fontFamily: 'monospace', fontWeight: 700 }}>
                +61.0%
              </div>
              <div style={{ fontSize: '11px', color: '#34d399' }}>V1: 33% → V2: 94%</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>REGRESSION RISK</div>
              <div style={{ fontSize: '24px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                0.8%
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Within enterprise bounds</div>
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#cbd5e1', marginBottom: '20px' }}>
            <strong>Compound Exception Rule:</strong>
            <pre style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '10px',
              borderRadius: '6px',
              color: '#34d399',
              fontSize: '11.5px',
              fontFamily: 'monospace',
              marginTop: '6px'
            }}>
              IF claims_per_account_10m &gt; 2 OR subnet_cluster_entropy &lt; 0.50{"\n"}
              THEN HALT auto-approval AND ROUTE to biometric security verification
            </pre>
          </div>

          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={approving}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {approving ? 'Promoting to Production...' : 'Sign & Authorize Playbook V2 Deployment'}
            </button>
          ) : (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 700
            }}>
              ✓ AUTHORIZED BY SARAH JENKINS (VP OF OPERATIONS) • ACTIVE IN PRODUCTION
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
