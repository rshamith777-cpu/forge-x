import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, ArrowRight, X, Key, CheckCircle2, Building } from 'lucide-react';

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (role: 'Operations Lead' | 'VP of Operations' | 'Compliance Officer') => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignInSuccess }) => {
  const [email, setEmail] = useState('alex.mercer@apexcloud.io');
  const [password, setPassword] = useState('••••••••••••');
  const [activeTab, setActiveTab] = useState<'personas' | 'credentials'>('personas');
  const [authenticating, setAuthenticating] = useState(false);

  if (!isOpen) return null;

  const personas = [
    {
      id: 'ops_lead',
      role: 'Operations Lead' as const,
      name: 'Alex Mercer',
      title: 'Lead Incident Commander',
      org: 'ApexCloud Global',
      avatarBg: 'linear-gradient(135deg, #0284c7, #2563eb)',
      description: 'Manages live operational incidents, SLA enforcement, and rapid credit authorizations.',
      badge: 'INCIDENT COMMAND',
      badgeColor: '#38bdf8'
    },
    {
      id: 'vp_ops',
      role: 'VP of Operations' as const,
      name: 'Dr. Elena Rostova',
      title: 'VP of Operations & Resilience',
      org: 'FinTech Prime Corp',
      avatarBg: 'linear-gradient(135deg, #059669, #10b981)',
      description: 'Reviews FORGE LAB benchmarks, red team breaches, and signs off on Candidate Playbook V2.',
      badge: 'POLICY GOVERNANCE',
      badgeColor: '#34d399'
    },
    {
      id: 'compliance',
      role: 'Compliance Officer' as const,
      name: 'Marcus Vance',
      title: 'Chief Compliance & Audit Officer',
      org: 'QuantumSec Defense',
      avatarBg: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      description: 'Inspects immutable decision ledgers, time-machine replays, and regulatory provenance.',
      badge: 'AUDIT & SOC-2',
      badgeColor: '#c084fc'
    }
  ];

  const handleSelectPersona = (role: 'Operations Lead' | 'VP of Operations' | 'Compliance Officer', name: string) => {
    setAuthenticating(true);
    setTimeout(() => {
      localStorage.setItem('forge_session', JSON.stringify({
        role,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@apexcloud.io`,
        signedInAt: new Date().toISOString()
      }));
      setAuthenticating(false);
      onSignInSuccess(role);
    }, 250);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setTimeout(() => {
      localStorage.setItem('forge_session', JSON.stringify({
        role: 'Operations Lead',
        name: 'Alex Mercer',
        email,
        signedInAt: new Date().toISOString()
      }));
      setAuthenticating(false);
      onSignInSuccess('Operations Lead');
    }, 300);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(2, 6, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '20px'
    }}>
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(4, 9, 20, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.2)',
          color: '#ffffff',
          overflow: 'hidden',
          fontFamily: "'Rowdies', sans-serif"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)'
            }}>
              <Lock size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>
                  SIGN IN TO FORGE X
                </h2>
                <span className="badge badge-cyan" style={{ fontSize: '10px' }}>ENTERPRISE IAM</span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Operational decisions, governed by evidence and cryptographic audit.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#94a3b8',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '0 28px', gap: '20px' }}>
          <button
            onClick={() => setActiveTab('personas')}
            style={{
              padding: '14px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'personas' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'personas' ? '#fff' : '#94a3b8',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Rowdies', sans-serif"
            }}
          >
            <UserCheck size={16} color={activeTab === 'personas' ? '#38bdf8' : '#94a3b8'} />
            <span>1-Click Authorized Personas (Demo)</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            style={{
              padding: '14px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'credentials' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'credentials' ? '#fff' : '#94a3b8',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Rowdies', sans-serif"
            }}
          >
            <Key size={16} color={activeTab === 'credentials' ? '#38bdf8' : '#94a3b8'} />
            <span>Enterprise SSO / Password</span>
          </button>
        </div>

        {/* Body Area */}
        <div style={{ padding: '24px 28px 30px 28px' }}>
          {activeTab === 'personas' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                Select an operations persona to instantly load their role permissions, active incidents, and approval workflows:
              </div>

              {personas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => !authenticating && handleSelectPersona(p.role, p.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: authenticating ? 'wait' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: p.avatarBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '16px',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{p.name}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: `${p.badgeColor}22`,
                          color: p.badgeColor,
                          border: `1px solid ${p.badgeColor}44`,
                          fontWeight: 700
                        }}>
                          {p.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        {p.title} • <span style={{ color: '#cbd5e1' }}>{p.org}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        {p.description}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    <span>Sign In</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Enterprise Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: "'Rowdies', sans-serif"
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Password / IAM Security Token
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: "'Rowdies', sans-serif"
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '11.5px',
                color: '#6ee7b7'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#34d399" /> Single Sign-On (Okta / Azure AD / Ping) Active
                </span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>MOSS-SAML-2.0</span>
              </div>

              <button
                type="submit"
                disabled={authenticating}
                style={{
                  marginTop: '8px',
                  padding: '14px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: authenticating ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)'
                }}
              >
                {authenticating ? 'Authenticating with IAM...' : 'Sign In with SSO Credentials'}
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Footer Security Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '11px',
            color: '#64748b'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle2 size={13} color="#34d399" /> SOC-2 Type II Certified
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={13} color="#38bdf8" /> 256-Bit Cryptographic Ledger
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Building size={13} color="#a855f7" /> Zero Data Leakage Isolation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
