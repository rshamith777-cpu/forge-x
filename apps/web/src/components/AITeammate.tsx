import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Sparkles, MessageSquare, Brain, Send, X, ChevronDown, 
  ChevronUp, CheckCircle2, AlertTriangle, Zap, Volume2, VolumeX,
  BookOpen, Plus, Compass, Play, RefreshCw, Users, Shield, ArrowRight, Cpu
} from 'lucide-react';
import { DemoVoiceController } from '../lib/demo/DemoVoiceController';

export interface AITeammateProps {
  activeModule: string;
  currentRole: string;
  currentTeamCode?: string;
  currentMemberName?: string;
  navigateTo: (path: string, options?: any) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionSuggestion?: {
    label: string;
    action: () => void;
  };
  contextCited?: string;
}

interface TeamLearning {
  id: string;
  heuristic: string;
  author: string;
  timestamp: string;
  category: 'POLICY' | 'SLA' | 'SECURITY' | 'WORKFORCE';
}

const DEFAULT_LEARNINGS: Record<string, TeamLearning[]> = {
  'FORGE-ALPHA': [
    {
      id: 'LRN-01',
      heuristic: 'Always verify Sub-10ms Moss L1 audit citation before approving refunds > $500.',
      author: 'Ananya R. (Lead)',
      timestamp: 'Today at 09:15 AM',
      category: 'POLICY'
    },
    {
      id: 'LRN-02',
      heuristic: 'Enterprise customers experiencing outage receive auto-approved 10% credit vouchers within 30 min SLA.',
      author: 'Marcus Chen',
      timestamp: 'Yesterday',
      category: 'SLA'
    },
    {
      id: 'LRN-03',
      heuristic: 'Subnet entropy < 0.45 indicates synthetic Sybil attack; immediately divert to Red Team sandbox.',
      author: 'Aegis AI Agent',
      timestamp: '2 days ago',
      category: 'SECURITY'
    }
  ]
};

export const AITeammate: React.FC<AITeammateProps> = ({
  activeModule,
  currentRole,
  currentTeamCode = 'FORGE-ALPHA',
  currentMemberName = 'Operator',
  navigateTo
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'actions'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newHeuristicText, setNewHeuristicText] = useState('');
  const [showTeachModal, setShowTeachModal] = useState(false);

  const voiceControllerRef = useRef<DemoVoiceController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Voice Controller and Event Listeners
  useEffect(() => {
    try {
      voiceControllerRef.current = new DemoVoiceController();
    } catch (e) {
      console.warn("Speech synthesis not supported or restricted", e);
    }

    const handleToggle = () => setIsOpen(prev => !prev);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('forge:toggle-ai-teammate', handleToggle);
    window.addEventListener('forge:open-ai-teammate', handleOpen);
    return () => {
      window.removeEventListener('forge:toggle-ai-teammate', handleToggle);
      window.removeEventListener('forge:open-ai-teammate', handleOpen);
    };
  }, []);

  // Team Learnings Memory loaded from localStorage
  const [teamLearnings, setTeamLearnings] = useState<TeamLearning[]>(() => {
    try {
      const saved = localStorage.getItem(`forge_team_memory_${currentTeamCode}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_LEARNINGS[currentTeamCode] || DEFAULT_LEARNINGS['FORGE-ALPHA'];
  });

  // Save learnings on update
  useEffect(() => {
    try {
      localStorage.setItem(`forge_team_memory_${currentTeamCode}`, JSON.stringify(teamLearnings));
    } catch (e) {
      console.warn(e);
    }
  }, [teamLearnings, currentTeamCode]);

  // Initial Seed Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-01',
      sender: 'ai',
      text: `Hello ${currentMemberName}! I'm Synapse-X, your autonomous AI teammate for Team ${currentTeamCode}. I continuously adapt to your team's operational habits, policies, and SLA standards. I am currently monitoring the "${activeModule.toUpperCase()}" workspace. How can I assist you?`,
      timestamp: 'Just now',
      contextCited: `Team Code: ${currentTeamCode} • Role: ${currentRole}`
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Helper to speak if voice is enabled
  const speakIfEnabled = (text: string) => {
    if (voiceEnabled && voiceControllerRef.current) {
      voiceControllerRef.current.speak(text);
    }
  };

  // Inspect Current Page State
  const handleInspectCurrentPage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let pageAnalysis = "";
      let actionSuggestion: any = null;

      if (activeModule === 'incidents') {
        pageAnalysis = `I have inspected the Incidents workspace. Currently tracking active enterprise service degradations. 1 ticket is approaching SLA breach threshold (ApexCloud, 2.5h duration). Standard policy POL-OPS-012 authorizes up to $500 auto-clearance. High authority sign-off is required for claims > $1,000.`;
        actionSuggestion = {
          label: "⚡ View Incidents Needing Approval",
          action: () => navigateTo('/app/incidents')
        };
      } else if (activeModule === 'redteam') {
        pageAnalysis = `Analyzing Red Team Evolution matrix: V1 had 67 breaches across 100 bots. Candidate V2 successfully intercepted 94 bots with 6 edge evasions remaining. Cluster entropy telemetry is active. Recommend evaluating regression tests in Forge Lab.`;
        actionSuggestion = {
          label: "🧪 Launch Forge Lab Regression Tests",
          action: () => navigateTo('/app/forgelab')
        };
      } else if (activeModule === 'decide') {
        pageAnalysis = `Inspecting Active Decision telemetry: Real-time decision hot path running sub-10ms Moss retrieval. Incoming claims from high-reputation subnets receive automated instant clearance. Low entropy clusters are routed to manager verification.`;
        actionSuggestion = {
          label: "🎯 Test Decision Simulation",
          action: () => navigateTo('/app/decide')
        };
      } else if (activeModule === 'team') {
        pageAnalysis = `Inspecting Team Workforce Command: Team ${currentTeamCode} currently has 5 active members online, 1 on incident duty, and myself (Synapse-X) monitoring 24/7. Timesheets are tracked with SOC-2 audit compliance. Higher authorities can approve pending shift hours.`;
        actionSuggestion = {
          label: "⏱️ Open Workforce Dashboard",
          action: () => navigateTo('/app/team')
        };
      } else if (activeModule === 'policies') {
        pageAnalysis = `Inspecting Policies matrix: Active Playbook POL-OPS-012 enforces $500 standard refund limit. Candidate Playbook V2 introduces dynamic cluster velocity gating. All policy modifications are tracked in the immutable audit ledger.`;
        actionSuggestion = {
          label: "⚖️ Simulate Policy Amendment",
          action: () => navigateTo('/app/scenarios')
        };
      } else if (activeModule === 'agents') {
        pageAnalysis = `Inspecting Autonomous Agent Swarm: 6 micro-agents are synchronized (Archaeology, Red Team, Genome, Forge Lab, Governor, Synapse-X). Continuous Sentinel auto-pilot is actively monitoring the network. 1-click self-healing is primed.`;
        actionSuggestion = {
          label: "⚡ Run Autonomous Self-Healing Pipeline",
          action: () => navigateTo('/app/agents')
        };
      } else {
        pageAnalysis = `Inspecting ${activeModule.toUpperCase()} view: All system telemetry is nominal. Moss sub-10ms ring buffer is active. Your team memory currently has ${teamLearnings.length} custom heuristics trained.`;
        actionSuggestion = {
          label: "📊 View Team Workforce Activity",
          action: () => navigateTo('/app/team')
        };
      }

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: pageAnalysis,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestion,
        contextCited: `Live Page: ${activeModule} • Team: ${currentTeamCode}`
      };

      setMessages(prev => [...prev, newMsg]);
      setIsAnalyzing(false);
      speakIfEnabled(pageAnalysis);
    }, 700);
  };

  // Submit User Chat Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAnalyzing(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let responseText = "";
      let actionSuggestion: any = null;

      // Intelligent responses with team adaptability
      if (lower.includes('team') || lower.includes('workforce') || lower.includes('member') || lower.includes('time') || lower.includes('hour')) {
        responseText = `Under Team ${currentTeamCode}, workforce management is coordinated through the dedicated "Team & Workforce" command tab. As an authorized teammate, I track active shifts, incident loads, and timesheets. High authorities (Executive / Operations Lead) have permissions to approve hours and reassign tasks.`;
        actionSuggestion = {
          label: "👥 Open Team & Workforce Tab",
          action: () => navigateTo('/app/team')
        };
      } else if (lower.includes('incident') || lower.includes('refund') || lower.includes('sla') || lower.includes('claim')) {
        responseText = `According to our team learning: "${teamLearnings[0]?.heuristic || 'Verify Moss citations before approvals'}", incidents must be grounded with sub-10ms audit evidence. We currently have active incident INC-101 (ApexCloud) with an authorized credit calculation.`;
        actionSuggestion = {
          label: "🛡️ Resolve Incident INC-101",
          action: () => navigateTo('/app/incidents', { incidentId: 'INC-101' })
        };
      } else if (lower.includes('red team') || lower.includes('attack') || lower.includes('sybil') || lower.includes('bot')) {
        responseText = `Our Red Team benchmark generated 100 synthetic adversarial bots. V1 permitted 67 breaches due to static IP checks. Candidate V2 incorporates cluster entropy checks and stopped 94 bots!`;
        actionSuggestion = {
          label: "🔥 Inspect 100 Bot Traces",
          action: () => navigateTo('/app/redteam')
        };
      } else if (lower.includes('policy') || lower.includes('rule') || lower.includes('fork') || lower.includes('pareto')) {
        responseText = `Our policy engine balances financial cost vs. resolution velocity. In Fork Reality, raising the auto-clear limit from $500 to $1,000 speeds resolution to 2.1h, while maintaining low fraud risk if subnet entropy checks are active.`;
        actionSuggestion = {
          label: "🔀 Simulate Policy Fork",
          action: () => navigateTo('/app/scenarios')
        };
      } else if (lower.includes('teach') || lower.includes('learn') || lower.includes('rule')) {
        responseText = `I am ready to learn! You can teach me new team guidelines, escalation rules, or client exceptions. Click the "Teach Synapse" button below or in the Team Memory tab.`;
        setShowTeachModal(true);
      } else {
        responseText = `Understood. Factoring in Team ${currentTeamCode}'s preferences (${teamLearnings.length} active rules), I recommend executing an audit verification or checking active workforce assignments. Let me know if you would like me to navigate, run simulations, or generate compliance vouchers.`;
        actionSuggestion = {
          label: "🔍 Scan Current Page Context",
          action: () => handleInspectCurrentPage()
        };
      }

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestion,
        contextCited: `Grounded in Team ${currentTeamCode} Memory`
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsAnalyzing(false);
      speakIfEnabled(responseText);
    }, 600);
  };

  // Teach New Team Heuristic
  const handleAddHeuristic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeuristicText.trim()) return;

    const newLearning: TeamLearning = {
      id: `LRN-${Date.now().toString().slice(-4)}`,
      heuristic: newHeuristicText.trim(),
      author: currentMemberName || 'Team Member',
      timestamp: 'Just now',
      category: 'POLICY'
    };

    setTeamLearnings(prev => [newLearning, ...prev]);
    setNewHeuristicText('');
    setShowTeachModal(false);

    const confirmationMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: `Learned and internalized new team rule: "${newLearning.heuristic}". I will enforce and cite this across all recommendations for Team ${currentTeamCode}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextCited: `Updated Team Memory Stream (${teamLearnings.length + 1} heuristics)`
    };

    setMessages(prev => [...prev, confirmationMsg]);
    speakIfEnabled(confirmationMsg.text);
  };

  // Contextual Suggestion Pills based on activeModule
  const getContextSuggestions = () => {
    switch (activeModule) {
      case 'incidents':
        return [
          { text: "⚡ Triage high-risk SLA tickets", query: "Triage high-risk SLA tickets" },
          { text: "📝 Draft resolution voucher for INC-101", query: "Draft voucher for INC-101" },
          { text: "🔍 Cite precedent POL-OPS-012", query: "Explain POL-OPS-012 precedent" }
        ];
      case 'redteam':
        return [
          { text: "🛡️ Intercept remaining 6 Sybil evasions", query: "How to intercept 6 Sybil edge evasions?" },
          { text: "🧪 Run Monte Carlo regression", query: "Run regression test in Forge Lab" },
          { text: "📊 Breakdown 100 synthetic bots", query: "Breakdown 100 synthetic bots" }
        ];
      case 'policies':
        return [
          { text: "⚖️ Evaluate raising limit to $750", query: "What happens if we raise limit to $750?" },
          { text: "📈 View Pareto frontier curve", query: "Explain Pareto frontier tradeoffs" }
        ];
      case 'team':
        return [
          { text: "⏱️ Review pending timesheets", query: "Which team members have pending hours?" },
          { text: "🔄 Reassign high-priority ticket", query: "Reassign open incident to active operator" }
        ];
      default:
        return [
          { text: "🔍 Analyze current page", query: "Analyze current page" },
          { text: "👥 Check team active shifts", query: "Check team active shifts" },
          { text: "🧠 View team learned rules", query: "Show me team learned rules" }
        ];
    }
  };

  return (
    <>
      {/* Floating Trigger Widget (Bottom Right) - Small Icon Only */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Synapse AI Teammate"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.5), 0 0 16px rgba(99, 102, 241, 0.4)',
            color: '#ffffff',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(12px)',
            padding: 0
          }}
          className="hover:scale-110 active:scale-95"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="#ffffff" />
            {/* Live Ripple Beacon */}
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #0f172a',
              boxShadow: '0 0 8px #10b981'
            }} />
          </div>
        </button>
      )}

      {/* Expanded AI Teammate HUD Modal / Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '440px',
          height: '620px',
          maxHeight: 'calc(100vh - 40px)',
          maxWidth: 'calc(100vw - 40px)',
          zIndex: 10000,
          background: 'rgba(10, 16, 31, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#f8fafc',
          textAlign: 'left'
        }}>
          {/* Header Bar */}
          <div style={{
            padding: '16px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.15))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(14, 165, 233, 0.5)'
              }}>
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>Synapse-X</span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.4)'
                  }}>
                    ACTIVE TEAMMATE
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Team: <strong style={{ color: '#38bdf8' }}>{currentTeamCode}</strong></span>
                  <span>•</span>
                  <span>Viewing: <strong style={{ color: '#cbd5e1' }}>{activeModule.toUpperCase()}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Voice Toggle */}
              <button
                onClick={() => {
                  const nextState = !voiceEnabled;
                  setVoiceEnabled(nextState);
                  if (nextState) speakIfEnabled("Voice synthesis enabled.");
                }}
                title={voiceEnabled ? "Voice Enabled (Mute)" : "Enable Natural Voice Audio"}
                style={{
                  background: voiceEnabled ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${voiceEnabled ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: voiceEnabled ? '#38bdf8' : '#94a3b8',
                  padding: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Close / Minimize */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  padding: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)'
          }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'chat' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'chat' ? '#38bdf8' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={14} />
              <span>Assistance</span>
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'memory' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'memory' ? '#38bdf8' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Brain size={14} />
              <span>Team Memory ({teamLearnings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('actions')}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'actions' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'actions' ? '#38bdf8' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Zap size={14} />
              <span>Direct Actions</span>
            </button>
          </div>

          {/* TAB 1: ASSISTANCE CHAT */}
          {activeTab === 'chat' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Context Action Banner */}
              <div style={{
                padding: '8px 14px',
                background: 'rgba(56, 189, 248, 0.08)',
                borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#38bdf8'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={13} />
                  Context: <strong style={{ color: '#ffffff' }}>{activeModule}</strong>
                </span>
                <button
                  onClick={handleInspectCurrentPage}
                  disabled={isAnalyzing}
                  style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={10} className={isAnalyzing ? 'animate-spin' : ''} />
                  <span>Inspect Page</span>
                </button>
              </div>

              {/* Message History */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '88%',
                      padding: '12px 14px',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #0284c7, #2563eb)'
                        : 'rgba(30, 41, 59, 0.75)',
                      border: `1px solid ${msg.sender === 'user' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                      fontSize: '13px',
                      lineHeight: '1.45',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      <div>{msg.text}</div>

                      {/* Action Suggestion Button inside AI response */}
                      {msg.actionSuggestion && (
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <button
                            onClick={() => {
                              msg.actionSuggestion?.action();
                              setIsOpen(false);
                            }}
                            style={{
                              background: 'rgba(56, 189, 248, 0.25)',
                              border: '1px solid #38bdf8',
                              color: '#38bdf8',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              width: '100%',
                              justifyContent: 'center'
                            }}
                          >
                            <span>{msg.actionSuggestion.label}</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div style={{
                      fontSize: '10px',
                      color: '#64748b',
                      marginTop: '4px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <span>{msg.timestamp}</span>
                      {msg.contextCited && (
                        <span style={{ color: '#0ea5e9' }}>• {msg.contextCited}</span>
                      )}
                    </div>
                  </div>
                ))}
                {isAnalyzing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '12px' }}>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Synapse is analyzing state & team memory...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Contextual Suggestion Pills */}
              <div style={{
                padding: '6px 12px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {getContextSuggestions().map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(chip.query);
                      // Trigger direct query
                      setTimeout(() => {
                        handleSendMessage();
                      }, 50);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#cbd5e1',
                      borderRadius: '12px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    className="hover:border-sky-400 hover:text-sky-300"
                  >
                    {chip.text}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '12px 14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  gap: '8px',
                  background: 'rgba(15, 23, 42, 0.8)'
                }}
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask Synapse anything about Team ${currentTeamCode}...`}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  style={{
                    background: inputMessage.trim() ? '#0284c7' : 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0 14px',
                    color: '#ffffff',
                    cursor: inputMessage.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: TEAM MEMORY & ADAPTATION STREAM */}
          {activeTab === 'memory' && (
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                    Team Adaptive Neural Stream
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    CODE: {currentTeamCode}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                  Synapse learns continuously from your team's resolutions, overrides, and policies. These rules shape every AI suggestion and autonomous action.
                </p>
              </div>

              {/* Teach New Rule Action */}
              <button
                onClick={() => setShowTeachModal(true)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(99, 102, 241, 0.2))',
                  border: '1px dashed #38bdf8',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                <span>Teach Synapse New Team Heuristic</span>
              </button>

              {/* Memory List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {teamLearnings.map(learning => (
                  <div
                    key={learning.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '12px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8'
                      }}>
                        {learning.category}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {learning.timestamp}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4, marginBottom: '6px' }}>
                      "{learning.heuristic}"
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      Contributed by: <strong style={{ color: '#cbd5e1' }}>{learning.author}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DIRECT AUTONOMOUS ACTIONS */}
          {activeTab === 'actions' && (
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                One-click operations executed with team authority:
              </div>

              <div
                onClick={() => {
                  navigateTo('/app/team');
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                className="hover:border-sky-400"
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Workforce Shift Command</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Inspect member timesheets, hours logged & active tasks</div>
                </div>
                <Users size={18} color="#38bdf8" />
              </div>

              <div
                onClick={() => {
                  navigateTo('/app/redteam');
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                className="hover:border-red-400"
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Red Team Attack Verification</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Audit 100 synthetic bot traces & cluster entropy</div>
                </div>
                <Shield size={18} color="#f87171" />
              </div>

              <div
                onClick={() => {
                  navigateTo('/app/forgelab');
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                className="hover:border-purple-400"
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Forge Lab Empirical Benchmarks</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Run 1,420 automated unit tests & L1 Moss latency verification</div>
                </div>
                <Zap size={18} color="#c084fc" />
              </div>

              <div
                onClick={() => {
                  navigateTo('/app/incidents');
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                className="hover:border-emerald-400"
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Resolve Enterprise Incident</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Generate certified settlement voucher for customer downtime</div>
                </div>
                <CheckCircle2 size={18} color="#34d399" />
              </div>

              {/* Agent Swarm & Automation Direct Action */}
              <div
                onClick={() => {
                  navigateTo('/app/agents');
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.25))',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>⚡ Autonomous Agent Swarm</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>6 micro-agents, 1-click self-healing & continuous sentinel</div>
                </div>
                <Cpu size={18} color="#38bdf8" />
              </div>

              {/* 5-Min Judge Demo Mode Direct Action */}
              <div
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('forge:start-demo'));
                  }, 200);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(244, 63, 94, 0.25))',
                  border: '1px solid rgba(192, 132, 252, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 0 15px rgba(168, 85, 247, 0.15)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#c084fc' }}>⚡ 5-Minute Judge Demo Tour</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Audio-narrated automated walkthrough of all platform capabilities</div>
                </div>
                <Zap size={18} color="#c084fc" />
              </div>
            </div>
          )}

          {/* TEACH SYNAPSE MODAL OVERLAY */}
          {showTeachModal && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2, 6, 23, 0.95)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 10001
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>
                Teach Synapse a New Team Practice
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
                Input a policy, exception rule, or operational preference for Team <strong>{currentTeamCode}</strong>:
              </p>

              <form onSubmit={handleAddHeuristic}>
                <textarea
                  value={newHeuristicText}
                  onChange={(e) => setNewHeuristicText(e.target.value)}
                  placeholder="e.g. Always notify Operations Lead on claims over $750 during weekends..."
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    marginBottom: '16px',
                    resize: 'none',
                    outline: 'none'
                  }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Commit to Team Memory
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTeachModal(false)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#94a3b8',
                      border: 'none',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};
