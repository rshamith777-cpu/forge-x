import React, { useState, useEffect } from 'react';
import { 
  Layers, Clock, FileText, CheckCircle2, ShieldCheck, 
  Search, Download, ExternalLink, RefreshCw, GitFork, ArrowRight
} from 'lucide-react';
import { fetchAuditLedger, fetchArchaeology, fetchTimeMachineTimeline, inspectTimeMachine } from '../../lib/api';
import { ArchaeologyView } from '../ArchaeologyView';
import { TimeMachineView } from '../TimeMachineView';
import { OrganizationalGraphView } from '../OrganizationalGraphView';

export interface AuditCenterViewProps {
  initialSubTab?: 'records' | 'compliance' | 'historical' | 'evidence' | 'systems';
  onNavigateToPolicy?: () => void;
}

export const AuditCenterView: React.FC<AuditCenterViewProps> = ({ initialSubTab, onNavigateToPolicy }) => {
  const [subTab, setSubTab] = useState<'records' | 'compliance' | 'historical' | 'evidence' | 'systems'>(initialSubTab || 'records');
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAuditLedger().then((res: any) => {
      setLedger(res.ledger || []);
      setLoading(false);
    }).catch((err: any) => {
      console.error("Failed to load audit ledger", err);
      setLoading(false);
    });
  }, []);

  const filteredLedger = ledger.filter(r => 
    searchQuery === '' ||
    r.record_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.incident_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.policy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.actor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1440px', margin: '0 auto', textAlign: 'left' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            Audit Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 300, margin: 0 }}>
            Central repository for decision records, process compliance audits, historical point-in-time state, and verified evidence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => alert("Audit ledger exported successfully to CSV.")}
            className="btn-secondary"
            style={{ fontSize: '13px', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export Audit Ledger (CSV)
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSubTab('records')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: subTab === 'records' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: subTab === 'records' ? '#38bdf8' : '#94a3b8',
              fontWeight: subTab === 'records' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Decision Records
          </button>
          <button
            onClick={() => setSubTab('compliance')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: subTab === 'compliance' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: subTab === 'compliance' ? '#38bdf8' : '#94a3b8',
              fontWeight: subTab === 'compliance' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Process Compliance
          </button>
          <button
            onClick={() => setSubTab('historical')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: subTab === 'historical' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: subTab === 'historical' ? '#38bdf8' : '#94a3b8',
              fontWeight: subTab === 'historical' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Historical Audit
          </button>
          <button
            onClick={() => setSubTab('evidence')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: subTab === 'evidence' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: subTab === 'evidence' ? '#38bdf8' : '#94a3b8',
              fontWeight: subTab === 'evidence' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Evidence Viewer
          </button>
          <button
            onClick={() => setSubTab('systems')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: subTab === 'systems' ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
              color: subTab === 'systems' ? '#38bdf8' : '#94a3b8',
              fontWeight: subTab === 'systems' ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Systems & Data Map
          </button>
        </div>

        {subTab === 'records' && (
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
              placeholder="Search ledger entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '180px' }}
            />
          </div>
        )}
      </div>

      {/* SUB-TAB 1: DECISION RECORDS LEDGER */}
      {subTab === 'records' && (
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '10px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading ledger...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 18px' }}>TIME</th>
                  <th style={{ padding: '14px 18px' }}>RECORD ID</th>
                  <th style={{ padding: '14px 18px' }}>INCIDENT</th>
                  <th style={{ padding: '14px 18px' }}>ACTION</th>
                  <th style={{ padding: '14px 18px' }}>ACTOR</th>
                  <th style={{ padding: '14px 18px' }}>POLICY</th>
                  <th style={{ padding: '14px 18px' }}>REFERENCE</th>
                  <th style={{ padding: '14px 18px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((rec, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 18px', color: '#64748b', fontFamily: 'monospace' }}>{rec.timestamp}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#38bdf8', fontFamily: 'monospace' }}>{rec.record_id}</td>
                    <td style={{ padding: '14px 18px', color: '#ffffff' }}>{rec.incident_id}</td>
                    <td style={{ padding: '14px 18px', color: '#cbd5e1' }}>{rec.action}</td>
                    <td style={{ padding: '14px 18px', color: '#94a3b8' }}>{rec.actor}</td>
                    <td style={{ padding: '14px 18px', color: '#fbbf24' }}>{rec.policy}</td>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: '#34d399' }}>{rec.reference}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '10.5px' }}>{rec.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PROCESS COMPLIANCE (INTEGRATED ARCHAEOLOGY) */}
      {subTab === 'compliance' && (
        <ArchaeologyView onNavigate={() => {}} />
      )}

      {/* SUB-TAB 3: HISTORICAL AUDIT (TIME MACHINE) */}
      {subTab === 'historical' && (
        <TimeMachineView onNavigate={() => {}} />
      )}

      {/* SUB-TAB 4: EVIDENCE VIEWER */}
      {subTab === 'evidence' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>EV-TRACE-8841</span>
              <span className="badge badge-emerald">VERIFIED</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              Slack Channel #outages-warroom Transcript
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              Real-time operational dialogue establishing consensus between Support Lead and Customer VP during 3.7h outage.
            </p>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>
              Source: Slack Enterprise Grid • Hash: sha256:7f4a9b...
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>EV-STRIPE-9921</span>
              <span className="badge badge-emerald">VERIFIED</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              Stripe Direct Credit Authorization Webhook
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              Payment gateway credit issuance webhook timestamped at 10:42 UTC for customer account Acme Global.
            </p>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>
              Source: Stripe API v2026-08 • Webhook ID: wh_9921_auth
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>EV-PAGER-7712</span>
              <span className="badge badge-emerald">VERIFIED</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              PagerDuty Incident Severity Log
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              Sev-1 API Gateway degradation trigger with start time 07:12 UTC and resolution 10:40 UTC.
            </p>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>
              Source: PagerDuty REST • Alert ID: PD-INC-7712
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SYSTEMS & DATA MAP */}
      {subTab === 'systems' && (
        <OrganizationalGraphView />
      )}
    </div>
  );
};
