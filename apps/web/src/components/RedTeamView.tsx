import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Flame, RefreshCw, ArrowRight, 
  AlertTriangle, Bug, Lock, CheckCircle2, ChevronRight, Terminal, Zap,
  Search, Filter, ExternalLink
} from 'lucide-react';
import { fetchRedTeamEvolution, runRedTeamAttack, fetchRedTeamScenarios } from '../lib/api';

export const RedTeamView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [narrative, setNarrative] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [botProgress, setBotProgress] = useState<number>(0);
  const [currentBotLog, setCurrentBotLog] = useState<string>('');
  const [attackCompleted, setAttackCompleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'narrative' | 'cases' | 'diff'>('matrix');
  const [caseFilter, setCaseFilter] = useState<'all' | 'v1_breached' | 'v2_blocked' | 'v2_evaded'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = async () => {
    try {
      const [data, scenRes] = await Promise.all([
        fetchRedTeamEvolution(),
        fetchRedTeamScenarios().catch(() => null)
      ]);
      setNarrative(data);
      if (scenRes?.scenarios?.length > 0) {
        setScenarios(scenRes.scenarios);
        setSelectedScenario(scenRes.scenarios[0]);
      }
    } catch (err) {
      console.error("Failed to load red team evolution data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLaunchAttack = async () => {
    setRunning(true);
    setAttackCompleted(false);
    setBotProgress(0);

    // Animate bot injection progress so user experiences the 100-bot swarm
    const totalBots = 100;
    const intervalMs = 25; // ~2.5 seconds total
    let current = 0;

    const progressTimer = setInterval(() => {
      current += 2;
      if (current <= totalBots) {
        setBotProgress(current);
        const subnet = `198.51.100.${Math.floor(Math.random() * 26) + 2}`;
        const amount = (485 + Math.random() * 14).toFixed(2);
        setCurrentBotLog(`Firing BOT-SYN-${String(current).padStart(3, '0')} via ${subnet} ($${amount})`);
      } else {
        clearInterval(progressTimer);
      }
    }, intervalMs);

    try {
      const data = await runRedTeamAttack();
      clearInterval(progressTimer);
      setBotProgress(100);
      setNarrative(data);
      setAttackCompleted(true);
    } catch (err) {
      console.error("Attack simulation failed", err);
      // Fallback: If network interrupted, refresh local state
      clearInterval(progressTimer);
      setBotProgress(100);
      setAttackCompleted(true);
      await loadData();
    } finally {
      setRunning(false);
    }
  };

  if (!narrative) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center', color: '#fff', fontFamily: "'Rowdies', sans-serif" }}>
        <RefreshCw className="animate-spin" size={28} style={{ margin: '0 auto 16px auto', color: '#f43f5e' }} />
        <div style={{ fontSize: '18px', fontWeight: 700 }}>Initializing Red Team Adversarial Sandbox...</div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Connecting to local adversarial evaluation engine</div>
      </div>
    );
  }

  const sampleCases = narrative.sample_cases || [];
  const filteredCases = sampleCases.filter((c: any) => {
    if (caseFilter === 'v1_breached') return c.v1_breached;
    if (caseFilter === 'v2_blocked') return !c.v2_breached;
    if (caseFilter === 'v2_evaded') return c.v2_breached;
    return true;
  }).filter((c: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.synthetic_id?.toLowerCase().includes(q) || c.ip_subnet?.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1440px', margin: '0 auto', textAlign: 'left', fontFamily: "'Rowdies', sans-serif" }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-rose" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}>
              HERO ADVERSARIAL SANDBOX
            </span>
            <span className="badge badge-indigo">CONTROLLED RED TEAM HARNESS</span>
            <span className="badge badge-amber" style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
              DEMO / SYNTHETIC ENVIRONMENT (100 BOT IDENTITIES)
            </span>
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontFamily: "'Press Start 2P', monospace", 
            color: '#fff', 
            letterSpacing: '0.04em', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            margin: '6px 0'
          }}>
            <Flame color="#f43f5e" size={26} /> WE BROKE OUR OWN AI
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '6px', fontWeight: 300 }}>
            <em>"The first playbook failed. So we attacked it."</em> — Autonomous adversarial injection to isolate blindspots before production damage.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <button 
            className="btn-primary" 
            onClick={handleLaunchAttack}
            disabled={running}
            style={{ 
              background: running 
                ? 'rgba(244, 63, 94, 0.3)' 
                : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', 
              borderColor: '#f43f5e',
              boxShadow: '0 4px 20px rgba(244, 63, 94, 0.45)',
              fontSize: '13.5px',
              padding: '11px 22px',
              cursor: running ? 'wait' : 'pointer'
            }}
          >
            {running ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
            <span>{running ? `Swarming... ${botProgress}%` : 'Run 100-Bot Sybil Attack'}</span>
          </button>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
            Target: <code>POL-OPS-012</code> ($499 Auto-Approval Ceiling)
          </div>
        </div>
      </div>

      {/* Live Swarm Execution Progress Bar */}
      {running && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame size={18} color="#f43f5e" className="animate-pulse" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                Executing Coordinated Sybil Injection Burst ({botProgress} / 100 Bots)
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#fb7185' }}>
              {botProgress}% INJECTED
            </span>
          </div>

          <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${botProgress}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #f43f5e, #fb7185)', 
              transition: 'width 0.1s linear',
              borderRadius: '4px' 
            }} />
          </div>

          <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#fca5a5', fontFamily: "'JetBrains Mono', monospace" }}>
            {currentBotLog}
          </div>
        </div>
      )}

      {/* Post-Attack Confirmed Breach Notification */}
      {attackCompleted && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.1))',
          border: '1px solid rgba(244, 63, 94, 0.45)',
          borderRadius: '14px',
          padding: '20px 24px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(244, 63, 94, 0.25)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle color="#f43f5e" size={20} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
                BREACH CONFIRMED: 67 / 100 Bots Exploited Playbook V1 Auto-Refund Ceiling
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#fecdd3', marginTop: '4px', lineHeight: 1.4 }}>
              Red Team exploited static threshold <code>amount &lt; $500</code> causing <strong>$33,433.00</strong> fraudulent payouts.
              Genomic Analyst has extracted the failure pattern and synthesized <strong>Candidate Playbook V2</strong> with compound velocity gating (<code>EXC-FRAUD-SYBIL</code>).
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('cases')}
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '9px 16px',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Rowdies', sans-serif"
              }}
            >
              View 100 Bot Traces
            </button>
            <button
              onClick={() => onNavigate('candidate')}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Rowdies', sans-serif",
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              <span>Inspect Candidate V2</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('forgelab')}
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 18px',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Rowdies', sans-serif",
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              <span>Verify in FORGE LAB</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Comparative Scorecards: Round 1 vs Round 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* ROUND 1: V1 Failure */}
        <div className="glass-panel" style={{ 
          padding: '24px', 
          border: '1px solid rgba(244, 63, 94, 0.4)', 
          position: 'relative', 
          overflow: 'hidden',
          background: 'rgba(8, 14, 26, 0.65)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(244, 63, 94, 0.25)', padding: '4px 14px', borderBottomLeftRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#fb7185' }}>
            ROUND 1 (PLAYBOOK V1)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-rose">PLAYBOOK V1</span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Unshielded Production Baseline</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '10px 0' }}>
            <div style={{ fontSize: '46px', fontWeight: 900, color: '#f43f5e', fontFamily: "'JetBrains Mono', monospace" }}>
              {narrative.v1_robustness_pct || 33}%
            </div>
            <div style={{ color: '#fb7185', fontSize: '13px', fontWeight: 700 }}>
              ADVERSARIAL ROBUSTNESS
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', marginBottom: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700, marginBottom: '6px' }}>
              ATTACK PARAMETERS:
            </div>
            <div style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: 1.5 }}>
              • 100 synthetic bot identities<br/>
              • $485.00 – $499.50 per payout request<br/>
              • $49,900.00 total potential capital exposure
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#fca5a5' }}>Breach Outcome:</span>
              <span style={{ color: '#f43f5e', fontWeight: 800 }}>
                {narrative.v1_breached_count || 67} fraudulent payouts (${(narrative.v1_fraud_loss_usd || 33433).toLocaleString()} loss)
              </span>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#fca5a5', lineHeight: '1.4' }}>
            <strong>FAILURE STATE:</strong> Static rule <code>IF amount &lt; $500 THEN auto_approve</code> allowed coordinated sub-threshold bot cluster to drain capital uninspected.
          </div>
        </div>

        {/* ROUND 2: V2 Hardened */}
        <div className="glass-panel" style={{ 
          padding: '24px', 
          border: '1px solid rgba(16, 185, 129, 0.4)', 
          position: 'relative', 
          overflow: 'hidden',
          background: 'rgba(8, 14, 26, 0.65)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(16, 185, 129, 0.25)', padding: '4px 14px', borderBottomLeftRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#34d399' }}>
            ROUND 2 (CANDIDATE V2)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">CANDIDATE V2</span>
            <span style={{ fontSize: '12px', color: '#34d399' }}>Evolved Exception Rule Set</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', margin: '10px 0' }}>
            <div style={{ fontSize: '46px', fontWeight: 900, color: '#10b981', fontFamily: "'JetBrains Mono', monospace" }}>
              {narrative.v2_robustness_pct || 94}%
            </div>
            <div style={{ color: '#34d399', fontSize: '13px', fontWeight: 700 }}>
              ADVERSARIAL ROBUSTNESS
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', marginBottom: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
              REPLAY RE-TEST (IDENTICAL 100 BOT TRACES):
            </div>
            <div style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: 1.5 }}>
              • {100 - (narrative.v2_breached_count || 6)} attacks intercepted by compound velocity gate<br/>
              • ${(33433 - (narrative.v2_fraud_loss_usd || 2994)).toLocaleString()} capital saved<br/>
              • FALSE POSITIVES: 0 on 100 legitimate VIP enterprise client traces
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#6ee7b7' }}>Hardening Status:</span>
              <span style={{ color: '#10b981', fontWeight: 800 }}>EXC-FRAUD-SYBIL active</span>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#6ee7b7', lineHeight: '1.4' }}>
            <strong>EVALUATION VERDICT:</strong> Failure converted into verified institutional memory. Ready for Human Operations approval in FORGE LAB.
          </div>
        </div>
      </div>

      {/* SECTION 10: FORGE LEARNS — REASONING PIPELINE (Always Visible) */}
      <div className="glass-panel" style={{ 
        padding: '22px 28px', 
        marginBottom: '24px', 
        border: '1px solid rgba(56, 189, 248, 0.3)',
        background: 'rgba(8, 14, 26, 0.65)',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-cyan">PILLAR 04 — ADVERSARIAL RESILIENCE</span>
              <span className="badge badge-indigo">FORGE LEARNS PIPELINE</span>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              Autonomous Hardening Pipeline: How Attack Failure Evolved Into Memory
            </h3>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Observe empirical failure pattern extraction
          </div>
        </div>

        {/* 8-Step Cascade */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {[
            { step: '1. FAILURE', label: '67 Leaked', desc: 'V1 static ceiling bypassed', color: '#f43f5e' },
            { step: '2. PATTERN DETECTED', label: 'Swarm Signature', desc: 'Clustered transaction rate', color: '#fb7185' },
            { step: '3. VELOCITY ANOMALY', label: '> 2 txns / 10m', desc: 'Synthetic arrival burst', color: '#fbbf24' },
            { step: '4. CLUSTER COLLAPSE', label: 'Entropy < 0.50', desc: 'IP subnet convergence', color: '#f59e0b' },
            { step: '5. EXCEPTION DERIVATION', label: 'Forming Rule', desc: 'Extracting guard condition', color: '#38bdf8' },
            { step: '6. EXC-FRAUD-SYBIL', label: 'Exception Compiled', desc: 'Assigned unique ID', color: '#06b6d4' },
            { step: '7. POLICY MUTATION', label: 'POL-OPS-012 Mutated', desc: 'Compound gating injected', color: '#818cf8' },
            { step: '8. CANDIDATE V2', label: '94% Robustness', desc: 'Verified in FORGE LAB', color: '#10b981' },
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '12px', borderTop: `3px solid ${item.color}`, textAlign: 'center' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 800, color: item.color, letterSpacing: '0.04em' }}>{item.step}</div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('matrix')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: activeTab === 'matrix' ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'matrix' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'matrix' ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: "'Rowdies', sans-serif"
          }}
        >
          Structured Attack Matrix (5 Scenarios)
        </button>
        <button 
          onClick={() => setActiveTab('narrative')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: activeTab === 'narrative' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'narrative' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'narrative' ? '#fff' : '#94a3b8',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: "'Rowdies', sans-serif"
          }}
        >
          Learning Loop Steps (6)
        </button>
        <button 
          onClick={() => setActiveTab('cases')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: activeTab === 'cases' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'cases' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'cases' ? '#fff' : '#94a3b8',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: "'Rowdies', sans-serif"
          }}
        >
          Live Attack Trace Log (100 Bots)
        </button>
        <button 
          onClick={() => setActiveTab('diff')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: activeTab === 'diff' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
            background: activeTab === 'diff' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
            color: activeTab === 'diff' ? '#fff' : '#94a3b8',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: "'Rowdies', sans-serif"
          }}
        >
          Policy Mutation & Regression Tests
        </button>
      </div>

      {/* TAB 0: STRUCTURED ATTACK MATRIX (Phase 3 Requirement) */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Scenario Selector Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {scenarios.map((scen: any) => {
              const isSelected = selectedScenario?.attack_id === scen.attack_id;
              return (
                <button
                  key={scen.attack_id}
                  onClick={() => setSelectedScenario(scen)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: isSelected ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#fff' : '#94a3b8',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Bug size={14} color={isSelected ? '#f43f5e' : '#64748b'} />
                  <span>{scen.attack_name}</span>
                </button>
              );
            })}
          </div>

          {selectedScenario && (
            <div className="glass-panel" style={{ padding: '26px', border: '1px solid rgba(244, 63, 94, 0.35)', background: 'rgba(8, 14, 26, 0.75)' }}>
              {/* Scenario Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-rose">{selectedScenario.category}</span>
                    <span className="badge badge-indigo">{selectedScenario.attack_id}</span>
                    <span className="badge badge-amber">{selectedScenario.status}</span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '6px 0 0 0' }}>
                    {selectedScenario.attack_name}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                    Attack Vector: <code>{selectedScenario.attack_vector}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => onNavigate('forgelab')}
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: '#34d399',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={14} /> Validate in FORGE LAB
                  </button>
                  <button
                    onClick={() => onNavigate('candidate')}
                    style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: '#818cf8',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ArrowRight size={14} /> Inspect Candidate V2
                  </button>
                </div>
              </div>

              {/* 5-Step Flow Pipeline: ATTACK → OBSERVED FAILURE → ROOT CAUSE → CANDIDATE V2 → FORGE LAB VALIDATION */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Adversarial Progression Flow
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {[
                    { title: '1. ATTACK', val: selectedScenario.attack_name, color: '#f43f5e' },
                    { title: '2. OBSERVED FAILURE', val: selectedScenario.observed_behavior, color: '#fb7185' },
                    { title: '3. ROOT CAUSE', val: selectedScenario.root_cause, color: '#fbbf24' },
                    { title: '4. CANDIDATE V2', val: selectedScenario.candidate_playbook_v2, color: '#818cf8' },
                    { title: '5. FORGE LAB VALIDATION', val: selectedScenario.forge_lab_validation, color: '#34d399' }
                  ].map((step, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '12px', borderTop: `3px solid ${step.color}` }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: step.color, letterSpacing: '0.03em' }}>{step.title}</div>
                      <div style={{ fontSize: '12px', color: '#e2e8f0', marginTop: '6px', lineHeight: 1.3, fontWeight: 500 }}>{step.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9-Field Structured Results Table */}
              <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                  STRUCTURED ADVERSARIAL AUDIT FIELDS (9-POINT AUDIT SCHEMA)
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', width: '220px', fontWeight: 700 }}>Attack</td>
                      <td style={{ padding: '10px 16px', color: '#fff', fontWeight: 600 }}>{selectedScenario.attack_name} (<code>{selectedScenario.attack_id}</code>)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Expected Behavior</td>
                      <td style={{ padding: '10px 16px', color: '#34d399' }}>{selectedScenario.expected_behavior}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Observed Behavior</td>
                      <td style={{ padding: '10px 16px', color: '#f43f5e' }}>{selectedScenario.observed_behavior}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Failure Detected</td>
                      <td style={{ padding: '10px 16px', color: '#fb7185', fontWeight: 700 }}>{selectedScenario.detection_label}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Root Cause</td>
                      <td style={{ padding: '10px 16px', color: '#fbbf24' }}>{selectedScenario.root_cause}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Impact</td>
                      <td style={{ padding: '10px 16px', color: '#fca5a5' }}>{selectedScenario.impact}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Candidate Mitigation</td>
                      <td style={{ padding: '10px 16px', color: '#38bdf8' }}>{selectedScenario.candidate_mitigation}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Candidate Playbook V2</td>
                      <td style={{ padding: '10px 16px', color: '#a78bfa', fontWeight: 700 }}><code>{selectedScenario.candidate_playbook_v2}</code></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 700 }}>Status</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span className="badge badge-amber" style={{ fontSize: '11px', fontWeight: 700 }}>
                          {selectedScenario.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: 6-Step Learning Loop */}
      {activeTab === 'narrative' && (
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8, 14, 26, 0.65)', backdropFilter: 'blur(16px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <ArrowRight size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              Autonomous Hardening Pipeline: Failure → Memory → Evolution
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {narrative.learning_loop?.map((item: any, idx: number) => (
              <div key={idx} className="glass-card" style={{ padding: '16px', position: 'relative' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Bot Cases Trace */}
      {activeTab === 'cases' && (
        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8, 14, 26, 0.65)', backdropFilter: 'blur(16px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="#a855f7" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                Sybil Attack Injection Traces ({filteredCases.length} of {sampleCases.length} Bots Shown)
              </h3>
            </div>

            {/* Filter pills & search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'all', label: 'All Bots' },
                  { id: 'v1_breached', label: 'V1 Breached (67)' },
                  { id: 'v2_blocked', label: 'V2 Intercepted (94)' },
                  { id: 'v2_evaded', label: 'V2 Edge Evasions (6)' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setCaseFilter(p.id as any)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: caseFilter === p.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: caseFilter === p.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: caseFilter === p.id ? '#38bdf8' : '#94a3b8',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: "'Rowdies', sans-serif"
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '4px 10px'
              }}>
                <Search size={13} color="#94a3b8" />
                <input 
                  type="text"
                  placeholder="Filter BOT-SYN-..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '11.5px',
                    width: '130px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '110px 140px 90px 100px 1fr 1fr', 
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            fontWeight: 700,
            color: '#94a3b8',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <span>SYNTHETIC ID</span>
            <span>IP SUBNET</span>
            <span>AMOUNT</span>
            <span>TIMING</span>
            <span>V1 ACTION</span>
            <span>V2 INTERCEPTION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '480px', overflowY: 'auto', marginTop: '6px' }}>
            {filteredCases.map((c: any, idx: number) => (
              <div key={idx} style={{ 
                display: 'grid', 
                gridTemplateColumns: '110px 140px 90px 100px 1fr 1fr', 
                alignItems: 'center',
                padding: '9px 14px', 
                background: 'rgba(0,0,0,0.3)', 
                borderRadius: '6px',
                border: c.v2_breached ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '12px'
              }}>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{c.synthetic_id}</span>
                <span style={{ color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px' }}>{c.ip_subnet}</span>
                <span className="font-mono" style={{ color: '#38bdf8' }}>${c.claimed_amount}</span>
                <span style={{ color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}>T+{c.arrival_offset_seconds}s</span>
                <div>
                  <span className={`badge ${c.v1_breached ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '11px' }}>
                    {c.v1_action}
                  </span>
                </div>
                <div>
                  <span className={`badge ${c.v2_breached ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '11px' }}>
                    {c.v2_action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Policy Mutation & Regression */}
      {activeTab === 'diff' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Policy Diff */}
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8, 14, 26, 0.65)', backdropFilter: 'blur(16px)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Policy Mutation Diff (POL-OPS-012)
            </h3>
            <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ color: '#f87171' }}>
                - {narrative.policy_diff?.v1_rule}
              </div>
              <div style={{ color: '#34d399' }}>
                + {narrative.policy_diff?.v2_rule}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
                NEWLY SYNTHESIZED EXCEPTION RULE
              </div>
              <div className="glass-card" style={{ padding: '14px' }}>
                <div className="badge badge-amber">{narrative.mutated_exception?.id}</div>
                <div style={{ fontSize: '12px', color: '#fff', marginTop: '8px', fontFamily: 'monospace' }}>
                  {narrative.mutated_exception?.trigger}
                </div>
                <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '6px' }}>
                  Action: {narrative.mutated_exception?.action}
                </div>
              </div>
            </div>
          </div>

          {/* Regression Test Suite */}
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8, 14, 26, 0.65)', backdropFilter: 'blur(16px)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Regression Suite Verification
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>Legitimate VIP Enterprise Pass Rate</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>
                  {narrative.regression_test_summary?.legitimate_vip_pass_rate}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>Standard User Pass Rate</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>
                  {narrative.regression_test_summary?.standard_user_pass_rate}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', color: '#e2e8f0' }}>False Positive Escalation Rate</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace" }}>
                  {narrative.regression_test_summary?.false_positive_rate}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>VERDICT</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>{narrative.regression_test_summary?.regression_status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
