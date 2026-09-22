import React, { useState } from 'react';
import { GraduationCap, Award, HelpCircle, ArrowRight, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { evaluateApprenticeship } from '../lib/api';

export const ApprenticeshipView: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string>('direct_executive_credit_bypass');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const scenario = "Enterprise customer (ARR: $75,000) demanding an immediate $750 credit after a 3.5h production shard outage. Documented policy POL-OPS-012 requires 48h Jira manager queue for refunds > $500.";

  const options = [
    { id: 'direct_executive_credit_bypass', label: 'Issue $750 Direct Credit & Notify Account Lead', desc: 'Fast-track bypass under informal Staff authority' },
    { id: 'queue_for_manager_review_48h', label: 'Route to Manager Review Queue (48h SLA)', desc: 'Strictly follow documented SOP handbook' },
    { id: 'reject_claim', label: 'Reject Claim Under Force Majeure', desc: 'Refuse reimbursement' },
  ];

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const res = await evaluateApprenticeship(selectedAction, scenario);
      setEvaluation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span className="badge badge-indigo">AI APPRENTICESHIP MODE</span>
        <span className="badge badge-cyan">TACIT REASONING TRAINER</span>
      </div>
      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
        Learn How the Organization Actually Thinks
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Test your operational decisions against compiled Decision Genomes and learn the hidden trade-offs behind enterprise actions.
      </p>

      {/* Scenario Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
          SCENARIO SIMULATION
        </div>
        <p style={{ fontSize: '16px', color: '#fff', fontWeight: 500, lineHeight: '1.6' }}>
          "{scenario}"
        </p>
      </div>

      {/* Decision Options */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          What decision would you make?
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelectedAction(opt.id)}
              style={{
                background: selectedAction === opt.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedAction === opt.id ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: selectedAction === opt.id ? '#818cf8' : '#fff' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {opt.desc}
                </div>
              </div>

              <input 
                type="radio" 
                checked={selectedAction === opt.id} 
                onChange={() => setSelectedAction(opt.id)} 
                style={{ accentColor: '#6366f1' }}
              />
            </div>
          ))}
        </div>

        <button 
          className="btn-primary" 
          onClick={handleEvaluate} 
          disabled={loading}
          style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
        >
          Evaluate My Operational Reasoning <ArrowRight size={15} />
        </button>
      </div>

      {/* Feedback & Reasoning Explanation Card */}
      {evaluation && (
        <div className="glass-panel" style={{ padding: '24px', border: evaluation.did_align ? '1px solid #10b981' : '1px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            {evaluation.did_align ? (
              <CheckCircle2 size={24} style={{ color: '#10b981' }} />
            ) : (
              <Lightbulb size={24} style={{ color: '#f59e0b' }} />
            )}
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: evaluation.did_align ? '#34d399' : '#fbbf24' }}>
              {evaluation.did_align ? 'Aligned with Expert Organizational Judgment' : 'Understanding Tacit Institutional Trade-offs'}
            </h3>
          </div>

          <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.6', marginBottom: '16px' }}>
            {evaluation.tacit_reasoning_explanation}
          </p>

          {evaluation.overlooked_signals?.length > 0 && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
                CRITICAL SIGNALS INVOLVED:
              </div>
              {evaluation.overlooked_signals.map((sig: string, i: number) => (
                <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  • {sig}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
