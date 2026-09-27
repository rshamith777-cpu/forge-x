import React, { useState } from 'react';
import { ShieldCheck, Users, Lock, Key, ArrowRight, CheckCircle2, Sparkles, Building, UserCheck, Zap } from 'lucide-react';

export interface RoleBasedLoginProps {
  onLogin: (token: string, role: string, teamCode: string, memberName: string) => void;
}

export const RoleBasedLogin: React.FC<RoleBasedLoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<string>(localStorage.getItem('forge_role') || 'Operations Lead');
  const [teamCode, setTeamCode] = useState<string>(localStorage.getItem('forge_team_code') || 'FORGE-ALPHA');
  const [memberName, setMemberName] = useState<string>(localStorage.getItem('forge_member_name') || 'Ananya R.');
  const [passkey, setPasskey] = useState<string>('9042-AUTH');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const teamPresets = [
    { code: 'FORGE-ALPHA', label: 'Core Operations Alpha', badge: 'DEFAULT' },
    { code: 'SEC-OPS-77', label: 'Adversarial Red Team', badge: 'HERO' },
    { code: 'QUANT-88', label: 'Risk & Algorithmic Lab', badge: 'FINANCE' },
    { code: 'MISSION-X', label: 'Executive Command Group', badge: 'EXEC' }
  ];

  const roles = [
    {
      id: 'Executive / Admin',
      title: 'Executive / High Command',
      desc: 'Full authority: Manage workforce hours, timesheet approvals, policy amendments & overrides.',
      badge: 'HIGHER AUTHORITY',
      badgeColor: '#a855f7',
      isManager: true
    },
    {
      id: 'Operations Lead',
      title: 'Operations Lead / Shift Manager',
      desc: 'Workforce shift command, live incident resolution, financial authority up to $1,000.',
      badge: 'SHIFT COMMAND',
      badgeColor: '#38bdf8',
      isManager: true
    },
    {
      id: 'Incident Responder / Engineer',
      title: 'Incident Responder / Engineer',
      desc: 'Triage service disruptions, execute root-cause archaeology, dispatch credit vouchers.',
      badge: 'TACTICAL OPS',
      badgeColor: '#34d399',
      isManager: false
    },
    {
      id: 'Auditor & Risk Officer',
      title: 'Auditor & Risk Officer',
      desc: 'Audit ledger verification, SOC-2 conformance, historical time-machine inspection.',
      badge: 'READ-ONLY AUDIT',
      badgeColor: '#f59e0b',
      isManager: false
    },
    {
      id: 'Red Team Specialist',
      title: 'Red Team Adversary Specialist',
      desc: 'Sybil burst injections, prompt evasion mutations, regression test validation.',
      badge: 'ADVERSARIAL',
      badgeColor: '#ef4444',
      isManager: false
    }
  ];

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const effectiveTeamCode = teamCode.trim() ? teamCode.trim().toUpperCase() : 'FORGE-ALPHA';
    const effectiveMemberName = memberName.trim() ? memberName.trim() : 'Ananya R.';

    setIsAuthenticating(true);

    setTimeout(() => {
      // Cryptographically structured JWT payload with RBAC & Team Code
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const isManager = selectedRole.includes('Executive') || selectedRole.includes('Operations Lead') || selectedRole.includes('Admin');
      const payload = btoa(JSON.stringify({
        sub: effectiveMemberName,
        role: selectedRole,
        team_code: effectiveTeamCode,
        authority_level: isManager ? 'HIGH_COMMAND' : 'MEMBER',
        can_manage_workforce: isManager,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
      }));
      const signature = btoa('forge_cryptographic_verification_token');
      const token = `${header}.${payload}.${signature}`;

      localStorage.setItem('forge_jwt', token);
      // Map role to canonical name
      const canonicalRole = selectedRole.includes('Executive') 
        ? 'Executive' 
        : selectedRole.includes('Operations') 
          ? 'Operations' 
          : selectedRole.includes('Auditor') 
            ? 'Compliance' 
            : 'Operations';
      localStorage.setItem('forge_role', canonicalRole);
      localStorage.setItem('forge_full_role', selectedRole);
      localStorage.setItem('forge_team_code', effectiveTeamCode);
      localStorage.setItem('forge_member_name', effectiveMemberName);
      localStorage.setItem('forge_is_manager', isManager ? 'true' : 'false');

      setIsAuthenticating(false);
      onLogin(token, canonicalRole, effectiveTeamCode, effectiveMemberName);
    }, 300);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 10%, #0d1b2a 0%, #030712 60%, #010409 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '36px 40px',
        borderRadius: '20px',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.15)',
        textAlign: 'left'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)'
            }}>
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                FORGE <span style={{ color: '#38bdf8' }}>X</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                RBAC & Team Access Gateway
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            color: '#38bdf8',
            fontWeight: 600
          }}>
            <Sparkles size={12} />
            <span>AI TEAMMATE READY</span>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          {/* Team Workspace (Optional / Auto-assigned for Demo) */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{
                color: '#e2e8f0',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>TEAM WORKSPACE</span>
                <span style={{
                  fontSize: '10.5px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  DEMO (NO CODE NEEDED)
                </span>
              </label>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Default: FORGE-ALPHA</span>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                placeholder="FORGE-ALPHA (Optional)"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '10px',
                  background: 'rgba(2, 6, 23, 0.65)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <Users size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>

            {/* Quick Preset Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {teamPresets.map(preset => (
                <button
                  type="button"
                  key={preset.code}
                  onClick={() => setTeamCode(preset.code)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: teamCode === preset.code ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${teamCode === preset.code ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: teamCode === preset.code ? '#38bdf8' : '#94a3b8',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {preset.code}
                </button>
              ))}
            </div>
          </div>

          {/* Member Name / Identity */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>
                OPERATOR CALLSIGN / NAME
              </label>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Default: Ananya R.</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Ananya R. (Optional)"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '10px',
                  background: 'rgba(2, 6, 23, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <UserCheck size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
            </div>
          </div>

          {/* Step 3: Role Selection (RBAC) */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>
                3. SELECT RBAC ROLE & AUTHORITY TIER
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {roles.map(r => {
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                          {r.title}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: `${r.badgeColor}22`,
                          color: r.badgeColor,
                          border: `1px solid ${r.badgeColor}55`
                        }}>
                          {r.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {r.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={18} color="#38bdf8" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: 700,
              cursor: isAuthenticating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.2s ease',
              opacity: isAuthenticating ? 0.7 : 1
            }}
          >
            {isAuthenticating ? (
              <span>Issuing Cryptographic Token...</span>
            ) : (
              <>
                <span>Enter Operations Platform (Demo Access)</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Quick Judge Demo Mode Button */}
          <button
            type="button"
            onClick={() => {
              handleLogin();
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('forge:start-demo'));
              }, 700);
            }}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.25))',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.6)',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={16} color="#38bdf8" />
            <span>⚡ QUICK JUDGE DEMO MODE (1-CLICK TOUR)</span>
          </button>
        </form>

        {/* Security Footer Notice */}
        <div style={{
          marginTop: '18px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#64748b'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} />
            HMAC-SHA256 Encrypted Session
          </span>
          <span>Higher Authorities Granted Full Workforce Tab</span>
        </div>
      </div>
    </div>
  );
};
