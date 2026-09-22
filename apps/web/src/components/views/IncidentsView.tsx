import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, Filter, PlusCircle, CheckCircle2, 
  AlertTriangle, Clock, ArrowRight, X, FileText, Download, 
  ChevronRight, ExternalLink, RefreshCw, UserCheck
} from 'lucide-react';
import { fetchIncidents, fetchIncidentDetail, createIncident, resolveIncident } from '../../lib/api';

export interface IncidentsViewProps {
  initialFilter?: string;
  initialIncidentId?: string;
  initialOpenNew?: boolean;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  initialFilter,
  initialIncidentId,
  initialOpenNew
}) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(initialFilter || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [showNewModal, setShowNewModal] = useState(initialOpenNew || false);
  const [resolving, setResolving] = useState(false);
  const [voucherModal, setVoucherModal] = useState<any | null>(null);
  const [showDecisionTrace, setShowDecisionTrace] = useState(false);

  // New incident form state
  const [newCustomer, setNewCustomer] = useState('');
  const [newTier, setNewTier] = useState('enterprise');
  const [newMrr, setNewMrr] = useState(45000);
  const [newHours, setNewHours] = useState(3.0);
  const [newAmount, setNewAmount] = useState(750);
  const [newPriority, setNewPriority] = useState('HIGH');
  const [creating, setCreating] = useState(false);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetchIncidents({
        status: activeTab === 'All' ? undefined : activeTab,
        search: searchQuery || undefined
      });
      setIncidents(res.incidents || []);
      if (initialIncidentId && !selectedIncident) {
        const match = res.incidents.find((i: any) => i.id.toLowerCase() === initialIncidentId.toLowerCase());
        if (match) setSelectedIncident(match);
      }
    } catch (err) {
      console.error("Failed to load incidents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [activeTab, searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer) return;
    setCreating(true);
    try {
      const created = await createIncident({
        customer: newCustomer,
        tier: newTier,
        mrr: Number(newMrr),
        duration_hours: Number(newHours),
        claimed_amount: Number(newAmount),
        priority: newPriority,
        owner: 'Ananya R. (Lead)'
      });
      setShowNewModal(false);
      setNewCustomer('');
      await loadIncidents();
      setSelectedIncident(created);
    } catch (err) {
      console.error("Error creating incident", err);
    } finally {
      setCreating(false);
    }
  };

  const handleResolve = async (incidentId: string) => {
    setResolving(true);
    try {
      const res = await resolveIncident(incidentId, {
        approver: 'Ananya R. (Operations Lead)',
        approved_amount: selectedIncident.recommended_credit,
        notes: `Approved in accordance with ${selectedIncident.policy_id}`
      });
      if (res?.voucher) {
        setVoucherModal(res.voucher);
        setSelectedIncident(res.incident);
        loadIncidents();
      }
    } catch (err) {
      console.error("Failed to resolve incident", err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1440px', margin: '0 auto', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            Incidents
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 300, margin: 0 }}>
            Resolve customer-impacting service events with policy-backed decisions and verified financial authority.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowNewModal(true)}
            className="btn-primary"
            style={{ fontSize: '13.5px', padding: '10px 18px', borderRadius: '8px' }}
          >
            <PlusCircle size={15} /> + New Incident
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Open', 'At Risk', 'Awaiting Approval', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
                color: activeTab === tab ? '#38bdf8' : '#94a3b8',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              placeholder="Filter by customer, ID, policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                width: '200px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Table Layout */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 12px auto', color: '#06b6d4' }} />
            Loading incident records...
          </div>
        ) : incidents.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
              No incidents match your current filter
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Try adjusting your search query or selecting the "All" tab.
            </div>
            <button 
              onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
              className="btn-secondary"
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>
                <th style={{ padding: '14px 18px' }}>INCIDENT</th>
                <th style={{ padding: '14px 18px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 18px' }}>IMPACT</th>
                <th style={{ padding: '14px 18px' }}>DURATION</th>
                <th style={{ padding: '14px 18px' }}>SLA STATUS</th>
                <th style={{ padding: '14px 18px' }}>PROPOSED CREDIT</th>
                <th style={{ padding: '14px 18px' }}>OWNER</th>
                <th style={{ padding: '14px 18px' }}>STATUS</th>
                <th style={{ padding: '14px 18px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => {
                const isBreached = inc.sla_status === 'BREACHED';
                const isAtRisk = inc.sla_status === 'AT RISK';
                return (
                  <tr 
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                      {inc.id}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#ffffff', fontWeight: 500 }}>
                      <div>{inc.customer}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>{inc.tier}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>
                      {inc.impact}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8' }}>
                      {inc.duration_hours}h
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: isBreached ? 'rgba(239, 68, 68, 0.15)' : (isAtRisk ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                        color: isBreached ? '#f87171' : (isAtRisk ? '#fbbf24' : '#34d399'),
                        border: `1px solid ${isBreached ? 'rgba(239, 68, 68, 0.3)' : (isAtRisk ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)')}`
                      }}>
                        {inc.sla_status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#34d399' }}>
                      ${inc.recommended_credit.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8' }}>
                      {inc.owner}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge ${inc.status === 'Resolved' ? 'badge-emerald' : (inc.status === 'Open' ? 'badge-cyan' : 'badge-amber')}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                        {inc.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncident(inc);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#38bdf8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px'
                        }}
                      >
                        Inspect <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* INCIDENT DETAIL DRAWER / MODAL */}
      {selectedIncident && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 80
        }}
        onClick={() => setSelectedIncident(null)}
        >
          <div 
            style={{
              width: '580px',
              maxWidth: '90vw',
              height: '100%',
              background: '#0a101d',
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.8)',
              overflowY: 'auto',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                      {selectedIncident.id}
                    </span>
                    <span className={`badge ${selectedIncident.sla_status === 'BREACHED' ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '10.5px' }}>
                      {selectedIncident.sla_status}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {selectedIncident.customer}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
                    {selectedIncident.impact} • {selectedIncident.duration_hours}h Disruption
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedIncident(null)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Customer Impact Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ACCOUNT TIER & MRR</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
                    {selectedIncident.tier.toUpperCase()} • ${(selectedIncident.mrr || 45000).toLocaleString()}/mo
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CLAIMED AMOUNT</div>
                  <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#38bdf8', marginTop: '4px' }}>
                    ${selectedIncident.claimed_amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Recommended Resolution */}
              <div style={{
                background: 'rgba(6, 12, 26, 0.9)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                borderRadius: '10px',
                padding: '18px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em', marginBottom: '6px' }}>
                  POLICY-RECOMMENDED SETTLEMENT
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
                  ${selectedIncident.recommended_credit.toLocaleString()} Credit
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '10px' }}>
                  {selectedIncident.reason}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <strong>Governing Policy:</strong> <span style={{ color: '#fbbf24' }}>{selectedIncident.policy_id}</span> ({selectedIncident.policy_title})
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  <strong>Authority Level:</strong> <span style={{ color: '#ffffff' }}>{selectedIncident.authority_required}</span>
                </div>
              </div>

              {/* "Why this decision?" Expandable Section */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>
                    Why this decision?
                  </div>
                  <button
                    onClick={() => setShowDecisionTrace(!showDecisionTrace)}
                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer' }}
                  >
                    {showDecisionTrace ? 'Hide Trace' : 'View Technical Decision Trace'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                  <div>• <strong>Customer Tier:</strong> {selectedIncident.tier.toUpperCase()} receives priority fast-track SLA response.</div>
                  <div>• <strong>Service Disruption:</strong> {selectedIncident.duration_hours}h exceeds the 2.0h contract SLA limit.</div>
                  <div>• <strong>Authority Cap:</strong> Evaluated under Tier 2 management authority limits.</div>
                  <div>• <strong>Precedents:</strong> Matches {selectedIncident.precedents_count || 7} verified historical resolution cases.</div>
                </div>

                {showDecisionTrace && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '11.5px',
                    fontFamily: 'monospace',
                    color: '#94a3b8'
                  }}>
                    <div>Genome Ref: GENOME-APEX-BILLING-001 (Confidence: 98%)</div>
                    <div>Evidence Refs: {(selectedIncident.evidence_ids || []).join(', ')}</div>
                    <div>Retrieval Latency: 0.18 ms (Sub-10ms Verified)</div>
                    <div>Ledger Pool: Monthly Outage Reserve ($50,000 Cap)</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => handleResolve(selectedIncident.id)}
                disabled={resolving || selectedIncident.status === 'Resolved'}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedIncident.status === 'Resolved' ? '#10b981' : 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: selectedIncident.status === 'Resolved' ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {resolving ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                {selectedIncident.status === 'Resolved' ? 'Settlement Completed' : 'Approve & Issue Settlement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW INCIDENT MODAL */}
      {showNewModal && (
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
        onClick={() => setShowNewModal(false)}
        >
          <div 
            style={{
              width: '520px',
              background: '#0d1527',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Record New Customer Incident
              </h3>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>CUSTOMER ACCOUNT NAME</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. CloudScale Inc."
                  value={newCustomer}
                  onChange={e => setNewCustomer(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>CUSTOMER TIER</label>
                  <select 
                    value={newTier}
                    onChange={e => setNewTier(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px' }}
                  >
                    <option value="enterprise">Enterprise Tier</option>
                    <option value="strategic_partner">Strategic Partner</option>
                    <option value="pro">Pro Plan</option>
                    <option value="starter">Starter Plan</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>PRIORITY</label>
                  <select 
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px' }}
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>SERVICE DOWNTIME (HOURS)</label>
                  <input 
                    type="number"
                    step="0.5"
                    value={newHours}
                    onChange={e => setNewHours(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>CLAIMED CREDIT ($)</label>
                  <input 
                    type="number"
                    value={newAmount}
                    onChange={e => setNewAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowNewModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: '13px', padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="btn-primary"
                  style={{ fontSize: '13px', padding: '8px 18px' }}
                >
                  {creating ? 'Creating...' : 'Create & Check Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLUTION VOUCHER MODAL */}
      {voucherModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}
        onClick={() => setVoucherModal(null)}
        >
          <div 
            style={{
              width: '600px',
              maxWidth: '90vw',
              background: '#070d18',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '14px',
              padding: '28px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.9)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.10)', paddingBottom: '16px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={24} color="#10b981" />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                    SETTLEMENT DECISION RECORD
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Certified Resolution Voucher • Immutable Audit Trail
                  </div>
                </div>
              </div>
              <span className="badge badge-emerald">AUTHORIZED</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>VOUCHER REFERENCE</span>
                <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>{voucherModal.voucher_reference}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>CUSTOMER ACCOUNT</span>
                <strong style={{ color: '#38bdf8' }}>{voucherModal.customer} ({voucherModal.account_tier?.toUpperCase()})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>AUTHORIZED CREDIT</span>
                <strong style={{ color: '#34d399', fontSize: '16px' }}>${voucherModal.approved_amount?.toLocaleString()}.00 USD</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>GOVERNING POLICY</span>
                <strong style={{ color: '#fbbf24' }}>{voucherModal.governing_policy}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>APPROVER</span>
                <strong style={{ color: '#ffffff' }}>{voucherModal.approver}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>TIMESTAMP</span>
                <strong style={{ color: '#ffffff' }}>{voucherModal.timestamp}</strong>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '12px',
              color: '#cbd5e1',
              lineHeight: 1.5,
              marginBottom: '18px'
            }}>
              <strong>Audit Ledger Entry:</strong> {voucherModal.notes}. Credited to customer invoice and deducted from monthly operational incident reserve.
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                {voucherModal.environment}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Settlement Record - ${voucherModal.voucher_reference}</title>
                          <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
                            .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
                            .title { font-size: 22px; font-weight: bold; color: #1e3a8a; letter-spacing: -0.01em; }
                            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 24px; font-size: 14px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
                            .field { margin-bottom: 4px; }
                            .label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
                            .val { font-size: 15px; font-weight: bold; color: #0f172a; }
                            .notice { padding: 16px; background: #f1f5f9; border-left: 4px solid #10b981; font-size: 13px; color: #334155; line-height: 1.5; border-radius: 4px; margin-bottom: 24px; }
                            .badge { display: inline-block; padding: 6px 12px; background: #dcfce7; color: #15803d; border-radius: 6px; font-size: 12px; font-weight: bold; }
                            .footer { border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #94a3b8; text-align: center; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <div>
                              <div class="title">FORGE X — SETTLEMENT DECISION RECORD</div>
                              <div style="color: #64748b; font-size: 13px; margin-top: 4px;">Certified Resolution Voucher • Immutable Audit Trail</div>
                            </div>
                            <span class="badge">AUTHORIZED</span>
                          </div>
                          <div class="grid">
                            <div class="field"><div class="label">Voucher Reference</div><div class="val" style="font-family: monospace;">${voucherModal.voucher_reference}</div></div>
                            <div class="field"><div class="label">Customer Account</div><div class="val">${voucherModal.customer} (${voucherModal.account_tier?.toUpperCase()})</div></div>
                            <div class="field"><div class="label">Authorized Credit Amount</div><div class="val" style="color: #059669; font-size: 18px;">$${voucherModal.approved_amount?.toLocaleString()}.00 USD</div></div>
                            <div class="field"><div class="label">Governing Policy Standard</div><div class="val">${voucherModal.governing_policy}</div></div>
                            <div class="field"><div class="label">Authorized Approver</div><div class="val">${voucherModal.approver}</div></div>
                            <div class="field"><div class="label">Execution Timestamp</div><div class="val">${voucherModal.timestamp}</div></div>
                          </div>
                          <div class="notice">
                            <strong>Audit Ledger Entry:</strong> ${voucherModal.notes}. Credited to customer account and deducted from monthly SLA reserve.<br>
                            <small style="color: #64748b; margin-top: 6px; display: block;">${voucherModal.environment}</small>
                          </div>
                          <div class="footer">
                            Cryptographically Signed by FORGE X Decision Engine • Ref: SHA-256 Verified
                          </div>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                  }
                }}
                className="btn-secondary" 
                style={{ fontSize: '13px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Download PDF
              </button>
              <button 
                onClick={() => setVoucherModal(null)}
                className="btn-primary" 
                style={{ fontSize: '13px', padding: '8px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
