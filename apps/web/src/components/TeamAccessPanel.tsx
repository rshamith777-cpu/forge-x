import React, { useState } from 'react';

// Generates a random 6-character alphanumeric code
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export const TeamAccessPanel: React.FC = () => {
  const [teamCode, setTeamCode] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [members, setMembers] = useState<string[]>(['You (Creator)']);
  const [inputCode, setInputCode] = useState('');
  
  const handleCreateTeam = () => {
    setTeamCode(generateCode());
    setIsCreator(true);
    setMembers(['You (Creator)']);
  };

  const handleJoinTeam = () => {
    if (inputCode.length === 6) {
      setTeamCode(inputCode.toUpperCase());
      setIsCreator(false);
      setMembers(['Creator', 'You']);
    } else {
      alert('Code must be exactly 6 alphanumeric characters');
    }
  };

  const handleTerminate = () => {
    if (isCreator) {
      setTeamCode(null);
      setIsCreator(false);
      setMembers([]);
    }
  };

  const handleAddMember = () => {
    if (isCreator) {
      setMembers([...members, `Member ${members.length + 1}`]);
    }
  };

  return (
    <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-emerald)', marginBottom: '16px' }}>Team Access Control</h3>
      
      {!teamCode ? (
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <div>
            <button onClick={handleCreateTeam} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Create New Team
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              maxLength={6}
              placeholder="6-Digit Code" 
              value={inputCode} 
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
            />
            <button onClick={handleJoinTeam} style={{ background: 'var(--border-subtle)', color: '#fff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Join Team
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Team Code: </span>
            <strong style={{ fontSize: '1.2em', color: 'var(--accent-emerald)', letterSpacing: '2px' }}>{teamCode}</strong>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>Members ({members.length})</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {members.map((m, idx) => (
                <li key={idx} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{m}</li>
              ))}
            </ul>
          </div>

          {isCreator && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleAddMember} style={{ background: 'var(--border-subtle)', color: '#fff', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                Add Member
              </button>
              <button onClick={handleTerminate} style={{ background: 'var(--accent-rose)', color: '#fff', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                Terminate Team
              </button>
            </div>
          )}
          {!isCreator && (
            <div style={{ color: 'var(--accent-amber)', fontSize: '14px' }}>
              Only the team creator can manage members or terminate the team.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
