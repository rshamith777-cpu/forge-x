import React, { useState } from 'react';

interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'policy' | 'event' | 'decision' | 'system' | 'evidence';
  x: number;
  y: number;
  details: string;
  provenance: string;
}

interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

const NODES: GraphNode[] = [
  { id: 'usr_01', label: 'Sarah Chen (Staff Lead)', type: 'person', x: 120, y: 180, details: 'Customer Engineering Staff Lead with tacit bypass discretion.', provenance: 'Slack war room logs' },
  { id: 'pol_01', label: 'POL-OPS-012 (Refund Policy)', type: 'policy', x: 400, y: 80, details: 'Documented rule mandating 48h manager review for refunds > $500.', provenance: 'Confluence SOP Handbook v1.2' },
  { id: 'dec_01', label: 'DEC-0012: Direct Fast-Track Credit', type: 'decision', x: 380, y: 260, details: 'Approved $750 credit to prevent enterprise customer churn.', provenance: 'GENOME-APEX-BILLING-001' },
  { id: 'sys_01', label: 'Stripe Billing System', type: 'system', x: 680, y: 320, details: 'Payment gateway executing live credits and refunds.', provenance: 'Stripe webhook telemetry' },
  { id: 'sys_02', label: 'Zendesk Ticketing', type: 'system', x: 120, y: 380, details: 'Official support portal where tickets originate.', provenance: 'Ticket ID: TICK-402' },
  { id: 'evi_01', label: 'EVID-001: VP Slack Authority', type: 'evidence', x: 420, y: 440, details: 'Prior VP message establishing fast-track credit authority.', provenance: '#incidents-war-room (Slack)' },
  { id: 'evt_01', label: 'Shard Latency Outage', type: 'event', x: 680, y: 140, details: 'Multi-region shard disruption affecting Enterprise tier accounts.', provenance: 'Datadog incident INC-882' },
];

const EDGES: GraphEdge[] = [
  { source: 'usr_01', target: 'dec_01', label: 'executed_by' },
  { source: 'pol_01', target: 'dec_01', label: 'governed_by' },
  { source: 'dec_01', target: 'sys_01', label: 'applied_in' },
  { source: 'evt_01', target: 'dec_01', label: 'caused_by' },
  { source: 'evi_01', target: 'dec_01', label: 'justified_by' },
  { source: 'sys_02', target: 'usr_01', label: 'routed_to' },
];

export const OrganizationalGraphView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(NODES[2]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'person': return '#38bdf8';
      case 'policy': return '#fbbf24';
      case 'decision': return '#34d399';
      case 'system': return '#a78bfa';
      case 'evidence': return '#10b981';
      case 'event': return '#f43f5e';
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
            Interactive model traversing relationships across People, Policies, Events, Decisions, Workflows, Systems, and Evidence.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
        {/* Interactive SVG Canvas */}
        <div className="glass-panel" style={{ height: '580px', position: 'relative', overflow: 'hidden', padding: '12px' }}>
          <svg width="100%" height="100%" viewBox="0 0 840 520">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.4)" />
              </marker>
            </defs>

            {/* Edges */}
            {EDGES.map((e, idx) => {
              const src = NODES.find(n => n.id === e.source);
              const tgt = NODES.find(n => n.id === e.target);
              if (!src || !tgt) return null;
              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;
              return (
                <g key={idx}>
                  <line 
                    x1={src.x} 
                    y1={src.y} 
                    x2={tgt.x} 
                    y2={tgt.y} 
                    stroke="rgba(255,255,255,0.18)" 
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <text 
                    x={midX} 
                    y={midY - 6} 
                    fill="#64748b" 
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
            {NODES.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              const color = getNodeColor(n.type);
              return (
                <g 
                  key={n.id} 
                  transform={`translate(${n.x}, ${n.y})`}
                  onClick={() => setSelectedNode(n)}
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
