import React, { useState, useEffect } from 'react';
import { 
  Home, Activity, ShieldCheck, FileText, Layers, GitFork, 
  AlertTriangle, Settings, HelpCircle, Search, Bell, ChevronDown, 
  User, CheckCircle2, ArrowRight, X, ExternalLink, Filter, ShieldAlert,
  Lock, RefreshCw, Cpu, Database, Zap, Flame, GitBranch, FlaskConical, Award,
  Building, Globe, Shield
} from 'lucide-react';

export interface OrganizationProfile {
  id: string;
  name: string;
  domain: string;
  tier: string;
  mrr: number;
  slaHours: number;
  compliance: string;
  activePolicyId: string;
  activePlaybook: string;
  mossNamespace: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  avatarBg: string;
  defaultSituation: string;
  defaultClaim: number;
  accentColor: string;
}

export const ORGANIZATIONS: OrganizationProfile[] = [
  {
    id: 'org-apexcloud',
    name: 'ApexCloud Global',
    domain: 'Enterprise Cloud Infrastructure',
    tier: 'Enterprise ($45k MRR)',
    mrr: 45000,
    slaHours: 2.0,
    compliance: 'SOC2 Type II + ISO 27001',
    activePolicyId: 'POL-OPS-012',
    activePlaybook: 'Enterprise Billing & SLA Disruption Playbook v2',
    mossNamespace: 'org-apexcloud-production',
    riskLevel: 'Medium',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #2563eb)',
    accentColor: '#38bdf8',
    defaultSituation: 'Enterprise tier client experiencing API Gateway disruption with credit claim of $750',
    defaultClaim: 750
  },
  {
    id: 'org-fintech-prime',
    name: 'FinTech Prime',
    domain: 'High-Frequency Payments & Clearing',
    tier: 'Banking Tier ($120k MRR)',
    mrr: 120000,
    slaHours: 1.0,
    compliance: 'PCI-DSS Level 1 + SOX',
    activePolicyId: 'POL-FIN-102',
    activePlaybook: 'Capital Clearing & Wire Exception Playbook v1.8',
    mossNamespace: 'org-fintech-prime-core',
    riskLevel: 'High',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    accentColor: '#fbbf24',
    defaultSituation: 'Banking tier payment rail latency breach requiring expedited $4,950 settlement voucher',
    defaultClaim: 4950
  },
  {
    id: 'org-healthsync',
    name: 'HealthSync Bio',
    domain: 'Healthcare EHR Cloud Platform',
    tier: 'Critical Care ($85k MRR)',
    mrr: 85000,
    slaHours: 0.5,
    compliance: 'HIPAA + HITECH + FDA 21 CFR',
    activePolicyId: 'POL-HLTH-004',
    activePlaybook: 'Emergency Telemetry & Patient Data Integrity Playbook',
    mossNamespace: 'org-healthsync-hipaa',
    riskLevel: 'Critical',
    avatarBg: 'linear-gradient(135deg, #10b981, #059669)',
    accentColor: '#34d399',
    defaultSituation: 'Hospital network experiencing telemetry webhook queue degradation demanding $2,500 priority re-route',
    defaultClaim: 2500
  },
  {
    id: 'org-omniretail',
    name: 'OmniRetail Logistics',
    domain: 'Global E-Commerce & Supply Chain',
    tier: 'Volume Enterprise ($30k MRR)',
    mrr: 30000,
    slaHours: 4.0,
    compliance: 'GDPR + CCPA',
    activePolicyId: 'POL-RET-088',
    activePlaybook: 'High-Velocity Flash Sale Recovery Playbook',
    mossNamespace: 'org-omniretail-edge',
    riskLevel: 'Low',
    avatarBg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    accentColor: '#a78bfa',
    defaultSituation: 'High-volume merchant requesting $1,200 checkout timeout reimbursement during flash surge',
    defaultClaim: 1200
  },
  {
    id: 'org-quantumsec',
    name: 'QuantumSec Defense',
    domain: 'GovCloud & Defense AI Infrastructure',
    tier: 'Mission Critical ($250k MRR)',
    mrr: 250000,
    slaHours: 0.25,
    compliance: 'FedRAMP High + ITAR + DoD IL5',
    activePolicyId: 'POL-DEF-900',
    activePlaybook: 'Air-Gapped Sovereign Decision Genome v3.0',
    mossNamespace: 'org-quantumsec-govcloud',
    riskLevel: 'Critical',
    avatarBg: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    accentColor: '#f87171',
    defaultSituation: 'GovCloud enclave air-gap sync failure requiring emergency manual bypass authorization',
    defaultClaim: 8500
  }
];

export interface AppShellProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  onOpenLanding: () => void;
  currentRole: string;
  onSelectRole: (role: string) => void;
  currentOrg?: OrganizationProfile;
  onSelectOrg?: (org: OrganizationProfile) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeModule,
  onSelectModule,
  onOpenLanding,
  currentRole,
  onSelectRole,
  currentOrg = ORGANIZATIONS[0],
  onSelectOrg = () => {},
  children
}) => {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleProfiles: Record<string, { name: string; title: string; initials: string; bg: string }> = {
    'Operations': { name: 'Ananya R.', title: 'Head of Operations', initials: 'AR', bg: 'linear-gradient(135deg, #2563eb, #06b6d4)' },
    'Customer Success': { name: 'Marcus Chen', title: 'Director of Customer Success', initials: 'MC', bg: 'linear-gradient(135deg, #059669, #10b981)' },
    'Finance': { name: 'Sarah Jenkins', title: 'VP of Finance', initials: 'SJ', bg: 'linear-gradient(135deg, #d97706, #f59e0b)' },
    'Risk': { name: 'David Vance', title: 'Chief Risk Officer', initials: 'DV', bg: 'linear-gradient(135deg, #dc2626, #f43f5e)' },
    'Compliance': { name: 'Elena Rostova', title: 'Head of Compliance & Legal', initials: 'ER', bg: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
    'Executive': { name: 'Rachel Torres', title: 'Chief Operating Officer (Executive)', initials: 'RT', bg: 'linear-gradient(135deg, #4f46e5, #06b6d4)' }
  };

  const initialProfile = roleProfiles[currentRole] || roleProfiles['Operations'];
  const [operatorName, setOperatorName] = useState(initialProfile.name);
  const [operatorTitle, setOperatorTitle] = useState(initialProfile.title);
  const [operatorInitials, setOperatorInitials] = useState(initialProfile.initials);
  const [operatorBg, setOperatorBg] = useState(initialProfile.bg);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Sync profile when role changes
  useEffect(() => {
    if (roleProfiles[currentRole]) {
      setOperatorName(roleProfiles[currentRole].name);
      setOperatorTitle(roleProfiles[currentRole].title);
      setOperatorInitials(roleProfiles[currentRole].initials);
      setOperatorBg(roleProfiles[currentRole].bg);
    }
  }, [currentRole]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setRoleDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const roles = [
    'Operations',
    'Customer Success',
    'Finance',
    'Risk',
    'Compliance',
    'Executive'
  ];

  const notifications = [
    {
      id: 1,
      title: 'Approval Required: INC-1042',
      desc: 'Enterprise customer credit claim ($1,250) exceeds Lead limit.',
      time: '4m ago',
      type: 'approval',
      module: 'incidents'
    },
    {
      id: 2,
      title: 'Policy Exception Spike: POL-OPS-012',
      desc: '3 recent customer outage claims flagged with fast-track bypass.',
      time: '18m ago',
      type: 'exception',
      module: 'audit'
    },
    {
      id: 3,
      title: 'SLA At Risk: INC-1038',
      desc: 'Latency degradation response target within 30 minutes.',
      time: '32m ago',
      type: 'sla',
      module: 'incidents'
    }
  ];

  const searchResults = [
    { title: 'INC-1042 — Acme Global ($1,250 credit)', module: 'incidents', type: 'Incident' },
    { title: 'INC-1038 — FinTech Prime ($1,400 claim)', module: 'incidents', type: 'Incident' },
    { title: 'POL-OPS-012 — Refund & Credit Authorization Limits', module: 'policies', type: 'Policy' },
    { title: 'POL-SLA-ENT — Enterprise Disruption Response Standard', module: 'policies', type: 'Policy' },
    { title: 'VCH-2026-X8841 — Certified Settlement Voucher', module: 'audit', type: 'Voucher' },
    { title: 'Scenario: Raise Lead Limit to $1,500', module: 'scenarios', type: 'Scenario' },
    { title: 'Stress Test: Split Claim Exploit Pattern', module: 'risk', type: 'Risk' }
  ].filter(item => searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const navItems = [
    { id: 'home', label: 'Operations Home', icon: Home },
    { id: 'decide', label: 'Active Decision', icon: Zap, badge: 'HOT' },
    { id: 'incidents', label: 'Incidents & SLA', icon: ShieldCheck, badge: '4' },
    { id: 'redteam', label: 'Red Team', icon: Flame, badge: 'HERO' },
    { id: 'candidate', label: 'Candidate V2', icon: GitBranch },
    { id: 'forgelab', label: 'FORGE LAB', icon: FlaskConical },
    { id: 'governance', label: 'Human Governance', icon: Award },
    { id: 'memory', label: 'Org Memory', icon: Database },
    { id: 'scenarios', label: 'Scenarios', icon: GitFork },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'system', label: 'System', icon: Cpu }
  ];

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#02060f',
      color: '#ffffff',
      overflowX: 'hidden',
      fontFamily: "'Rowdies', sans-serif"
    }}>
      {/* 1. Fullscreen Looping Video Background from Homepage */}
      <video
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.40
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
      />

      {/* 2. Atmospheric Gradient Veil from Homepage */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: `
          radial-gradient(110% 70% at 50% 45%, 
            rgba(4, 8, 18, 0.42) 0%, 
            rgba(4, 8, 18, 0.68) 60%, 
            rgba(2, 6, 15, 0.94) 100%),
          linear-gradient(180deg, 
            rgba(2, 6, 15, 0.70) 0%, 
            rgba(2, 6, 15, 0.20) 30%, 
            rgba(2, 6, 15, 0.35) 70%, 
            rgba(2, 6, 15, 0.92) 100%)
        `
      }} />

      {/* 3. Main Shell Flex Layout */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: '100vh' }}>
        {/* LEFT FIXED ENTERPRISE SIDEBAR */}
        <aside style={{
          width: '240px',
          flexShrink: 0,
          background: 'rgba(2, 6, 15, 0.60)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 40
        }}>
          <div>
            {/* Brand Header with Homepage Iconic Emblem */}
            <div 
              onClick={onOpenLanding}
              style={{
                padding: '18px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
              title="Return to Public Hero Landing Page"
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(37, 99, 235, 0.45)',
                flexShrink: 0
              }}>
                <svg style={{ width: '20px', height: '15px', fill: '#ffffff' }} viewBox="0 0 23 17" aria-hidden="true">
                  <path d="M8.15 0.9 L4.55 0.9 L0.5 9.3 L4.1 9.3 Z"/>
                  <path d="M17.0 0 L13.4 0 L6.15 16.4 L9.75 16.4 Z"/>
                  <path d="M22.9 0 L19.3 0 L15.0 7.6 L18.6 7.6 Z"/>
                  <path d="M22.6 6.9 L19.0 6.9 L14.05 16.4 L17.65 16.4 Z"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '12.5px',
                  letterSpacing: '0.08em',
                  color: '#ffffff',
                  textShadow: '0 0 12px rgba(56, 189, 248, 0.4)'
                }}>
                  FORGE <span style={{ color: '#06b6d4' }}>X</span>
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 300, marginTop: '2px' }}>
                  Operations Platform
                </div>
              </div>
            </div>

            {/* Primary Navigation Menu */}
            <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'rgba(6, 182, 212, 0.14)' : 'transparent',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <Icon size={17} color={isActive ? '#38bdf8' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      background: item.id === 'redteam' ? 'rgba(244, 63, 94, 0.25)' : (item.id === 'decide' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(37, 99, 235, 0.3)'),
                      color: item.id === 'redteam' ? '#f43f5e' : (item.id === 'decide' ? '#38bdf8' : '#60a5fa'),
                      padding: '2px 7px',
                      borderRadius: '10px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={onOpenLanding}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: '#94a3b8',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer'
            }}
          >
            <span>Public Hero Page</span>
            <ExternalLink size={12} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10.5px',
            color: '#64748b',
            padding: '4px 6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span>Synthetic Demo Data</span>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* GLOBAL TOP BAR */}
        <header style={{
          height: '62px',
          background: 'rgba(2, 6, 15, 0.60)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Left: Workspace Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Left: Organization / Workspace Switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  fontSize: '13px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.2s ease'
                }}
                title="Switch Target Organization Context"
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '5px',
                  background: currentOrg.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {currentOrg.name.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: currentOrg.accentColor, fontSize: '13px', lineHeight: 1.2 }}>
                    {currentOrg.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: 1.2 }}>
                    {currentOrg.tier}
                  </div>
                </div>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {/* Organization Dropdown Palette */}
              {orgDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  left: 0,
                  width: '340px',
                  background: 'rgba(6, 12, 24, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 20px 48px rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(28px)',
                  zIndex: 100
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
                      SWITCH TARGET ORGANIZATION
                    </span>
                    <span style={{ fontSize: '10px', color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace" }}>
                      5 Registered
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                    {ORGANIZATIONS.map(org => {
                      const isSelected = org.id === currentOrg.id;
                      return (
                        <div
                          key={org.id}
                          onClick={() => {
                            onSelectOrg(org);
                            setOrgDropdownOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            background: isSelected ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              background: org.avatarBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#fff',
                              flexShrink: 0
                            }}>
                              {org.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#38bdf8' : '#ffffff' }}>
                                {org.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                                {org.domain} • ${org.mrr.toLocaleString()} MRR
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 size={16} color="#38bdf8" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '10px', paddingTop: '10px' }}>
                    <button
                      onClick={() => {
                        setOrgModalOpen(true);
                        setOrgDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#38bdf8',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Inspect {currentOrg.name} Governance Dossier</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#64748b',
                fontSize: '12.5px',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                minWidth: '240px'
              }}
            >
              <Search size={14} />
              <span>Search incidents, policies...</span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '10.5px',
                padding: '2px 5px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8'
              }}>
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Right: Notifications, Role Switcher, User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Role Switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: '11px' }}>Role:</span>
                <strong>{currentRole}</strong>
                <ChevronDown size={13} />
              </button>

              {roleDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '180px',
                  background: '#0d1527',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '6px',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
                  zIndex: 50
                }}>
                  <div style={{ fontSize: '11px', color: '#64748b', padding: '6px 10px', fontWeight: 600 }}>
                    VIEW DASHBOARD AS:
                  </div>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        onSelectRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        borderRadius: '4px',
                        border: 'none',
                        background: currentRole === r ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                        color: currentRole === r ? '#38bdf8' : '#cbd5e1',
                        fontSize: '12.5px',
                        cursor: 'pointer'
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={16} />
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  3
                </span>
              </button>

              {/* Notifications Drawer Dropdown */}
              {notificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '320px',
                  background: '#0d1527',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '12px',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.7)',
                  zIndex: 50
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Notifications</span>
                    <span style={{ fontSize: '11px', color: '#38bdf8', cursor: 'pointer' }}>Mark all read</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onSelectModule(n.module);
                          setNotificationsOpen(false);
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>
                          <span>{n.title}</span>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>{n.time}</span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
                          {n.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Info - Clickable to change operator / head of ops profile */}
            <div 
              onClick={() => setProfileModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
              title="Click to edit profile or change Head of Operations"
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: operatorBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#fff'
              }}>
                {operatorInitials}
              </div>
              <div style={{ fontSize: '12.5px', textAlign: 'left' }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>{operatorName}</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>{operatorTitle}</div>
              </div>
              <ChevronDown size={13} color="#64748b" />
            </div>
          </div>
        </header>

        {/* MAIN BODY OUTLET */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'transparent' }}>
          {children}
        </main>
      </div>
    </div>

      {/* GLOBAL SEARCH COMMAND PALETTE (CTRL+K) */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '100px',
          zIndex: 100
        }}
        onClick={() => setSearchOpen(false)}
        >
          <div 
            style={{
              width: '560px',
              background: '#0d1527',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '12px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Search size={18} color="#94a3b8" style={{ marginRight: '12px' }} />
              <input 
                autoFocus
                type="text"
                placeholder="Search incidents, customers, policies, vouchers... (or type 'INC-', 'POL-')"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontFamily: 'var(--font-body)'
                }}
              />
              <button 
                onClick={() => setSearchOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '10px' }}>
              {searchResults.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No records match "{searchQuery}"
                </div>
              ) : (
                searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectModule(item.module);
                      setSearchOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.02)',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  >
                    <span style={{ fontSize: '13.5px', color: '#f1f5f9' }}>{item.title}</span>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#94a3b8'
                    }}>
                      {item.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* OPERATOR PROFILE SETTINGS MODAL */}
      {profileModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          fontFamily: "'Rowdies', sans-serif"
        }}>
          <div style={{
            width: '480px',
            background: '#0d1527',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.7)',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px 0' }}>
                  Operator Profile Settings
                </h3>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0 }}>
                  Customize the active operator name, job title, or switch leadership personas.
                </p>
              </div>
              <button 
                onClick={() => setProfileModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Switch Persona Buttons */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                Quick-Select Leadership Persona:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.entries(roleProfiles).map(([roleKey, prof]) => (
                  <button
                    key={roleKey}
                    onClick={() => {
                      setOperatorName(prof.name);
                      setOperatorTitle(prof.title);
                      setOperatorInitials(prof.initials);
                      setOperatorBg(prof.bg);
                      onSelectRole(roleKey);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: operatorName === prof.name ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: operatorName === prof.name ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      fontSize: '11.5px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: prof.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700
                    }}>
                      {prof.initials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px' }}>{prof.name}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{roleKey}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Display Name:
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => {
                    setOperatorName(e.target.value);
                    const parts = e.target.value.trim().split(' ');
                    const initials = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2) || 'OP';
                    setOperatorInitials(initials);
                  }}
                  placeholder="e.g. Ananya R."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(2, 6, 15, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: "'Rowdies', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Operational Job Title:
                </label>
                <input
                  type="text"
                  value={operatorTitle}
                  onChange={(e) => setOperatorTitle(e.target.value)}
                  placeholder="e.g. Head of Operations"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(2, 6, 15, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: "'Rowdies', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setProfileModalOpen(false)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  fontSize: '13px',
                  fontFamily: "'Rowdies', sans-serif",
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                }}
                style={{
                  padding: '9px 22px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: "'Rowdies', sans-serif",
                  cursor: 'pointer'
                }}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORGANIZATION DOSSIER & POLICIES MODAL */}
      {orgModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}
        onClick={() => setOrgModalOpen(false)}
        >
          <div 
            style={{
              width: '620px',
              maxWidth: '95vw',
              background: 'rgba(8, 14, 26, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '16px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
              padding: '28px',
              backdropFilter: 'blur(28px)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: currentOrg.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)'
                }}>
                  {currentOrg.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {currentOrg.name}
                  </h2>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                    {currentOrg.domain} • Org ID: <code style={{ color: '#38bdf8' }}>{currentOrg.id}</code>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOrgModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>MONTHLY CONTRACT (MRR)</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#34d399', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                  ${currentOrg.mrr.toLocaleString()} / mo
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{currentOrg.tier}</div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>SLA COMMITMENT</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {currentOrg.slaHours} Hours
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Standard Outage Tolerance</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>PRIMARY GOVERNING POLICY</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>
                  {currentOrg.activePolicyId} — Refund & Credit Authorization Rules
                </div>
                <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '2px' }}>
                  Limits automatic direct credits up to $1,500; requires dual VP review above statutory limits.
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>MOSS RETRIEVAL FABRIC NAMESPACE</div>
                <div style={{ fontSize: '12.5px', fontFamily: "'JetBrains Mono', monospace", color: '#a78bfa' }}>
                  {currentOrg.mossNamespace}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Sub-10ms localized vector space with temporal isolation filter (knowledge.created_at &lt;= T).
                </div>
              </div>

              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>COMPLIANCE & AUDIT ASSURANCE</div>
                <div style={{ fontSize: '12.5px', color: '#ffffff' }}>
                  {currentOrg.compliance}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setOrgModalOpen(false)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
