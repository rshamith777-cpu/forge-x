import React, { useState, useEffect } from 'react';
import { Dna, ShieldCheck, AlertTriangle, CheckCircle, FileText, ArrowRight, ExternalLink, Activity } from 'lucide-react';
import { fetchGenomes } from '../lib/api';

export const GenomesView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [selectedGenome, setSelectedGenome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inspectModal, setInspectModal] = useState<{ type: 'evidence' | 'policy' | 'exception'; title: string; content: any } | null>(null);

  useEffect(() => {
    fetchGenomes().then(res => {
      setData(res);
      if (res?.genomes?.length > 0) {
        setSelectedGenome(res.genomes[0]);
      }
      setLoading(false);
    });
  }, []);

  if (loading || !selectedGenome) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.05em', color: '#38bdf8' }}>
          RECONSTRUCTING ORGANIZATIONAL STATE...
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Compiling atomic units of organizational judgment from empirical traces.
        </div>
      </div>
    );
  }

  const handleOpenInspect = (type: 'evidence' | 'policy' | 'exception') => {
    if (type === 'evidence') {
      setInspectModal({
        type,
        title: 'Retrieved Empirical Evidence',
        content: selectedGenome.evidence || ['EV-TRACE-8841 (Slack channel #outages)', 'EV-STRIPE-9921 (Direct credit authorization)', 'EV-INC-0012 (Tier 1 customer bypass log)'],
      });
    } else if (type === 'policy') {
      setInspectModal({
        type,
        title: 'Governing Corporate Policy',
        content: {
          policy_id: selectedGenome.policy_dependencies?.[0] || 'POL-OPS-012',
          title: 'SLA Escalation & Refund Authority',
          formal_rule: 'Director approval required for refunds > $500, with SLA maximum response time of 48 hours.',
          divergence_note: 'Empirically overridden in 87% of high-severity customer outage traces via war-room bypass.'
        }
      });
    } else if (type === 'exception') {
      setInspectModal({
        type,
        title: 'Mined Exception: EXC-FRAUD-SYBIL',
        content: selectedGenome.exceptions?.[0] || {
          id: 'EXC-FRAUD-SYBIL',
          classification: 'Adversarial Defense',
          trigger_condition: 'claims_per_account_10m > 2 OR subnet_cluster_entropy < 0.50',
          action: 'Immediately halt auto-approval and route to biometric verification'
        }
      });
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">POLICY GOVERNANCE</span>
            <span className="badge badge-emerald">RULE POL-OPS-012 ACTIVE</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            Operating Policy Rules & Governance Standards
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Formalized approval thresholds, operational boundaries, and exception rules governing customer claim decisions.
          </p>
        </div>

        <button className="btn-primary" onClick={() => onNavigate('simulate')}>
          Simulate Policy Changes <ArrowRight size={15} />
        </button>
      </div>

      {/* Main Layout: Primitive Genome Card + Live Trace Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left: The Formal Decision Genome Primitive (Structured Card) */}
        <div className="glass-panel" style={{ 
          padding: '24px', 
          border: '1px solid rgba(99, 102, 241, 0.5)',
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#818cf8', letterSpacing: '0.08em' }}>DECISION GENOME</div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>DG-0142</div>
            </div>
            <span className="badge badge-cyan">PRIMITIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Situation */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>SITUATION</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginTop: '4px' }}>
                High-value customer refund request during cloud outage
              </div>
            </div>

            {/* Signals */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>SIGNALS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                  • payment_velocity: normal (1 txn / 30d)
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                  • account_history: 36 months active
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                  • customer_tier: Enterprise Tier-1 ($120k ARR)
                </div>
              </div>
            </div>

            {/* Tacit Assumption */}
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.05em' }}>TACIT ASSUMPTION</div>
              <div style={{ fontSize: '13px', color: '#fef3c7', marginTop: '4px', fontWeight: 500 }}>
                VIP customers bypass the 48-hour director queue to prevent public churn.
              </div>
            </div>

            {/* Governing Policy (Clickable) */}
            <div 
              onClick={() => handleOpenInspect('policy')}
              style={{ 
                background: 'rgba(99, 102, 241, 0.12)', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid rgba(99, 102, 241, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#818cf8', letterSpacing: '0.05em' }}>GOVERNING POLICY</div>
                <span style={{ fontSize: '10px', color: '#c084fc' }}>Click to reveal ↗</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px', fontFamily: 'monospace' }}>
                POL-OPS-012
              </div>
            </div>

            {/* Exceptions (Clickable) */}
            <div 
              onClick={() => handleOpenInspect('exception')}
              style={{ 
                background: 'rgba(244, 63, 94, 0.12)', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid rgba(244, 63, 94, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#fb7185', letterSpacing: '0.05em' }}>EXCEPTIONS</div>
                <span style={{ fontSize: '10px', color: '#fb7185' }}>Click to reveal ↗</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px', fontFamily: 'monospace' }}>
                EXC-FRAUD-SYBIL
              </div>
            </div>

            {/* Evidence (Clickable) */}
            <div 
              onClick={() => handleOpenInspect('evidence')}
              style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid rgba(16, 185, 129, 0.4)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>SUPPORTING EVIDENCE</div>
                <span style={{ fontSize: '10px', color: '#34d399' }}>Click to reveal ↗</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginTop: '4px' }}>
                3 Verified Artifacts (Slack, Stripe, Jira)
              </div>
            </div>

            {/* Confidence & Risk */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>CONFIDENCE</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#34d399', fontFamily: 'monospace' }}>94%</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)' }}>RISK</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>MEDIUM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Context & Evaluated Candidates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Situation & Rationale Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              Organizational Reasoning Pattern
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              FORGE observed that human operations managers consistently diverge from standard SOP when enterprise clients file claims during acknowledged platform degradation. The Decision Genome compiles this tacit tribal wisdom into an executable, governable rule.
            </p>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>COMPILED ACTION</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                  fast_track_direct_credit
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WIN RATE</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                  96.5% CSAT Success
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CYCLE TIME REDUCTION</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
                  48h → 1.1h (97% Faster)
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Actions Evaluated */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Evaluated Candidate Actions & Payoffs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#34d399' }}>fast_track_direct_credit</strong>
                    <span className="badge badge-emerald">COMPILED PREFERRED</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Instant billing credit with war-room Slack notification to executive account team.
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#34d399' }}>96% Win Rate</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1.1h Latency</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#e2e8f0', fontWeight: 600 }}>standard_director_escalation</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Place ticket into 4-tier director approval queue (48h documented standard).
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#94a3b8' }}>38% Conformance</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>48.0h Latency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8: "WHY DID WE DO THAT?" — VISUAL PROVENANCE TRACE */}
      <div className="glass-panel" style={{ padding: '28px', marginTop: '28px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-indigo">STORY 02 — WHY DID WE MAKE THAT DECISION?</span>
              <span className="badge badge-emerald">ZERO POST-HOC RATIONALIZATION</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>
              "Why Did We Do That?" — Backward Decision Provenance Trace
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Every decision can be traced backward to the evidence that produced it. If evidence is unavailable: "Insufficient evidence."
            </p>
          </div>

          <span className="badge badge-cyan font-mono">INSPECTING: DEC-0001</span>
        </div>

        {/* 7-Step Provenance Cascade Graphic */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', position: 'relative' }}>
          {/* Node 1: DECISION */}
          <div className="glass-card" style={{ padding: '14px', borderTop: '3px solid #6366f1' }}>
            <div style={{ fontSize: '10px', color: '#818cf8', fontWeight: 800 }}>1. DECISION</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              DEC-0001
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: Stripe + Slack<br/>
              TS: 2026-08-01 10:28Z<br/>
              Conf: 94%<br/>
              Prov: Trace #8841
            </div>
          </div>

          {/* Node 2: MATCHED GENOME */}
          <div className="glass-card" style={{ padding: '14px', borderTop: '3px solid #06b6d4' }}>
            <div style={{ fontSize: '10px', color: '#06b6d4', fontWeight: 800 }}>2. GENOME</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              DG-0142
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: Genome Registry<br/>
              TS: 2026-08-01 08:00Z<br/>
              Conf: 96.5%<br/>
              Prov: Seeded Ontology
            </div>
          </div>

          {/* Node 3: GOVERNING POLICY */}
          <div className="glass-card" style={{ padding: '14px', borderTop: '3px solid #a855f7' }}>
            <div style={{ fontSize: '10px', color: '#a855f7', fontWeight: 800 }}>3. GOVERNING POLICY</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
              POL-OPS-012
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: Corporate SOP<br/>
              TS: 2026-06-15 00:00Z<br/>
              Conf: 100%<br/>
              Prov: Policy Repo #12
            </div>
          </div>

          {/* Node 4: RETRIEVED EVIDENCE */}
          <div className="glass-card" style={{ padding: '14px', borderTop: '3px solid #10b981' }}>
            <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 800 }}>4. EVIDENCE</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              3 Observables
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: Local Fabric<br/>
              TS: 2026-08-01 10:28Z<br/>
              Conf: 98%<br/>
              Prov: In-Process BM25
            </div>
          </div>

          {/* Node 5: HISTORICAL PRECEDENTS */}
          <div className="glass-card" style={{ padding: '14px', borderTop: '3px solid #fbbf24' }}>
            <div style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 800 }}>5. PRECEDENTS</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
              82 Similar Traces
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: Event Store<br/>
              TS: Prior 30 Days<br/>
              Conf: 96%<br/>
              Prov: Cluster D-42
            </div>
          </div>

          {/* Node 6: EXCEPTIONS */}
          <div className="glass-card" style={{ padding: '14px', borderTop: '3px solid #f43f5e' }}>
            <div style={{ fontSize: '10px', color: '#f43f5e', fontWeight: 800 }}>6. EXCEPTIONS</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#fb7185', marginTop: '4px' }}>
              EXC-FRAUD-SYBIL
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: Red Team V2<br/>
              TS: 2026-08-01 10:25Z<br/>
              Conf: 94%<br/>
              Prov: Velocity Monitor
            </div>
          </div>

          {/* Node 7: ACTION */}
          <div className="glass-card" style={{ padding: '14px', borderTop: '3px solid #34d399' }}>
            <div style={{ fontSize: '10px', color: '#34d399', fontWeight: 800 }}>7. ACTION</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              Fast-Track Executed
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Source: Engine Execution<br/>
              TS: 2026-08-01 10:28Z<br/>
              Conf: 94%<br/>
              Prov: Action Log #901
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Clicking Evidence, Policy, Exception */}
      {inspectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(6px)'
        }}>
          <div className="glass-panel" style={{ 
            maxWidth: '560px', 
            width: '90%', 
            padding: '24px', 
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                {inspectModal.title}
              </h3>
              <button 
                onClick={() => setInspectModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', color: '#38bdf8' }}>
                {JSON.stringify(inspectModal.content, null, 2)}
              </pre>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button 
                className="btn-primary" 
                onClick={() => setInspectModal(null)}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
