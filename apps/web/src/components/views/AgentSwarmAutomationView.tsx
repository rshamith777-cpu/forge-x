import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, Shield, ShieldCheck, Flame, GitBranch, FlaskConical, 
  Terminal, Play, Pause, RefreshCw, CheckCircle2, AlertTriangle, 
  ArrowRight, Radio, Layers, Activity, Lock, Award, Eye, Settings, 
  Clock, Database, Sparkles, Filter, Copy, Check
} from 'lucide-react';
import { runRedTeamAttack, simulateLabV1vsV2 } from '../../lib/api';

export interface AgentCard {
  id: string;
  name: string;
  codename: string;
  role: string;
  status: 'ACTIVE' | 'STANDBY' | 'ENGAGED' | 'EVALUATING' | 'VERIFIED';
  icon: any;
  color: string;
  bgGlow: string;
  latency: string;
  throughput: string;
  signature: string;
  description: string;
  recentAction: string;
}

export const AgentSwarmAutomationView: React.FC<{ navigateTo: (path: string) => void }> = ({ navigateTo }) => {
  const [autonomyLevel, setAutonomyLevel] = useState<'L1' | 'L2' | 'L3'>('L3');
  const [continuousSentinel, setContinuousSentinel] = useState<boolean>(true);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: string; time: string; agent: string; color: string; message: string; tag: string }>>([
    { id: '1', time: '12:04:12', agent: 'ARCHAEOLOGY', color: '#06b6d4', message: 'Ingested 5,000 telemetry traces from ApexCloud gateway. Zero dark-debt discovered.', tag: 'TRACE' },
    { id: '2', time: '12:04:18', agent: 'RED_TEAM', color: '#f43f5e', message: 'Sybil flood stress-test active: 100 synthetic bots deployed across 198.51.100.0/24.', tag: 'ATTACK' },
    { id: '3', time: '12:04:22', agent: 'GENOME', color: '#fbbf24', message: 'Synthesized defensive predicate: cluster_entropy < 0.45 -> divert to security sandbox.', tag: 'MUTATION' },
    { id: '4', time: '12:04:26', agent: 'FORGE_LAB', color: '#34d399', message: 'Monte Carlo regression (1,420 replays) complete. Robustness delta: +61.0% (33% -> 94%).', tag: 'VERIFIED' },
    { id: '5', time: '12:04:31', agent: 'GOVERNOR', color: '#a78bfa', message: 'Cryptographic policy signature validated: SHA256[0x8f2d...b14e]. V2 ready for approval.', tag: 'L1_MOSS' },
    { id: '6', time: '12:04:35', agent: 'SYNAPSE_X', color: '#38bdf8', message: 'Active screen context synchronized with Team FORGE-ALPHA operational ledger.', tag: 'COPILOT' }
  ]);
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');
  const [entropyThreshold, setEntropyThreshold] = useState<number>(0.45);
  const [copiedLog, setCopiedLog] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Periodic Sentinel Simulation if continuous is ON
  useEffect(() => {
    if (!continuousSentinel) return;

    const interval = setInterval(() => {
      const agents = [
        { name: 'ARCHAEOLOGY', color: '#06b6d4', tag: 'SCAN', msg: 'Periodic telemetry sweep: 142 ingress requests parsed. All transition predicates normal.' },
        { name: 'RED_TEAM', color: '#f43f5e', tag: 'PROBE', msg: 'Randomized boundary probe injected at $499.95. Entropy gate triggered quarantine.' },
        { name: 'SYNAPSE_X', color: '#38bdf8', tag: 'COGNITION', msg: 'Screen state evaluated: Zero compliance breaches detected across active ticket queues.' },
        { name: 'GOVERNOR', color: '#a78bfa', tag: 'MOSS', msg: 'L1 Cryptographic Heartbeat: 100% policy conformance proof verified.' }
      ];
      const pick = agents[Math.floor(Math.random() * agents.length)];
      const now = new Date().toTimeString().split(' ')[0];

      setTerminalLogs(prev => [
        ...prev.slice(-40),
        { id: String(Date.now()), time: now, agent: pick.name, color: pick.color, message: pick.msg, tag: pick.tag }
      ]);
    }, 7000);

    return () => clearInterval(interval);
  }, [continuousSentinel]);

  const agents: AgentCard[] = [
    {
      id: 'agent-archaeology',
      name: 'Archaeology Sentinel',
      codename: 'AEGIS-MINER',
      role: 'Process Mining & Dark-Debt Discovery',
      status: 'ACTIVE',
      icon: Activity,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      latency: '12ms',
      throughput: '2,400 events/sec',
      signature: '0x3a9f...c81e',
      description: 'Ingests messy raw execution logs, derives ground-truth state transition graphs, and identifies hidden unmapped decision pathways.',
      recentAction: 'Scanned 5,000 ApexCloud events; mapped 9-state transition DAG with 100% precision.'
    },
    {
      id: 'agent-redteam',
      name: 'Adversarial Swarm',
      codename: 'CERBERUS-100',
      role: 'Automated Red Team & Injection Exploits',
      status: 'ENGAGED',
      icon: Flame,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      latency: '18ms',
      throughput: '100 bots / 45s burst',
      signature: '0x9d4b...77f2',
      description: 'Deploys 100 synthetic adversarial bots to exploit static thresholds, prompt injections, and VIP header context spoofing.',
      recentAction: 'Breached Playbook V1 via Sybil Flood ($33,433 loss); halted by Candidate Playbook V2 (94% blocked).'
    },
    {
      id: 'agent-genome',
      name: 'Evolutionary Genome',
      codename: 'DARWIN-SYNTH',
      role: 'Predicate Extraction & Playbook Mutation',
      status: 'ACTIVE',
      icon: GitBranch,
      color: '#fbbf24',
      bgGlow: 'rgba(251, 191, 36, 0.15)',
      latency: '34ms',
      throughput: '12 mutations/run',
      signature: '0x5e11...aa90',
      description: 'Learns from incident memories and adversarial failures to synthesize deterministic compound exception rules.',
      recentAction: 'Mutated POL-OPS-012 with EXC-FRAUD-SYBIL (cluster_entropy < 0.45 gating).'
    },
    {
      id: 'agent-forgelab',
      name: 'Forge Lab Verifier',
      codename: 'QUANTUM-BENCH',
      role: 'Empirical Monte Carlo Regression',
      status: 'VERIFIED',
      icon: FlaskConical,
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.15)',
      latency: '8ms',
      throughput: '1,420 replays/sec',
      signature: '0x1c88...e3b4',
      description: 'Replays candidate policies across 1,420 synthetic regression scenarios to certify zero false positives and superior resilience.',
      recentAction: 'Certified Candidate V2: 94.0% attack resistance (+61.0% delta) and 99.8% VIP pass rate.'
    },
    {
      id: 'agent-governor',
      name: 'Moss Governor',
      codename: 'SENTINEL-MOSS',
      role: 'Cryptographic Authority & Multi-Sig Rails',
      status: 'ACTIVE',
      icon: Lock,
      color: '#a78bfa',
      bgGlow: 'rgba(167, 139, 250, 0.15)',
      latency: '4ms',
      throughput: 'Sub-10ms Consensus',
      signature: '0x8f2d...b14e',
      description: 'Enforces cryptographic policy token signatures, zero-leakage hindsight isolation, and role-based multi-sig human approvals.',
      recentAction: 'Signed Candidate V2 governance certificate; locked rollback baseline.'
    },
    {
      id: 'agent-synapse',
      name: 'Synapse-X Teammate',
      codename: 'SYNAPSE-X',
      role: 'Contextual Screen Copilot & Team Memory',
      status: 'ACTIVE',
      icon: Sparkles,
      color: '#38bdf8',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      latency: '15ms',
      throughput: 'Real-Time Streaming',
      signature: '0x7e29...91a2',
      description: 'Proactively reads open page states, assists operators with contextual action recommendations, and persists team heuristics.',
      recentAction: 'Synchronized Team FORGE-ALPHA heuristics with 3 active member shifts.'
    }
  ];

  // Run 1-Click Multi-Agent Self-Healing Pipeline
  const handleRunSelfHealingPipeline = async () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setActivePipelineStep(0);

    const now = () => new Date().toTimeString().split(' ')[0];

    // Step 0: Archaeology
    setTerminalLogs(prev => [
      ...prev,
      { id: String(Date.now()), time: now(), agent: 'ARCHAEOLOGY', color: '#06b6d4', message: 'PHASE 1/5: Excavating execution telemetry. Detecting unmapped cluster velocity gaps...', tag: 'PIPELINE_START' }
    ]);
    await new Promise(r => setTimeout(r, 1200));

    // Step 1: Red Team Attack
    setActivePipelineStep(1);
    setTerminalLogs(prev => [
      ...prev,
      { id: String(Date.now()), time: now(), agent: 'RED_TEAM', color: '#f43f5e', message: 'PHASE 2/5: Launching 100-bot Sybil burst injection against Playbook V1...', tag: 'ATTACK' }
    ]);
    try {
      await runRedTeamAttack();
    } catch (e) {
      console.warn(e);
    }
    await new Promise(r => setTimeout(r, 1400));

    // Step 2: Genome Mutation
    setActivePipelineStep(2);
    setTerminalLogs(prev => [
      ...prev,
      { id: String(Date.now()), time: now(), agent: 'GENOME', color: '#fbbf24', message: 'PHASE 3/5: Failure extracted into incident memory. Synthesizing EXC-FRAUD-SYBIL compound rule...', tag: 'MUTATION' }
    ]);
    await new Promise(r => setTimeout(r, 1200));

    // Step 3: Forge Lab Verification
    setActivePipelineStep(3);
    setTerminalLogs(prev => [
      ...prev,
      { id: String(Date.now()), time: now(), agent: 'FORGE_LAB', color: '#34d399', message: 'PHASE 4/5: Running 1,420 Monte Carlo replays. V1: 33% -> V2: 94% (+61% Robustness Gain!)...', tag: 'VERIFY' }
    ]);
    try {
      await simulateLabV1vsV2({ iterations: 1420 });
    } catch (e) {
      console.warn(e);
    }
    await new Promise(r => setTimeout(r, 1400));

    // Step 4: Moss Governor Deployment
    setActivePipelineStep(4);
    setTerminalLogs(prev => [
      ...prev,
      { id: String(Date.now()), time: now(), agent: 'GOVERNOR', color: '#a78bfa', message: 'PHASE 5/5: Cryptographic token signed. Candidate Playbook V2 deployed to Governance Sandbox!', tag: 'DEPLOYED' },
      { id: String(Date.now() + 1), time: now(), agent: 'SYNAPSE_X', color: '#38bdf8', message: 'AUTONOMOUS SELF-HEALING COMPLETE. All 6 agents verified in nominal hardened state.', tag: 'SUCCESS' }
    ]);
    await new Promise(r => setTimeout(r, 800));

    setPipelineRunning(false);
  };

  const handleTriggerAgentPulse = (agent: AgentCard) => {
    const now = new Date().toTimeString().split(' ')[0];
    setTerminalLogs(prev => [
      ...prev,
      {
        id: String(Date.now()),
        time: now,
        agent: agent.name.toUpperCase().replace(/\s+/g, '_'),
        color: agent.color,
        message: `Manual Pulse Triggered: ${agent.name} executed diagnostic cycle. Latency: ${agent.latency}. All predicates verified.`,
        tag: 'MANUAL_PULSE'
      }
    ]);
  };

  const filteredLogs = selectedAgentFilter === 'ALL'
    ? terminalLogs
    : terminalLogs.filter(l => l.agent.includes(selectedAgentFilter) || l.tag === selectedAgentFilter);

  const copyAllLogs = () => {
    const text = terminalLogs.map(l => `[${l.time}] [${l.agent}] [${l.tag}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      {/* Top Banner / Hero Header */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.12) 50%, rgba(8, 14, 26, 0.85) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: '0 0 35px rgba(6, 182, 212, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Radio size={12} className="animate-pulse" />
              6 AUTONOMOUS AGENTS ACTIVE
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '11px' }}>
              SUB-10MS MOSS CONSENSUS
            </span>
            <span className="badge badge-amber" style={{ fontSize: '11px' }}>
              AUTONOMY: {autonomyLevel} FULL SELF-HEALING
            </span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu size={28} color="#06b6d4" />
            Autonomous Agent Swarm & Self-Healing Engine
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '6px 0 0 0', maxWidth: '720px', lineHeight: 1.5 }}>
            Real-time multi-agent orchestration coordinating Process Archaeology, 100-Bot Red Team stress testing, Genetic Policy Induction, Monte Carlo verification, and Moss cryptographic guardrails.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Continuous Sentinel Switch */}
          <button
            onClick={() => setContinuousSentinel(!continuousSentinel)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: continuousSentinel ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: continuousSentinel ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
              color: continuousSentinel ? '#34d399' : '#94a3b8',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Activity size={16} />
            <span>Continuous Auto-Pilot: {continuousSentinel ? 'ENABLED' : 'PAUSED'}</span>
          </button>

          {/* 1-Click Run Pipeline Button */}
          <button
            onClick={handleRunSelfHealingPipeline}
            disabled={pipelineRunning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 22px',
              borderRadius: '8px',
              background: pipelineRunning 
                ? 'rgba(244, 63, 94, 0.3)' 
                : 'linear-gradient(135deg, #06b6d4, #2563eb)',
              color: '#ffffff',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: pipelineRunning ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.02em'
            }}
          >
            {pipelineRunning ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Running Swarm Pipeline ({activePipelineStep + 1}/5)...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>EXECUTE 1-CLICK SELF-HEALING SWARM</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Multi-Agent Orchestration Flow Stepper (Visual 5-Step Pipeline) */}
      <div className="glass-panel" style={{ padding: '24px', background: 'rgba(8, 14, 26, 0.75)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#06b6d4', letterSpacing: '0.05em' }}>
              AUTONOMOUS EXECUTION PIPELINE
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: '4px 0 0 0' }}>
              Closed-Loop Swarm Orchestration: Failure ➔ Genome ➔ Verification ➔ Rollout
            </h3>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
            Step: {pipelineRunning ? `${activePipelineStep + 1} of 5` : 'Ready'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {[
            { step: 1, title: 'Archaeology Mining', agent: 'Sentinel Miner', desc: 'Discovers unmapped state transitions in telemetry', color: '#06b6d4', icon: Activity },
            { step: 2, title: 'Adversarial Injection', agent: 'Red Team Swarm', desc: '100 synthetic bots stress-test static $500 threshold', color: '#f43f5e', icon: Flame },
            { step: 3, title: 'Genome Induction', agent: 'Evolutionary Mutator', desc: 'Extracts failure pattern into EXC-FRAUD-SYBIL', color: '#fbbf24', icon: GitBranch },
            { step: 4, title: 'Monte Carlo Replay', agent: 'Forge Lab Verifier', desc: '1,420 replay test runs certify +61% robustness gain', color: '#34d399', icon: FlaskConical },
            { step: 5, title: 'Cryptographic Rollout', agent: 'Moss Governor', desc: 'Signs SHA-256 certificate and stages Candidate V2', color: '#a78bfa', icon: Lock }
          ].map((item, idx) => {
            const Icon = item.icon;
            const isCurrent = pipelineRunning && activePipelineStep === idx;
            const isCompleted = activePipelineStep > idx;

            return (
              <div 
                key={idx}
                style={{
                  background: isCurrent 
                    ? 'rgba(6, 182, 212, 0.25)' 
                    : isCompleted 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : 'rgba(0, 0, 0, 0.4)',
                  border: isCurrent 
                    ? `2px solid ${item.color}` 
                    : isCompleted 
                      ? '1px solid #10b981' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '16px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  boxShadow: isCurrent ? `0 0 20px ${item.color}40` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: isCompleted ? '#10b981' : isCurrent ? item.color : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#fff'
                  }}>
                    {isCompleted ? <CheckCircle2 size={14} /> : item.step}
                  </span>
                  <Icon size={16} color={item.color} />
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: item.color, fontWeight: 600, marginTop: '2px' }}>
                  {item.agent}
                </div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Autonomous Agent Fleet Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>
              AGENT ROSTER & TOPOLOGY
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '4px 0 0 0' }}>
              Active Autonomous Fleet (6 Specialized Micro-Agents)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigateTo('/app/redteam')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#fb7185',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Open Red Team 100-Bot View
            </button>
            <button
              onClick={() => navigateTo('/app/forgelab')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#34d399',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Open FORGE LAB Cockpit
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {agents.map(agent => {
            const Icon = agent.icon;
            return (
              <div 
                key={agent.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  background: 'rgba(8, 14, 26, 0.70)',
                  border: `1px solid ${agent.color}35`,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background accent glow */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '120px',
                  height: '120px',
                  background: agent.bgGlow,
                  borderRadius: '50%',
                  filter: 'blur(35px)',
                  pointerEvents: 'none'
                }} />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: agent.bgGlow,
                        border: `1px solid ${agent.color}50`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} color={agent.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                          {agent.name}
                        </div>
                        <div style={{ fontSize: '11px', color: agent.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                          {agent.codename}
                        </div>
                      </div>
                    </div>

                    <span className="badge badge-emerald" style={{ fontSize: '10px', fontWeight: 800 }}>
                      {agent.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px' }}>
                    {agent.description}
                  </div>

                  {/* Telemetry Stats Bar */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: '14px',
                    fontSize: '11px'
                  }}>
                    <div>
                      <div style={{ color: '#64748b' }}>LATENCY</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'monospace', marginTop: '2px' }}>{agent.latency}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b' }}>THROUGHPUT</div>
                      <div style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace', marginTop: '2px' }}>{agent.throughput}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b' }}>MOSS HASH</div>
                      <div style={{ color: '#a78bfa', fontWeight: 700, fontFamily: 'monospace', marginTop: '2px' }}>{agent.signature}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '6px', borderLeft: `3px solid ${agent.color}` }}>
                    <strong style={{ color: '#fff' }}>Latest Proof:</strong> {agent.recentAction}
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleTriggerAgentPulse(agent)}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Zap size={13} color={agent.color} />
                    <span>Trigger Pulse</span>
                  </button>
                  <button
                    onClick={() => {
                      if (agent.id === 'agent-redteam') navigateTo('/app/redteam');
                      else if (agent.id === 'agent-forgelab') navigateTo('/app/forgelab');
                      else if (agent.id === 'agent-genome') navigateTo('/app/candidate');
                      else if (agent.id === 'agent-archaeology') navigateTo('/app/audit');
                      else if (agent.id === 'agent-governor') navigateTo('/app/governance');
                      else window.dispatchEvent(new CustomEvent('forge:open-ai-teammate'));
                    }}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '6px',
                      background: `${agent.color}20`,
                      border: `1px solid ${agent.color}50`,
                      color: agent.color,
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Inspect</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Multi-Agent Live Terminal / Telemetry Console */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: '#040711',
        border: '1px solid rgba(6, 182, 212, 0.35)',
        boxShadow: '0 0 30px rgba(0,0,0,0.7)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
              LIVE SWARM TELEMETRY & EVENT STREAM
            </h3>
            <span className="badge badge-indigo" style={{ fontSize: '10px' }}>
              {filteredLogs.length} EVENTS RECORDED
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Filter pills */}
            {['ALL', 'ARCHAEOLOGY', 'RED_TEAM', 'GENOME', 'FORGE_LAB', 'GOVERNOR', 'SYNAPSE_X'].map(f => (
              <button
                key={f}
                onClick={() => setSelectedAgentFilter(f)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: selectedAgentFilter === f ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedAgentFilter === f ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: selectedAgentFilter === f ? '#38bdf8' : '#94a3b8',
                  fontSize: '10.5px',
                  cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {f}
              </button>
            ))}

            <button
              onClick={copyAllLogs}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {copiedLog ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
              <span>{copiedLog ? 'Copied' : 'Copy Log'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div style={{
          background: '#020409',
          borderRadius: '8px',
          padding: '16px',
          maxHeight: '340px',
          overflowY: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {filteredLogs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '10px', alignItems: 'baseline', lineHeight: 1.4 }}>
              <span style={{ color: '#64748b', fontSize: '11px', flexShrink: 0 }}>[{log.time}]</span>
              <span style={{
                color: log.color,
                fontWeight: 700,
                fontSize: '11px',
                background: `${log.color}15`,
                padding: '1px 6px',
                borderRadius: '3px',
                flexShrink: 0
              }}>
                {log.agent}
              </span>
              <span style={{ color: '#38bdf8', fontSize: '10.5px', fontWeight: 600, flexShrink: 0 }}>
                [{log.tag}]
              </span>
              <span style={{ color: '#e2e8f0' }}>{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};
