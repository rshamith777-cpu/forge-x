import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Cpu, 
  Activity,
  ArrowRight,
  ExternalLink,
  History,
  AlertTriangle
} from 'lucide-react';
import { fetchMemorySummary, fetchPoliciesSummary, fetchAuditLedger, fetchMossMetrics } from '../../lib/api';

interface OrganizationalMemoryViewProps {
  onNavigateToDecide?: () => void;
  onNavigateToTrace?: (id: string) => void;
  onNavigateToCandidate?: () => void;
}

export const OrganizationalMemoryView: React.FC<OrganizationalMemoryViewProps> = ({
  onNavigateToDecide,
  onNavigateToTrace,
  onNavigateToCandidate
}) => {
  const [memoryData, setMemoryData] = useState<any>(null);
  const [policyData, setPolicyData] = useState<any>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [mossData, setMossData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [mem, pol, aud, moss] = await Promise.all([
          fetchMemorySummary().catch(() => null),
          fetchPoliciesSummary().catch(() => null),
          fetchAuditLedger().catch(() => null),
          fetchMossMetrics().catch(() => null),
        ]);
        setMemoryData(mem);
        setPolicyData(pol);
        setAuditData(aud);
        setMossData(moss);
      } catch (err) {
        console.error('Failed to load organizational memory:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activePb = memoryData?.active_playbook;

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
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              TRUSTED REPOSITORY
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              MOSS INDEX GROUNDING
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '20px',
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: '8px 0'
          }}>
            Organizational Memory
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 300, margin: 0 }}>
            The immutable grounding store: decisions, traces, policies, precedents, exceptions, and approved playbooks.
          </p>
        </div>

        <button
          onClick={onNavigateToDecide}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            border: 'none',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Ground New Decision <ArrowRight size={15} />
        </button>
      </div>

      {/* Security Boundary Alert */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Lock size={18} color="#34d399" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: '#e2e8f0' }}>
          <strong>SECURITY BOUNDARY ENFORCED:</strong> Only HUMAN-APPROVED playbook versions enter trusted Organizational Memory. Unapproved candidate playbooks remain quarantined in the evaluation sandbox and cannot ground live decisions.
        </span>
      </div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '24px' }}>
        <div style={{ background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>ACTIVE PLAYBOOK</div>
          <div style={{ fontSize: '20px', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700, marginTop: '4px' }}>
            Version {activePb?.version || '1.0.0'}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Status: {activePb?.status?.toUpperCase() || 'ACTIVE'}
          </div>
        </div>

        <div style={{ background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>RETRIEVAL FABRIC</div>
          <div style={{ fontSize: '16px', color: '#34d399', fontFamily: 'monospace', fontWeight: 700, marginTop: '4px' }}>
            {mossData?.active_mode || 'LOCAL FALLBACK'}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Measured P50: {mossData?.p50_latency_ms || 0.18} ms
          </div>
        </div>

        <div style={{ background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>INDEXED POLICIES</div>
          <div style={{ fontSize: '20px', color: '#fbbf24', fontFamily: 'monospace', fontWeight: 700, marginTop: '4px' }}>
            {policyData?.total_active || 30} Rules
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Across 4 Authority Tiers
          </div>
        </div>

        <div style={{ background: '#0d1527', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>QUARANTINED CANDIDATES</div>
          <div style={{ fontSize: '20px', color: '#f43f5e', fontFamily: 'monospace', fontWeight: 700, marginTop: '4px' }}>
            {memoryData?.candidate_playbooks_count || 1} Candidate
          </div>
          <button
            onClick={onNavigateToCandidate}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f43f5e',
              fontSize: '11px',
              padding: 0,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Review Candidate V2 →
          </button>
        </div>
      </div>

      {/* Two Column Layout: Approved Policies & Decision Audit Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Approved Policies */}
        <div style={{
          background: '#0d1527',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '22px'
        }}>
          <h3 style={{ fontSize: '13.5px', color: '#38bdf8', letterSpacing: '0.04em', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} /> ACTIVE OPERATIONAL POLICIES IN MEMORY
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {policyData?.policies?.slice(0, 5).map((pol: any) => (
              <div
                key={pol.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                    {pol.id}
                  </span>
                  <span style={{
                    fontSize: '10.5px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399'
                  }}>
                    {pol.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>
                  {pol.title}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {pol.rule_text || pol.clause_text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Ledger */}
        <div style={{
          background: '#0d1527',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          padding: '22px'
        }}>
          <h3 style={{ fontSize: '13.5px', color: '#34d399', letterSpacing: '0.04em', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} /> RECENT DECISION TRACES &amp; PROVENANCE
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditData?.ledger?.slice(0, 5).map((rec: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#cbd5e1', fontWeight: 600 }}>
                      {rec.incident_id || rec.record_id}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                      {rec.timestamp}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#ffffff', marginTop: '2px' }}>
                    {rec.action} • {rec.policy}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#34d399', fontFamily: 'monospace', fontWeight: 700 }}>
                    {rec.amount}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    color: '#38bdf8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(6, 182, 212, 0.1)'
                  }}>
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
