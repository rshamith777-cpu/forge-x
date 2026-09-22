import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, AlertCircle, Shield, RefreshCw, Zap, ArrowRight, UserCheck } from 'lucide-react';
import { fetchPlaybooks, approvePlaybook, stressTestPlaybook } from '../lib/api';

export const PlaybooksView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetchPlaybooks();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApproval = async (pbId: string, action: string) => {
    setActionLoading(true);
    try {
      await approvePlaybook(pbId, action, "Executive Reviewer (VP Operations)");
      setStatusMessage(`Playbook ${pbId} successfully updated with status ${action}!`);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStressTest = async (pbId: string) => {
    setActionLoading(true);
    try {
      const report = await stressTestPlaybook(pbId);
      setStatusMessage(`Adversarial test complete: ${report.scenarios_tested} scenarios tested, ${report.breached_scenarios} breached.`);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#fff' }}>Loading organizational playbooks...</div>;
  }

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">GOVERNANCE & VERSIONING</span>
            <span className="badge badge-emerald">HUMAN-IN-THE-LOOP MANDATORY</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>
            Operational Playbooks: Evolution & Signoff
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Versioned state machines combining Decision Genomes with empirical reliability scores and cryptographic approval gates.
          </p>
        </div>

        <button className="btn-primary" onClick={() => onNavigate('live-sandbox')}>
          Run Live Incident Execution <ArrowRight size={15} />
        </button>
      </div>

      {statusMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#34d399', fontSize: '13px' }}>
          ✓ {statusMessage}
        </div>
      )}

      {/* Playbook Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {data?.playbooks?.map((pb: any) => {
          const scores = pb.reliability_scores;
          const isV2 = pb.version.startsWith("2");
          return (
            <div key={pb.id} className="glass-panel" style={{ padding: '24px', border: isV2 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{pb.name}</h2>
                    <span className="badge badge-indigo">VERSION {pb.version}</span>
                    <span className={`badge ${pb.status === 'active' ? 'badge-emerald' : 'badge-amber'}`}>
                      {pb.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                    {pb.diff_summary || 'Baseline initial compilation from historical activity.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleStressTest(pb.id)}
                    disabled={actionLoading}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <Shield size={14} style={{ color: '#f43f5e' }} /> Adversarial Stress Test
                  </button>

                  {pb.status !== 'active' && (
                    <button 
                      className="btn-primary" 
                      onClick={() => handleApproval(pb.id, 'APPROVE')}
                      disabled={actionLoading}
                      style={{ fontSize: '12px', padding: '6px 14px' }}
                    >
                      <UserCheck size={14} /> Approve for Production
                    </button>
                  )}
                </div>
              </div>

              {/* Reliability Scoreboard Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NORMAL CASES</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                    {Math.round(scores.normal_case_success * 100)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>EDGE CASES</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                    {Math.round(scores.edge_case_success * 100)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ADVERSARIAL STRESS</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: scores.adversarial_success > 0.8 ? '#34d399' : '#fb7185', marginTop: '2px' }}>
                    {Math.round(scores.adversarial_success * 100)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>EVIDENCE COVERAGE</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                    {Math.round(scores.evidence_coverage * 100)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HEALTH STATUS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: scores.overall_health === 'READY' ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                    {scores.overall_health}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
