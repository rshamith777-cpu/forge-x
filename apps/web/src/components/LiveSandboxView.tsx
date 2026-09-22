import React, { useState } from 'react';
import { PlayCircle, ShieldCheck, Zap, ArrowRight, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { executeLiveCase } from '../lib/api';

export const LiveSandboxView: React.FC = () => {
  const [tier, setTier] = useState<string>('enterprise');
  const [amount, setAmount] = useState<number>(850);
  const [outageHours, setOutageHours] = useState<number>(3.5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExecute = async () => {
    setLoading(true);
    try {
      const res = await executeLiveCase({
        customer_tier: tier,
        claimed_amount: amount,
        outage_disruption_hours: outageHours,
        incident_active: true,
        account_mrr: 48000,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span className="badge badge-emerald">SAFE EXECUTION SANDBOX</span>
        <span className="badge badge-amber">LOCAL RETRIEVAL FABRIC (MOSS CLOUD UNCONFIGURED)</span>
      </div>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
        Live Incident Execution Sandbox
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Dispatch a simulated live ticket. The local retrieval fabric resolves the required policy and precedent context in under 1ms in this environment. Moss Cloud is transparently displayed as unconfigured for this run.
      </p>

      {/* Case Input Form */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          Simulated Incoming Ticket Parameters
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>CUSTOMER TIER</label>
            <select 
              value={tier} 
              onChange={(e) => setTier(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', marginTop: '6px' }}
            >
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
              <option value="strategic_partner">Strategic Partner</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>CLAIMED AMOUNT ($)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', marginTop: '6px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>DISRUPTION DURATION (HOURS)</label>
            <input 
              type="number" 
              value={outageHours} 
              onChange={(e) => setOutageHours(Number(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', marginTop: '6px' }}
            />
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleExecute} 
          disabled={loading}
          style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <PlayCircle size={16} />}
          {loading ? 'Resolving Context via Retrieval Fabric & Executing...' : 'Execute Governed Playbook in Sandbox'}
        </button>
      </div>

      {/* Execution Trace Result */}
      {result && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={22} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Execution Succeeded</h3>
            </div>
            <span className="badge badge-amber font-mono">
              LOCAL RETRIEVAL: {result.moss_retrieval_latency_ms} ms (MOSS CLOUD OFFLINE)
            </span>
          </div>

          <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: '#fbbf24' }}>
            The local retrieval fabric resolves the required policy and precedent context in {result.moss_retrieval_latency_ms} ms in this environment. Moss Cloud is not configured for this run.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTION EXECUTED</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                {result.action_taken}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MATCHED PLAYBOOK</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {result.matched_playbook} ({result.playbook_version})
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL LATENCY</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
                {result.total_execution_latency_ms} ms
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CONFIDENCE</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                {Math.round(result.trace.confidence * 100)}%
              </div>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong>Retrieved Policies:</strong> {result.retrieved_policies?.join(', ')} • <strong>Audit Trace ID:</strong> {result.trace.id}
          </div>
        </div>
      )}
    </div>
  );
};
