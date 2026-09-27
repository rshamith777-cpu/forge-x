import React, { useState, useEffect } from 'react';
import { AppShell, ORGANIZATIONS, type OrganizationProfile } from './components/layout/AppShell';
import { CinematicLandingView } from './components/views/CinematicLandingView';
import { HomeWorkspaceView } from './components/views/HomeWorkspaceView';
import { OperationsOverviewView } from './components/views/OperationsOverviewView';
import { IncidentsView } from './components/views/IncidentsView';
import { PoliciesView } from './components/views/PoliciesView';
import { AuditCenterView } from './components/views/AuditCenterView';
import { ScenarioPlanningView } from './components/views/ScenarioPlanningView';
import { RiskStressTestingView } from './components/views/RiskStressTestingView';
import { SystemView } from './components/views/SystemView';
import { ActiveDecisionView } from './components/views/ActiveDecisionView';
import { CandidateV2View } from './components/views/CandidateV2View';
import { OrganizationalMemoryView } from './components/views/OrganizationalMemoryView';
import { RedTeamView } from './components/RedTeamView';
import { ForgeLabView } from './components/ForgeLabView';
import { AutopilotOverlay } from './components/AutopilotOverlay';
import { RoleBasedLogin } from './components/RoleBasedLogin';
import { TeamWorkforceView } from './components/views/TeamWorkforceView';
import { AgentSwarmAutomationView } from './components/views/AgentSwarmAutomationView';
import { AITeammate } from './components/AITeammate';
import { OrgDataProvider } from './context/OrgDataContext';
import { DataIngestionView } from './components/views/DataIngestionView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { ObserveWorkflowView } from './components/views/ObserveWorkflowView';

function parseRoute(pathname: string): { isLanding: boolean; module: string; incidentId: string | null; showLogin: boolean } {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/login' || clean === '/signin') {
    return { isLanding: false, module: 'login', incidentId: null, showLogin: true };
  }
  if (clean === '/landing' || clean === '' || clean === '/') {
    return { isLanding: true, module: 'home', incidentId: null, showLogin: false };
  }
  if (clean === '/app/ingestion' || clean === '/app/data') {
    return { isLanding: false, module: 'ingestion', incidentId: null, showLogin: false };
  }
  if (clean === '/app/observe' || clean === '/app/archaeology' || clean === '/app/workflow') {
    return { isLanding: false, module: 'observe', incidentId: null, showLogin: false };
  }
  if (clean === '/app/twin' || clean === '/app/digital-twin' || clean === '/app/graph') {
    return { isLanding: false, module: 'twin', incidentId: null, showLogin: false };
  }
  if (clean === '/app/team' || clean === '/app/workforce') {
    return { isLanding: false, module: 'team', incidentId: null, showLogin: false };
  }
  if (clean === '/app/decide') {
    return { isLanding: false, module: 'decide', incidentId: null, showLogin: false };
  }
  if (clean === '/app/redteam') {
    return { isLanding: false, module: 'redteam', incidentId: null, showLogin: false };
  }
  if (clean === '/app/agents' || clean === '/app/swarm') {
    return { isLanding: false, module: 'agents', incidentId: null, showLogin: false };
  }
  if (clean === '/app/candidate') {
    return { isLanding: false, module: 'candidate', incidentId: null, showLogin: false };
  }
  if (clean === '/app/governance') {
    return { isLanding: false, module: 'governance', incidentId: null, showLogin: false };
  }
  if (clean === '/app/forgelab') {
    return { isLanding: false, module: 'forgelab', incidentId: null, showLogin: false };
  }
  if (clean === '/app/memory') {
    return { isLanding: false, module: 'memory', incidentId: null, showLogin: false };
  }
  if (clean.startsWith('/app/incidents/')) {
    const id = clean.replace('/app/incidents/', '');
    return { isLanding: false, module: 'incidents', incidentId: id || null, showLogin: false };
  }
  if (clean === '/app/incidents') {
    return { isLanding: false, module: 'incidents', incidentId: null, showLogin: false };
  }
  if (clean === '/app/operations') {
    return { isLanding: false, module: 'operations', incidentId: null, showLogin: false };
  }
  if (clean === '/app/policies') {
    return { isLanding: false, module: 'policies', incidentId: null, showLogin: false };
  }
  if (clean === '/app/audit') {
    return { isLanding: false, module: 'audit', incidentId: null, showLogin: false };
  }
  if (clean === '/app/scenarios') {
    return { isLanding: false, module: 'scenarios', incidentId: null, showLogin: false };
  }
  if (clean === '/app/risk') {
    return { isLanding: false, module: 'risk', incidentId: null, showLogin: false };
  }
  if (clean === '/app/system') {
    return { isLanding: false, module: 'system', incidentId: null, showLogin: false };
  }
  if (clean === '/app' || clean === '/app/home') {
    return { isLanding: false, module: 'home', incidentId: null, showLogin: false };
  }
  return { isLanding: false, module: 'home', incidentId: null, showLogin: false };
}

export function App() {
  const initialRoute = parseRoute(window.location.pathname);

  // Mode: Public Landing Page vs Authenticated Operations Platform
  const [isPublicLanding, setIsPublicLanding] = useState<boolean>(initialRoute.isLanding);
  const [showSignInModal, setShowSignInModal] = useState<boolean>(initialRoute.showLogin);

  // Active Navigation Module in AppShell
  const [activeModule, setActiveModule] = useState<string>(initialRoute.module);

  // Active Role Switcher / JWT Auth with guaranteed fallback
  const [jwt, setJwt] = useState<string | null>(() => {
    try {
      return localStorage.getItem('forge_jwt') || 'demo_authorized_token';
    } catch (e) {
      return 'demo_authorized_token';
    }
  });
  const [currentRole, setCurrentRole] = useState<string>(() => {
    try {
      return localStorage.getItem('forge_role') || 'Operations Lead';
    } catch (e) {
      return 'Operations Lead';
    }
  });

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('forge_jwt');
    localStorage.removeItem('forge_role');
    setJwt(null);
    navigateTo('/login');
  };

  // Active Organization Profile Context Switcher
  const [currentOrg, setCurrentOrg] = useState<OrganizationProfile>(ORGANIZATIONS[0]);

  // Sub-navigation & Deep Link parameters
  const [incidentFilter, setIncidentFilter] = useState<'all' | 'open' | 'awaiting' | 'resolved'>('all');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(initialRoute.incidentId);
  const [openNewIncidentModal, setOpenNewIncidentModal] = useState<boolean>(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [scenarioPrefill, setScenarioPrefill] = useState<string | undefined>(undefined);
  const [auditSubTab, setAuditSubTab] = useState<'ledger' | 'compliance' | 'time_machine' | 'evidence' | 'systems_map'>('ledger');
  const [systemTab, setSystemTab] = useState<'health' | 'lab' | 'diagnostics'>('health');

  // PushState Navigation helper
  const navigateTo = (path: string, options?: { incidentId?: string | null }) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    const parsed = parseRoute(path);
    setIsPublicLanding(parsed.isLanding);
    setShowSignInModal(parsed.showLogin);
    setActiveModule(parsed.module);
    if (options && options.incidentId !== undefined) {
      setSelectedIncidentId(options.incidentId);
    } else {
      setSelectedIncidentId(parsed.incidentId);
    }
  };

  // Browser Back / Forward listener
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRoute(window.location.pathname);
      setIsPublicLanding(parsed.isLanding);
      setShowSignInModal(parsed.showLogin);
      setActiveModule(parsed.module);
      setSelectedIncidentId(parsed.incidentId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handler to navigate between modules with specific targets
  const handleNavigateToIncidents = (filter: string = 'all', incidentId: string | null = null) => {
    setIncidentFilter(filter as any);
    const path = incidentId ? `/app/incidents/${incidentId}` : '/app/incidents';
    navigateTo(path, { incidentId });
  };

  const handleNavigateToPolicy = (policyId?: string) => {
    if (policyId) setSelectedPolicyId(policyId);
    navigateTo('/app/policies');
  };

  const handleNavigateToScenario = (scenarioName?: string) => {
    if (scenarioName) setScenarioPrefill(scenarioName);
    navigateTo('/app/scenarios');
  };

  const handleNavigateToAudit = (subTab: string = 'records') => {
    setAuditSubTab(subTab as any);
    navigateTo('/app/audit');
  };

  // JWT Role-Based Auth Guard for Inside Pages
  if (!isPublicLanding && !jwt) {
    return <RoleBasedLogin onLogin={(token, role, teamCode, memberName) => {
      setJwt(token);
      setCurrentRole(role);
      setIsPublicLanding(false);
      navigateTo('/app/home');
    }} />;
  }

  if (isPublicLanding) {
    return (
      <CinematicLandingView
        onEnterOperations={() => {
          setIsPublicLanding(false);
          navigateTo('/app');
        }}
        initialShowLogin={showSignInModal}
        onSignIn={(role) => {
          if (role) setCurrentRole(role);
          setIsPublicLanding(false);
          navigateTo('/app');
        }}
      />
    );
  }

  // Authenticated Daily Operations Application
  return (
    <OrgDataProvider currentOrg={currentOrg} onSelectOrg={setCurrentOrg}>
      <AppShell
        activeModule={activeModule}
        onSelectModule={(mod) => {
          if (mod === 'home') navigateTo('/app');
          else if (mod === 'ingestion' || mod === 'data') navigateTo('/app/ingestion');
          else if (mod === 'observe' || mod === 'archaeology') navigateTo('/app/observe');
          else if (mod === 'twin' || mod === 'digital-twin') navigateTo('/app/twin');
          else if (mod === 'team' || mod === 'workforce') navigateTo('/app/team');
          else if (mod === 'decide') navigateTo('/app/decide');
          else if (mod === 'redteam') navigateTo('/app/redteam');
          else if (mod === 'candidate') navigateTo('/app/candidate');
          else if (mod === 'governance') navigateTo('/app/governance');
          else if (mod === 'forgelab') navigateTo('/app/forgelab');
          else if (mod === 'memory') navigateTo('/app/memory');
          else if (mod === 'operations') navigateTo('/app/operations');
          else if (mod === 'incidents') navigateTo('/app/incidents', { incidentId: null });
          else if (mod === 'policies') navigateTo('/app/policies');
          else if (mod === 'audit') navigateTo('/app/audit');
          else if (mod === 'scenarios') navigateTo('/app/scenarios');
          else if (mod === 'risk') navigateTo('/app/risk');
          else if (mod === 'system') navigateTo('/app/system');
          else navigateTo(`/app/${mod}`);
        }}
        onOpenLanding={() => {
          setIsPublicLanding(true);
          navigateTo('/landing');
        }}
        currentRole={currentRole}
        onSelectRole={(role) => setCurrentRole(role)}
        currentOrg={currentOrg}
        onSelectOrg={(org) => setCurrentOrg(org)}
      >
        {/* 0. DATA INGESTION: Staging & Synthetic Generation */}
        {activeModule === 'ingestion' && (
          <DataIngestionView
            currentOrg={currentOrg}
            onSelectOrg={setCurrentOrg}
            onNavigateToTwin={() => navigateTo('/app/twin')}
            onNavigateToObserve={() => navigateTo('/app/observe')}
            onNavigateToDecide={() => navigateTo('/app/decide')}
          />
        )}

        {/* 0.5. OBSERVE & WORKFLOW DISCOVERY: Documented vs Discovered */}
        {activeModule === 'observe' && (
          <ObserveWorkflowView
            currentOrg={currentOrg}
            onNavigateToDecide={() => navigateTo('/app/decide')}
            onNavigateToTwin={() => navigateTo('/app/twin')}
            onNavigateToIngestion={() => navigateTo('/app/ingestion')}
          />
        )}

        {/* 0.8. ORGANIZATIONAL DIGITAL TWIN: Causal & Provenance Graph */}
        {activeModule === 'twin' && (
          <DigitalTwinView
            onNavigateToIngestion={() => navigateTo('/app/ingestion')}
            onNavigateToDecide={() => navigateTo('/app/decide')}
            onNavigateToObserve={() => navigateTo('/app/observe')}
            onNavigateToScenarios={() => navigateTo('/app/scenarios')}
          />
        )}

        {/* 1. HOME: Daily Operational Workspace */}
        {activeModule === 'home' && (
        <HomeWorkspaceView
          currentRole={currentRole}
          currentOrg={currentOrg}
          onNavigate={(mod: string, param?: any) => {
            if (mod === 'incidents') {
              if (param?.openNew) {
                setOpenNewIncidentModal(true);
                handleNavigateToIncidents('open');
              } else if (param?.filter) {
                handleNavigateToIncidents(param.filter, param.incidentId || null);
              } else {
                handleNavigateToIncidents('all', param?.incidentId || null);
              }
            } else if (mod === 'policies') {
              handleNavigateToPolicy(param?.policyId);
            } else if (mod === 'scenarios') {
              handleNavigateToScenario(param?.scenarioName);
            } else if (mod === 'audit') {
              handleNavigateToAudit(param?.subTab || 'records');
            } else {
              navigateTo(`/app/${mod}`);
            }
          }}
        />
      )}

      {/* 2. ACTIVE DECISION: Synchronous Low-Latency Hot Path */}
      {activeModule === 'decide' && (
        <ActiveDecisionView
          currentOrg={currentOrg}
          onNavigateToRedTeam={() => navigateTo('/app/redteam')}
          onNavigateToTrace={(traceId) => navigateTo(`/app/decide`)}
          onNavigateToIngestion={() => navigateTo('/app/ingestion')}
        />
      )}

      {/* 3. RED TEAM: We Broke Our Own AI */}
      {activeModule === 'redteam' && (
        <RedTeamView
          onNavigate={(tab) => {
            if (tab === 'forgelab' || tab === 'lab') navigateTo('/app/forgelab');
            else if (tab === 'governance') navigateTo('/app/governance');
            else if (tab === 'candidate') navigateTo('/app/candidate');
            else if (tab === 'agents') navigateTo('/app/agents');
            else navigateTo('/app/decide');
          }}
        />
      )}

      {/* 3.5. AUTONOMOUS AGENT SWARM & AUTOMATION CENTER */}
      {activeModule === 'agents' && (
        <AgentSwarmAutomationView navigateTo={navigateTo} />
      )}

      {/* 4. CANDIDATE PLAYBOOK V2 & FAILURE ANALYSIS */}
      {activeModule === 'candidate' && (
        <CandidateV2View
          initialMode="candidate"
          currentOrg={currentOrg}
          onNavigateToLab={() => navigateTo('/app/forgelab')}
          onNavigateToMemory={() => navigateTo('/app/memory')}
        />
      )}

      {/* 4.1. HUMAN GOVERNANCE: Executive Authorization Cockpit */}
      {activeModule === 'governance' && (
        <CandidateV2View
          initialMode="governance"
          currentOrg={currentOrg}
          onNavigateToLab={() => navigateTo('/app/forgelab')}
          onNavigateToMemory={() => navigateTo('/app/memory')}
        />
      )}

      {/* 5. FORGE LAB: Empirical Benchmark Cockpit & V1 vs V2 Regression */}
      {activeModule === 'forgelab' && (
        <ForgeLabView
          onNavigate={(tab) => {
            if (tab === 'governance') navigateTo('/app/governance');
            else if (tab === 'candidate') navigateTo('/app/candidate');
            else if (tab === 'red-team') navigateTo('/app/redteam');
            else if (tab === 'memory') navigateTo('/app/memory');
            else if (tab === 'ingestion') navigateTo('/app/ingestion');
            else navigateTo('/app/decide');
          }}
          onNavigateToIngestion={() => navigateTo('/app/ingestion')}
        />
      )}

      {/* 6. ORGANIZATIONAL MEMORY: Trusted Repository */}
      {activeModule === 'memory' && (
        <OrganizationalMemoryView
          onNavigateToDecide={() => navigateTo('/app/decide')}
          onNavigateToCandidate={() => navigateTo('/app/candidate')}
        />
      )}

      {/* 7. OPERATIONS: Workload & Throughput */}
      {activeModule === 'operations' && (
        <OperationsOverviewView
          onNavigateToIncidents={(filter) => handleNavigateToIncidents(filter || 'all')}
          onNavigateToPolicies={() => handleNavigateToPolicy()}
          onNavigateToAudit={() => handleNavigateToAudit('records')}
        />
      )}

      {/* 8. INCIDENTS: End-to-end Resolution & Vouchers */}
      {activeModule === 'incidents' && (
        <IncidentsView
          currentOrg={currentOrg}
          initialFilter={incidentFilter}
          initialIncidentId={selectedIncidentId || undefined}
          initialOpenNew={openNewIncidentModal}
        />
      )}

      {/* 9. POLICIES: Active Rules, Authority Matrix & Changes */}
      {activeModule === 'policies' && (
        <PoliciesView
          currentOrg={currentOrg}
          initialPolicyId={selectedPolicyId}
          onNavigateToScenario={() => handleNavigateToScenario('Policy Amendment Simulation')}
        />
      )}

      {/* 10. AUDIT: Decision Records, Conformance & Historical Audit */}
      {activeModule === 'audit' && (
        <AuditCenterView
          currentOrg={currentOrg}
          initialSubTab={auditSubTab as any}
          onNavigateToPolicy={() => handleNavigateToPolicy()}
        />
      )}

      {/* 11. SCENARIOS: Monte Carlo What-If Simulation */}
      {activeModule === 'scenarios' && (
        <ScenarioPlanningView
          prefillScenarioName={scenarioPrefill}
          onApplyToPolicy={(policyId: string, rule: string) => {
            setSelectedPolicyId(policyId);
            handleNavigateToPolicy(policyId);
          }}
          onNavigateToIngestion={() => navigateTo('/app/ingestion')}
        />
      )}

      {/* 12. RISK: Stress Testing & Exploits */}
      {activeModule === 'risk' && (
        <RiskStressTestingView
          onNavigateToScenario={(test) => handleNavigateToScenario(`Stress Test: ${test}`)}
          onNavigateToPolicy={(id) => handleNavigateToPolicy(id)}
        />
      )}

      {/* 13. SYSTEM: Health, Verification Lab & Diagnostics */}
      {activeModule === 'system' && (
        <SystemView
          initialTab={systemTab}
        />
      )}

      {/* 14. TEAM & WORKFORCE: Shift Control, Real-Time Activity & Timesheet Approvals */}
      {activeModule === 'team' && (
        <TeamWorkforceView />
      )}

      <AutopilotOverlay navigateTo={navigateTo} />
      
      {/* OMNIPRESENT ADAPTIVE AI TEAMMATE */}
      <AITeammate
        activeModule={activeModule}
        currentRole={currentRole}
        currentTeamCode={localStorage.getItem('forge_team_code') || 'FORGE-ALPHA'}
        currentMemberName={localStorage.getItem('forge_member_name') || 'Ananya R.'}
        navigateTo={navigateTo}
      />
    </AppShell>
    </OrgDataProvider>
  );
}

export default App;
