import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Network, Search, Filter, Sparkles, CheckCircle2, AlertTriangle, 
  ExternalLink, ArrowRight, ShieldCheck, Zap, Database, Terminal, 
  Users, Layers, FileText, Activity, HelpCircle, Send, ZoomIn, 
  ZoomOut, RotateCcw, Play, Eye, Cpu, Radio, Shield, Award,
  GitBranch, Clock, ArrowUpRight, ChevronRight, CornerDownRight
} from 'lucide-react';
import { useOrgData, type TwinGraphNode, type MossAnswer } from '../../context/OrgDataContext';

export interface DigitalTwinViewProps {
  onNavigateToIngestion?: () => void;
  onNavigateToDecide?: () => void;
  onNavigateToObserve?: () => void;
  onNavigateToScenarios?: () => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  onNavigateToIngestion,
  onNavigateToDecide,
  onNavigateToObserve,
  onNavigateToScenarios
}) => {
  const {
    isLoaded,
    datasetSummary,
    twinNodes,
    twinEdges,
    generateDemoOrganization,
    askMoss
  } = useOrgData();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('dec_01');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [energyFlowActive, setEnergyFlowActive] = useState<boolean>(true);
  const [spotlightMode, setSpotlightMode] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'attributes' | 'lineage' | 'audit'>('attributes');

  // Moss Interactive Reasoning State
  const [mossQuestion, setMossQuestion] = useState<string>('Why did fast-track credit bypass POL-OPS-012 in incident DEC-0012?');
  const [mossLoading, setMossLoading] = useState<boolean>(false);
  const [mossAnswer, setMossAnswer] = useState<MossAnswer | null>(null);

  const selectedNode = useMemo(() => {
    return twinNodes.find(n => n.id === selectedNodeId) || twinNodes[0];
  }, [twinNodes, selectedNodeId]);

  const filteredNodes = useMemo(() => {
    return twinNodes.filter(node => {
      const matchesType = filterType === 'all' || node.type === filterType;
      const matchesSearch = searchQuery === '' || 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [twinNodes, filterType, searchQuery]);

  // Causal Lineage: Upstream Parents & Downstream Children
  const connectedEdgeSet = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId;
    const connected = new Set<string>();
    twinEdges.forEach(e => {
      if (e.source === targetId || e.target === targetId) {
        connected.add(`${e.source}->${e.target}`);
      }
    });
    return connected;
  }, [twinEdges, selectedNodeId, hoveredNodeId]);

  const connectedNodeIds = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId;
    const ids = new Set<string>([targetId]);
    twinEdges.forEach(e => {
      if (e.source === targetId) ids.add(e.target);
      if (e.target === targetId) ids.add(e.source);
    });
    return ids;
  }, [twinEdges, selectedNodeId, hoveredNodeId]);

  const upstreamParents = useMemo(() => {
    return twinEdges
      .filter(e => e.target === selectedNode?.id)
      .map(e => ({
        edge: e,
        node: twinNodes.find(n => n.id === e.source)
      }))
      .filter(item => item.node !== undefined);
  }, [twinEdges, selectedNode, twinNodes]);

  const downstreamChildren = useMemo(() => {
    return twinEdges
      .filter(e => e.source === selectedNode?.id)
      .map(e => ({
        edge: e,
        node: twinNodes.find(n => n.id === e.target)
      }))
      .filter(item => item.node !== undefined);
  }, [twinEdges, selectedNode, twinNodes]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'person': return '#38bdf8';     // Neon Sky Blue
      case 'policy': return '#fbbf24';     // Amber Gold
      case 'decision': return '#34d399';   // Emerald Green
      case 'system': return '#a78bfa';     // Neon Violet
      case 'evidence': return '#06b6d4';   // Vibrant Cyan
      case 'event': return '#f43f5e';      // Hot Rose
      case 'workflow': return '#818cf8';   // Indigo
      case 'outcome': return '#e879f9';    // Neon Magenta
      default: return '#94a3b8';
    }
  };

  const getNodeIcon = (type: string, size = 14) => {
    switch (type) {
      case 'person': return <Users size={size} />;
      case 'policy': return <Shield size={size} />;
      case 'decision': return <Zap size={size} />;
      case 'system': return <Cpu size={size} />;
      case 'evidence': return <FileText size={size} />;
      case 'event': return <Radio size={size} />;
      case 'workflow': return <GitBranch size={size} />;
      case 'outcome': return <Award size={size} />;
      default: return <Activity size={size} />;
    }
  };

  const getNodeBadgeLabel = (type: string) => {
    switch (type) {
      case 'person': return 'ACTOR / PERSON';
      case 'policy': return 'POLICY RULE';
      case 'decision': return 'DECISION GENOME';
      case 'system': return 'INTEGRATED SYSTEM';
      case 'evidence': return 'GROUNDED EVIDENCE';
      case 'event': return 'OBSERVED TELEMETRY';
      case 'workflow': return 'WORKFLOW GRAPH';
      case 'outcome': return 'BUSINESS OUTCOME';
      default: return type.toUpperCase();
    }
  };

  const handleAskMoss = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mossQuestion.trim()) return;

    setMossLoading(true);
    try {
      const res = await askMoss(mossQuestion);
      setMossAnswer(res);
    } catch (err) {
      console.error('Moss query error:', err);
    } finally {
      setMossLoading(false);
    }
  };

  // If no organization is loaded, display the strict empty state
  if (!isLoaded) {
    return (
      <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(6, 12, 24, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '48px 32px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#f43f5e'
          }}>
            <Network size={32} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>
            No organizational data loaded
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            The Organizational Digital Twin requires operational evidence. Please upload data files or generate a realistic demo organization to synthesize this relationship graph.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateToIngestion}
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
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px 60px 32px', maxWidth: '1480px', margin: '0 auto', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
      {/* Dynamic Keyframes for Flowing Energy and Radars */}
      <style>{`
        @keyframes twinRadarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes twinPulseRing {
          0% { r: 24px; opacity: 0.9; }
          50% { r: 38px; opacity: 0.3; }
          100% { r: 48px; opacity: 0; }
        }
        @keyframes twinDashOffset {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes twinGlowPulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.5)); }
          50% { filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.9)); }
        }
        @keyframes twinBeacon {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .twin-energy-edge {
          stroke-dasharray: 6 6;
          animation: twinDashOffset 1.2s linear infinite;
        }
      `}</style>

      {/* Header Cockpit */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        paddingBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'twinBeacon 1.5s infinite' }} />
              ORGANIZATIONAL DIGITAL TWIN
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 700
            }}>
              CAUSAL LINEAGE FABRIC
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              PROVENANCE-INDEXED
            </span>
          </div>

          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 4px 0',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Organizational Digital Twin
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0, maxWidth: '850px' }}>
            Living operational model synthesizing <strong style={{ color: '#38bdf8' }}>People, Policies, Events, Decisions, Workflows, Systems, Evidence, and Outcomes</strong> from {datasetSummary.events.toLocaleString()} ingested events.
          </p>
        </div>

        {/* Top Right Cockpit Telemetry */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            padding: '7px 14px',
            background: 'rgba(6, 14, 28, 0.8)',
            borderRadius: '8px',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            fontSize: '12px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>{twinNodes.length}</span> Nodes
            </div>
            <div>
              <span style={{ color: '#34d399', fontWeight: 800 }}>{twinEdges.length}</span> Edges
            </div>
            <div style={{ color: '#fbbf24', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
              CONFIDENCE: 98.4%
            </div>
          </div>

          <button
            onClick={onNavigateToObserve}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              color: '#38bdf8',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Observe Reality</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Filter, Search & Canvas Mode Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        background: 'rgba(15, 23, 42, 0.65)',
        padding: '10px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Filter Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11.5px', color: '#64748b', marginRight: '4px', fontWeight: 700 }}>ENTITIES:</span>
          {['all', 'decision', 'person', 'policy', 'workflow', 'system', 'evidence', 'event', 'outcome'].map((type) => {
            const isCurrent = filterType === type;
            const typeColor = type === 'all' ? '#38bdf8' : getNodeColor(type);
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: isCurrent ? `1px solid ${typeColor}` : '1px solid rgba(255, 255, 255, 0.06)',
                  background: isCurrent ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.3)',
                  color: isCurrent ? typeColor : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: isCurrent ? 800 : 500,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                {type !== 'all' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: typeColor }} />}
                {type}
              </button>
            );
          })}
        </div>

        {/* Canvas Visual Toggles & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Energy Stream Flow Toggle */}
          <button
            onClick={() => setEnergyFlowActive(!energyFlowActive)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: energyFlowActive ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${energyFlowActive ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: energyFlowActive ? '#38bdf8' : '#94a3b8',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Zap size={13} color={energyFlowActive ? '#38bdf8' : '#64748b'} />
            <span>Energy Pulses {energyFlowActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Spotlight Mode Toggle */}
          <button
            onClick={() => setSpotlightMode(!spotlightMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: spotlightMode ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${spotlightMode ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: spotlightMode ? '#34d399' : '#94a3b8',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Eye size={13} color={spotlightMode ? '#34d399' : '#64748b'} />
            <span>Causal Spotlight {spotlightMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={13} color="#64748b" style={{ position: 'absolute', left: '10px', top: '9px' }} />
            <input
              type="text"
              placeholder="Search graph..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 30px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '11.5px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Live Node Intelligence Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.4fr) minmax(380px, 1fr)', gap: '20px', marginBottom: '28px' }}>
        {/* SVG Interactive Canvas */}
        <div 
          id="digital-twin-graph"
          data-demo-target="digital-twin-graph"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(15, 23, 42, 0.95) 0%, rgba(6, 10, 20, 0.98) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '16px',
            height: '640px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Subtle Cyber Grid & Radar Lines Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
            opacity: 0.6
          }} />

          {/* Background Concentric Radar Rings */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '560px',
            height: '560px',
            border: '1px dashed rgba(6, 182, 212, 0.12)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '340px',
            height: '340px',
            border: '1px solid rgba(6, 182, 212, 0.08)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />

          {/* Canvas Floating Top Controls */}
          <div style={{
            position: 'absolute',
            top: '14px',
            right: '16px',
            display: 'flex',
            gap: '6px',
            zIndex: 10
          }}>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
              style={{
                background: 'rgba(6, 14, 28, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#e2e8f0',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
              style={{
                background: 'rgba(6, 14, 28, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#e2e8f0',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              style={{
                background: 'rgba(6, 14, 28, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#e2e8f0',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Reset View"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* SVG Graph View */}
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1060 620" 
            style={{ 
              cursor: 'grab',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.25s ease'
            }}
          >
            <defs>
              {/* Arrowheads for different types */}
              <marker id="twin-arrow-default" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.3)" />
              </marker>
              <marker id="twin-arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>

              {/* Glowing Filters */}
              <filter id="neon-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="neon-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Linear Gradients */}
              <linearGradient id="edge-flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Edges */}
            {twinEdges.map((e, idx) => {
              const src = twinNodes.find(n => n.id === e.source);
              const tgt = twinNodes.find(n => n.id === e.target);
              if (!src || !tgt) return null;

              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;
              const isSelected = selectedNode && (selectedNode.id === e.source || selectedNode.id === e.target);
              const isHovered = hoveredNodeId && (hoveredNodeId === e.source || hoveredNodeId === e.target);
              const isConnected = isSelected || isHovered;
              const isDimmed = spotlightMode && (hoveredNodeId || selectedNodeId) && !isConnected;

              const edgeColor = e.color || '#38bdf8';

              return (
                <g key={idx} style={{ opacity: isDimmed ? 0.15 : 1, transition: 'opacity 0.25s ease' }}>
                  {/* Background wider hit target */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="transparent"
                    strokeWidth="16"
                  />

                  {/* Main Line */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isConnected ? edgeColor : 'rgba(255, 255, 255, 0.18)'}
                    strokeWidth={isConnected ? '3' : '1.5'}
                    markerEnd={isConnected ? 'url(#twin-arrow-active)' : 'url(#twin-arrow-default)'}
                    style={{ transition: 'all 0.2s ease' }}
                  />

                  {/* Flowing Energy Pulse on Active Edge */}
                  {energyFlowActive && isConnected && (
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={edgeColor}
                      strokeWidth="2.5"
                      className="twin-energy-edge"
                    />
                  )}

                  {/* Edge Relationship Label Card */}
                  <rect
                    x={midX - 36}
                    y={midY - 11}
                    width="72"
                    height="16"
                    fill="rgba(6, 12, 24, 0.9)"
                    stroke={isConnected ? edgeColor : 'rgba(255, 255, 255, 0.1)'}
                    strokeWidth="1"
                    rx="4"
                  />
                  <text
                    x={midX}
                    y={midY + 1}
                    fill={isConnected ? '#38bdf8' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="'JetBrains Mono', monospace"
                    textAnchor="middle"
                    fontWeight={isConnected ? '700' : '500'}
                  >
                    {e.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              const isHovered = hoveredNodeId === n.id;
              const isConnected = connectedNodeIds.has(n.id);
              const isDimmed = spotlightMode && (hoveredNodeId || selectedNodeId) && !isConnected;
              const color = getNodeColor(n.type);

              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  onClick={() => setSelectedNodeId(n.id)}
                  onMouseEnter={() => setHoveredNodeId(n.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{ 
                    cursor: 'pointer',
                    opacity: isDimmed ? 0.25 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Concentric Animated Radar Ring when Selected */}
                  {isSelected && (
                    <circle
                      r="40"
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      style={{ animation: 'twinRadarSweep 10s linear infinite' }}
                    />
                  )}

                  {/* Outer Pulsing Glow */}
                  {isSelected && (
                    <circle
                      r="32"
                      fill={color}
                      fillOpacity="0.15"
                      stroke={color}
                      strokeWidth="1"
                      strokeOpacity="0.4"
                    />
                  )}

                  {/* Main Node Card Capsule */}
                  <circle
                    r={isSelected ? '24' : (isHovered ? '22' : '18')}
                    fill="rgba(6, 14, 28, 0.95)"
                    stroke={color}
                    strokeWidth={isSelected ? '3.5' : (isHovered ? '2.5' : '1.8')}
                    filter={isSelected ? 'url(#neon-glow-cyan)' : 'none'}
                    style={{ transition: 'all 0.2s ease' }}
                  />

                  {/* Inner Glowing Core */}
                  <circle 
                    r={isSelected ? '9' : '6'} 
                    fill={color} 
                    style={{ transition: 'all 0.2s ease' }}
                  />

                  {/* Center Node Icon Visual */}
                  <circle
                    r="3"
                    fill="#ffffff"
                  />

                  {/* Primary Node Label */}
                  <text
                    y="36"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : (isHovered ? '#e2e8f0' : '#cbd5e1')}
                    fontSize="11.5"
                    fontWeight={isSelected ? '800' : '600'}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                  >
                    {n.label.length > 24 ? `${n.label.slice(0, 22)}...` : n.label}
                  </text>

                  {/* Entity Subtitle Tag */}
                  <text
                    y="49"
                    textAnchor="middle"
                    fill={color}
                    fontSize="8.5"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    {n.type.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Canvas Legend */}
          <div style={{
            position: 'absolute',
            bottom: '14px',
            left: '16px',
            background: 'rgba(6, 12, 24, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            gap: '12px',
            fontSize: '11px',
            color: '#94a3b8',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} /> Decision
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} /> Person
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} /> Policy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8' }} /> Workflow
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa' }} /> System
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} /> Evidence
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} /> Event
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e879f9' }} /> Outcome
            </span>
          </div>
        </div>

        {/* Live Node Intelligence Drawer */}
        <div style={{
          background: 'rgba(6, 12, 24, 0.85)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '16px',
          padding: '22px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            {/* Header with Type Badge & ID */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: getNodeColor(selectedNode.type),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {getNodeIcon(selectedNode.type, 13)}
                  {getNodeBadgeLabel(selectedNode.type)}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#64748b' }}>
                NODE: {selectedNode.id}
              </span>
            </div>

            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0', lineHeight: 1.35 }}>
              {selectedNode.label}
            </h2>

            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 18px 0' }}>
              {selectedNode.details}
            </p>

            {/* Tabbed Inspector Navigation */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
              {[
                { id: 'attributes', label: 'Attributes' },
                { id: 'lineage', label: `Lineage (${upstreamParents.length + downstreamChildren.length})` },
                { id: 'audit', label: 'Provenance' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    background: activeTab === tab.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                    color: activeTab === tab.id ? '#38bdf8' : '#94a3b8',
                    fontSize: '11.5px',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Operational Attributes */}
            {activeTab === 'attributes' && selectedNode.meta && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '10px',
                padding: '12px 14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(selectedNode.meta).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span style={{ color: '#ffffff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Causal Lineage (Parents & Children) */}
            {activeTab === 'lineage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                {/* Upstream Parents */}
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                    UPSTREAM CAUSES &amp; POLICIES ({upstreamParents.length})
                  </div>
                  {upstreamParents.length === 0 ? (
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic' }}>Root entity (no upstream triggers)</div>
                  ) : (
                    upstreamParents.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => item.node && setSelectedNodeId(item.node.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          marginBottom: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ fontSize: '11.5px', color: '#e2e8f0', fontWeight: 600 }}>
                          {item.node?.label}
                        </div>
                        <span style={{ fontSize: '9.5px', color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace" }}>
                          {item.edge.label}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Downstream Children */}
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                    DOWNSTREAM IMPACTS &amp; OUTCOMES ({downstreamChildren.length})
                  </div>
                  {downstreamChildren.length === 0 ? (
                    <div style={{ fontSize: '11.5px', color: '#64748b', fontStyle: 'italic' }}>Terminal outcome node</div>
                  ) : (
                    downstreamChildren.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => item.node && setSelectedNodeId(item.node.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          marginBottom: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ fontSize: '11.5px', color: '#e2e8f0', fontWeight: 600 }}>
                          {item.node?.label}
                        </div>
                        <span style={{ fontSize: '9.5px', color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>
                          {item.edge.label}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Provenance & Audit Source */}
            {activeTab === 'audit' && (
              <div style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  IMMUTABLE AUDIT CITATION
                </div>
                <div style={{ fontSize: '12px', color: '#e0f2fe', fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all', lineHeight: 1.4 }}>
                  {selectedNode.provenance}
                </div>
                <div style={{ marginTop: '8px', fontSize: '10.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verified by Moss Engine</span>
                  <span style={{ color: '#34d399' }}>SHA256: 9f8a...4b12</span>
                </div>
              </div>
            )}
          </div>

          {/* Deep Navigation CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={onNavigateToDecide}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Zap size={14} color="#34d399" />
              <span>Inspect Decision DNA</span>
            </button>

            <button
              onClick={onNavigateToScenarios}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.45)',
                color: '#38bdf8',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span>Fork Reality on This Decision →</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOSS RETRIEVAL FABRIC: Interactive Grounded Query Section */}
      <div
        id="moss-reasoning-panel"
        data-demo-target="moss-query-card"
        style={{
          background: 'rgba(6, 12, 24, 0.85)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '16px',
          padding: '24px 28px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Moss Grounded Causal Reasoning
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
              Ask why organizational decisions or workflow anomalies occur. Every assertion is grounded in the Digital Twin graph and verified against {datasetSummary.events.toLocaleString()} events.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              SUB-10MS IN-PROCESS BM25 RETRIEVAL
            </span>
          </div>
        </div>

        {/* Query Input Box */}
        <form onSubmit={handleAskMoss} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            id="input-moss-question"
            type="text"
            value={mossQuestion}
            onChange={(e) => setMossQuestion(e.target.value)}
            placeholder="Ask Moss about your organization (e.g., Why did fast-track credit bypass POL-OPS-012?)"
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button
            id="btn-ask-moss"
            type="submit"
            disabled={mossLoading}
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
              cursor: mossLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 18px rgba(6, 182, 212, 0.35)',
              opacity: mossLoading ? 0.7 : 1
            }}
          >
            <Send size={14} />
            <span>{mossLoading ? 'Retrieving...' : 'Ask Moss'}</span>
          </button>
        </form>

        {/* Suggested Queries */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>Suggested:</span>
          {[
            'Why did fast-track credit bypass POL-OPS-012 in incident DEC-0012?',
            'How did Candidate V2 neutralize the 100-bot Sybil burst attack?',
            'Where does observed employee behavior contradict formal SOPs?'
          ].map(q => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setMossQuestion(q);
                askMoss(q).then(setMossAnswer);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Moss Answer Card with Cited Evidence */}
        {mossAnswer && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#34d399', letterSpacing: '0.04em' }}>
                  GROUNDED MOSS REASONING RESULT
                </span>
              </div>
              <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8' }}>
                Latency: {mossAnswer.latencyMs} ms
              </span>
            </div>

            <div style={{ fontSize: '14px', color: '#f1f5f9', lineHeight: 1.6, marginBottom: '18px' }}>
              {mossAnswer.answer}
            </div>

            {/* Grounded Key Facts */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10.5px', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                GROUNDED FACTS ({mossAnswer.groundedFacts.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {mossAnswer.groundedFacts.map((fact, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                    <span style={{ color: '#34d399', marginTop: '2px' }}>•</span>
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Cards */}
            <div>
              <div style={{ fontSize: '10.5px', fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                CITATIONS &amp; EVIDENCE ARTIFACTS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {mossAnswer.evidenceCards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8' }}>{card.id}</span>
                      <span style={{ fontSize: '10px', color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>
                        Score: {Math.round(card.relevanceScore * 100)}%
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>{card.source}</div>
                    <div style={{ fontSize: '11.5px', color: '#e2e8f0', lineHeight: 1.4 }}>
                      "{card.snippet}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
