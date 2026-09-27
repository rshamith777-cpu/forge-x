import React from 'react';

export const InvestigateButton: React.FC<{ targetId: string }> = ({ targetId }) => {
  const handleInvestigate = () => {
    console.log(`Investigating ${targetId}...`);
    // Triggers: Evidence -> Historical -> Contradiction -> Genome -> Red Team -> Candidate -> Governance
  };

  return (
    <button 
      onClick={handleInvestigate}
      style={{
        background: 'var(--accent-primary)',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      INVESTIGATE
    </button>
  );
};
