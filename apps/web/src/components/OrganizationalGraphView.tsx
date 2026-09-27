import React, { useState } from 'react';
import { useOrgData } from '../context/OrgDataContext';

export const OrganizationalGraphView: React.FC = () => {
  const { twinNodes, twinEdges, isLoaded } = useOrgData();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('dec_01');

  const selectedNode = twinNodes.find(n => n.id === selectedNodeId) || twinNodes[0];

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'person': return '#38bdf8';
      case 'policy': return '#fbbf24';
      case 'decision': return '#34d399';
      case 'system': return '#a78bfa';
      case 'evidence': return '#10b981';
      case 'event': return '#f43f5e';
      case 'workflow': return '#06b6d4';
      case 'outcome': return '#e879f9';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">ORGANIZATIONAL DIGITAL TWIN</span>
            <span className="badge badge-cyan">CAUSAL & PROVENANCE GRAPH</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>
            Organizational Causal Graph
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Interactive model traversing relationships across People, Policies, Events, Decisions, Workflows, Systems, Evidence, and Outcomes.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
        {/* Interactive SVG Canvas */}
        <div className="glass-panel" style={{ height: '580px', position: 'relative', overflow: 'hidden', padding: '12px' }}>
          <svg width="100%" height="100%" viewBox="0 0 1020 540">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
              </marker>
            </defs>

            {/* Edges */}
            {twinEdges.map((e, idx) => {
              const src = twinNodes.find(n => n.id === e.source);
              const tgt = twinNodes.find(n => n.id === e.target);
              if (!src || !tgt) return null;
              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;
              const isSelected = selectedNode && (selectedNode.id === e.source || selectedNode.id === e.target);

              return (
                <g key={idx}>
                  <line 
                    x1={src.x} 
                    y1={src.y} 
                    x2={tgt.x} 
                    y2={tgt.y} 
                    stroke={isSelected ? (e.color || '#38bdf8') : "rgba(255,255,255,0.18)"} 
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    strokeDasharray={e.label.includes('exception') ? '4 4' : 'none'}
                    markerEnd="url(#arrow)"
                  />
                  <text 
                    x={midX} 
                    y={midY - 6} 
                    fill={isSelected ? '#38bdf8' : "#64748b"} 
                    fontSize="10" 
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    {e.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {twinNodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              const color = getNodeColor(n.type);
              return (
                <g 
                  key={n.id} 
                  transform={`translate(${n.x}, ${n.y})`}
                  onClick={() => setSelectedNodeId(n.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle 
                    r={isSelected ? "26" : "20"} 
                    fill={color} 
                    fillOpacity="0.2" 
                    stroke={color} 
                    strokeWidth={isSelected ? "3" : "1.5"}
                  />
                  <circle r="6" fill={color} />
                  <text 
                    y="36" 
                    textAnchor="middle" 
                    fill="#f8fafc" 
                    fontSize="11" 
                    fontWeight="600"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Detail & Provenance Drawer */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          {selectedNode ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span className="badge font-mono" style={{ color: getNodeColor(selectedNode.type) }}>
                  {selectedNode.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedNode.id}</span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                {selectedNode.label}
              </h3>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '18px' }}>
                {selectedNode.details}
              </div>

              {selectedNode.meta && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                  {Object.entries(selectedNode.meta).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>{k}:</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  PROVENANCE & TRACE SOURCE
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'JetBrains Mono', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>
                  {selectedNode.provenance}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
              Click any node on the canvas to inspect provenance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
