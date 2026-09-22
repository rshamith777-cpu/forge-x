import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, AlertTriangle, ArrowRight, PlusCircle, 
  Search, Lock, CheckCircle2, GitFork, RefreshCw, ChevronRight, X
} from 'lucide-react';
import { fetchPoliciesSummary } from '../../lib/api';

export interface PoliciesViewProps {
  initialPolicyId?: string | null;
  onNavigateToScenario?: () => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ initialPolicyId, onNavigateToScenario }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'authority' | 'exceptions' | 'changes'>('active');
  const [policies, setPolicies] = useState<any[]>([]);
  const [authorityMatrix, setAuthorityMatrix] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const [showChangeModal, setShowChangeModal] = useState(false);

  useEffect(() => {
    fetchPoliciesSummary().then((res: any) => {
      const pols = res.policies || [];
      setPolicies(pols);
      setAuthorityMatrix(res.authority_matrix || []);
      if (initialPolicyId) {
        const match = pols.find((p: any) => p.code.toLowerCase() === initialPolicyId.toLowerCase());
        if (match) setSelectedPolicy(match);
      }
      setLoading(false);
    }).catch((err: any) => {
      console.error("Failed to load policies", err);
      setLoading(false);
    });
  }, [initialPolicyId]);

  const filteredPolicies = policies.filter(p => 
    searchQuery === '' || 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1360px', margin: '0 auto', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            Policies
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 300, margin: 0 }}>
            Manage the operating rules, approval limits, and exception standards that govern daily customer settlements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowChangeModal(true)}
            className="btn-primary"
            style={{ fontSize: '13.5px', padding: '10px 18px', borderRadius: '8px' }}
          >
            <PlusCircle size={15} /> Create Policy Change
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'active' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: activeTab === 'active' ? '#38bdf8' : '#94a3b8',
              fontWeight: activeTab === 'active' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Active Policies ({policies.length})
          </button>
          <button
            onClick={() => setActiveTab('authority')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'authority' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: activeTab === 'authority' ? '#38bdf8' : '#94a3b8',
              fontWeight: activeTab === 'authority' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Authority Rules
          </button>
          <button
            onClick={() => setActiveTab('exceptions')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'exceptions' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: activeTab === 'exceptions' ? '#38bdf8' : '#94a3b8',
              fontWeight: activeTab === 'exceptions' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Exceptions (3)
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'changes' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: activeTab === 'changes' ? '#38bdf8' : '#94a3b8',
              fontWeight: activeTab === 'changes' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Policy Changes
          </button>
        </div>

        {activeTab === 'active' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '6px 12px'
          }}>
            <Search size={14} color="#64748b" />
            <input 
              type="text"
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '180px' }}
            />
          </div>
        )}
      </div>

      {/* TAB 1: ACTIVE POLICIES */}
      {activeTab === 'active' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
          {filteredPolicies.map(pol => (
            <div 
              key={pol.id}
              onClick={() => setSelectedPolicy(pol)}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '10px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                    {pol.code}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '10px' }}>ACTIVE</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>v{pol.version}</span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '0 0 8px 0' }}>
                {pol.title}
              </h3>

              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                {pol.clause_text}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0, 0, 0, 0.3)', padding: '10px', borderRadius: '6px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Max Auto-Refund:</span>
                  <strong style={{ color: '#34d399', marginLeft: '6px' }}>${pol.max_refund_auto}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Approval Over:</span>
                  <strong style={{ color: '#fbbf24', marginLeft: '6px' }}>${pol.requires_approval_over}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: AUTHORITY RULES */}
      {activeTab === 'authority' && (
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '10px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>
              Delegation of Financial Authority (DoA)
            </h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              Defines the authorized credit limits that individual roles can approve without executive escalation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {authorityMatrix.map((tier, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>{tier.tier}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Target SLA Window: {tier.sla_hours} hours</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#34d399' }}>
                  Up to ${tier.max_amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXCEPTIONS */}
      {activeTab === 'exceptions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#f87171', fontFamily: 'monospace' }}>
                EXC-FRAUD-SYBIL • ADVERSARIAL DEFENSE
              </span>
              <span className="badge badge-rose">ENFORCED</span>
            </div>
            <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: '#ffffff', margin: '0 0 6px 0' }}>
              Sub-Account Velocity & Sybil Defense
            </h4>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              <strong>Condition:</strong> If more than 2 claims are submitted across related customer sub-accounts within a 15-minute window, automatic clearance is halted immediately.
            </p>
            <div style={{ fontSize: '12px', color: '#38bdf8' }}>
              Action: Route directly to Senior Operations Manager for dual-signoff.
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#fbbf24', fontFamily: 'monospace' }}>
                EXC-OUTAGE-WARROOM • CHURN MITIGATION
              </span>
              <span className="badge badge-amber">ACTIVE MONITORING</span>
            </div>
            <h4 style={{ fontSize: '15.5px', fontWeight: 600, color: '#ffffff', margin: '0 0 6px 0' }}>
              Slack War-Room Executive Fast-Track
            </h4>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              <strong>Condition:</strong> Customer churn score &gt; 0.70 during Sev-1 cloud infrastructure outage.
            </p>
            <div style={{ fontSize: '12px', color: '#34d399' }}>
              Action: Extends discretionary credit limit up to $1,500 without waiting for 48h Jira queue.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POLICY CHANGES WORKFLOW */}
      {activeTab === 'changes' && (
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '10px', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>
              Governed Policy Change Workflow
            </h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
              Policy changes must be simulated and risk-reviewed before publishing to production runtime.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '18px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#38bdf8' }}>
            <span>Current Rule</span> → <span>Proposed Change</span> → <span>Impact Analysis</span> → <span>Risk Review</span> → <span>Publish</span>
          </div>

          <div style={{ padding: '20px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '8px' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
              Pending Proposal: PC-104 (Increase Tier-2 Manager Limit to $1,500)
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>
              Proposed by Rahul Verma (Director of Ops) to reduce customer outage resolution backlog.
            </div>
            <button 
              onClick={onNavigateToScenario}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <GitFork size={15} /> Run Scenario Simulation in Scenario Planning →
            </button>
          </div>
        </div>
      )}

      {/* CREATE POLICY CHANGE MODAL */}
      {showChangeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90
        }}
        onClick={() => setShowChangeModal(false)}
        >
          <div 
            style={{ width: '540px', background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.16)', borderRadius: '12px', padding: '28px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Draft Policy Change</h3>
              <button onClick={() => setShowChangeModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>TARGET POLICY</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '13.5px' }}>
                <option>POL-OPS-012 — Refund & Credit Authorization Limits</option>
                <option>POL-SLA-ENT — Enterprise Disruption Response Standard</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>PROPOSED THRESHOLD CHANGE ($)</label>
              <input type="number" defaultValue={1500} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '13.5px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowChangeModal(false)} className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowChangeModal(false);
                  if (onNavigateToScenario) onNavigateToScenario();
                }} 
                className="btn-primary" 
                style={{ fontSize: '13px', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <GitFork size={14} /> Test in Scenario Planning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
