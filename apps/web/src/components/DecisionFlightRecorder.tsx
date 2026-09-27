import React from 'react';

export const DecisionFlightRecorder: React.FC<{ decisionId: string }> = ({ decisionId }) => {
  const steps = [
    { label: 'Event Received', status: 'done', latency: '0ms' },
    { label: 'Moss Retrieval', status: 'done', latency: '2.1ms' },
    { label: 'Policy Match', status: 'done', latency: '1.4ms' },
    { label: 'Precedent Match', status: 'done', latency: '1.8ms' },
    { label: 'Contradiction Check', status: 'done', latency: '0.9ms' },
    { label: 'Decision Generated', status: 'done', latency: '1.2ms' },
    { label: 'Reliability Evaluated', status: 'done', latency: '3.1ms' },
    { label: 'Async Red Team', status: 'pending', latency: '-' },
    { label: 'Simulation', status: 'pending', latency: '-' },
  ];

  return (
    <div className="flight-recorder" style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px', color: 'var(--accent-cyan)' }}>Decision Flight Recorder</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: step.status === 'pending' ? 0.5 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: step.status === 'done' ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{step.label}</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{step.latency}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
