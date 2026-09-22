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

function parseRoute(pathname: string): { isLanding: boolean; module: string; incidentId: string | null } {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '' || clean === '/' || clean === '/landing') {
    return { isLanding: true, module: 'home', incidentId: null };
  }
  if (clean === '/app/decide') {
    return { isLanding: false, module: 'decide', incidentId: null };
  }
  if (clean === '/app/redteam') {
    return { isLanding: false, module: 'redteam', incidentId: null };
  }
  if (clean === '/app/candidate' || clean === '/app/governance') {
    return { isLanding: false, module: 'candidate', incidentId: null };
  }
  if (clean === '/app/forgelab') {
    return { isLanding: false, module: 'forgelab', incidentId: null };
  }
  if (clean === '/app/memory') {
    return { isLanding: false, module: 'memory', incidentId: null };
  }
  if (clean.startsWith('/app/incidents/')) {
    const id = clean.replace('/app/incidents/', '');
    return { isLanding: false, module: 'incidents', incidentId: id || null };
  }
  if (clean === '/app/incidents') {
    return { isLanding: false, module: 'incidents', incidentId: null };
  }
  if (clean === '/app/operations') {
    return { isLanding: false, module: 'operations', incidentId: null };
  }
  if (clean === '/app/policies') {
    return { isLanding: false, module: 'policies', incidentId: null };
  }
  if (clean === '/app/audit') {
    return { isLanding: false, module: 'audit', incidentId: null };
  }
  if (clean === '/app/scenarios') {
    return { isLanding: false, module: 'scenarios', incidentId: null };
  }
  if (clean === '/app/risk') {
    return { isLanding: false, module: 'risk', incidentId: null };
  }
  if (clean === '/app/system') {
    return { isLanding: false, module: 'system', incidentId: null };
  }
  if (clean === '/app' || clean === '/app/home') {
    return { isLanding: false, module: 'home', incidentId: null };
  }
  return { isLanding: false, module: 'home', incidentId: null };
}

export function App() {
  const initialRoute = parseRoute(window.location.pathname);

  // Mode: Public Landing Page vs Authenticated Operations Platform
  const [isPublicLanding, setIsPublicLanding] = useState<boolean>(initialRoute.isLanding);

  // Active Navigation Module in AppShell
  const [activeModule, setActiveModule] = useState<string>(initialRoute.module);

  // Active Role Switcher
  const [currentRole, setCurrentRole] = useState<string>('Operations');

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

  // If in Public Cinematic Landing view
  if (isPublicLanding) {
    return (
      <CinematicLandingView
        onEnterOperations={() => {
          navigateTo('/app');
        }}
      />
    );
  }

  // Authenticated Daily Operations Application
  return (
    <AppShell
      activeModule={activeModule}
      onSelectModule={(mod) => {
        if (mod === 'home') navigateTo('/app');
        else if (mod === 'decide') navigateTo('/app/decide');
        else if (mod === 'redteam') navigateTo('/app/redteam');
        else if (mod === 'candidate') navigateTo('/app/candidate');
        else if (mod === 'governance') navigateTo('/app/candidate');
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
      onOpenLanding={() => navigateTo('/')}
      currentRole={currentRole}
      onSelectRole={(role) => setCurrentRole(role)}
      currentOrg={currentOrg}
      onSelectOrg={(org) => setCurrentOrg(org)}
    >
      {/* 1. HOME: Daily Operational Workspace */}
      {activeModule === 'home' && (
        <HomeWorkspaceView
          currentRole={currentRole}
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
        />
      )}

      {/* 3. RED TEAM: We Broke Our Own AI */}
      {activeModule === 'redteam' && (
        <RedTeamView
          onNavigate={(tab) => {
            if (tab === 'forgelab' || tab === 'lab') navigateTo('/app/forgelab');
            else if (tab === 'candidate') navigateTo('/app/candidate');
            else navigateTo('/app/decide');
          }}
        />
      )}

      {/* 4. CANDIDATE PLAYBOOK V2 & FAILURE ANALYSIS & HUMAN GOVERNANCE */}
      {(activeModule === 'candidate' || activeModule === 'governance') && (
        <CandidateV2View
          onNavigateToLab={() => navigateTo('/app/forgelab')}
          onNavigateToMemory={() => navigateTo('/app/memory')}
        />
      )}

      {/* 5. FORGE LAB: Empirical Benchmark Cockpit & V1 vs V2 Regression */}
      {activeModule === 'forgelab' && (
        <ForgeLabView
          onNavigate={(tab) => {
            if (tab === 'governance' || tab === 'candidate') navigateTo('/app/candidate');
            else if (tab === 'red-team') navigateTo('/app/redteam');
            else if (tab === 'memory') navigateTo('/app/memory');
            else navigateTo('/app/decide');
          }}
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
          initialFilter={incidentFilter}
          initialIncidentId={selectedIncidentId || undefined}
          initialOpenNew={openNewIncidentModal}
        />
      )}

      {/* 9. POLICIES: Active Rules, Authority Matrix & Changes */}
      {activeModule === 'policies' && (
        <PoliciesView
          initialPolicyId={selectedPolicyId}
          onNavigateToScenario={() => handleNavigateToScenario('Policy Amendment Simulation')}
        />
      )}

      {/* 10. AUDIT: Decision Records, Conformance & Historical Audit */}
      {activeModule === 'audit' && (
        <AuditCenterView
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
    </AppShell>
  );
}

export default App;
