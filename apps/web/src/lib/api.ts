/**
 * FORGE X Frontend API Client.
 * Connects to FastAPI backend on http://localhost:8000.
 */

const API_BASE = "http://localhost:8000";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return res.json();
}

export async function fetchMossMetrics() {
  const res = await fetch(`${API_BASE}/api/metrics/moss`);
  return res.json();
}

export async function fetchCommandCenter() {
  const res = await fetch(`${API_BASE}/api/command-center`);
  return res.json();
}

export async function fetchArchaeology() {
  const res = await fetch(`${API_BASE}/api/archaeology`);
  return res.json();
}

export async function fetchGenomes() {
  const res = await fetch(`${API_BASE}/api/genomes`);
  return res.json();
}

export async function fetchPlaybooks() {
  const res = await fetch(`${API_BASE}/api/playbooks`);
  return res.json();
}

export async function runForkReality(params: {
  threshold_amount: number;
  auto_approve_enterprise: boolean;
  sla_escalation_hours: number;
  require_manager_approval: boolean;
  fraud_check_strictness: number;
  iterations: number;
}) {
  const res = await fetch(`${API_BASE}/api/fork-reality`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function approvePlaybook(playbookId: string, action: string, reviewer: string) {
  const res = await fetch(`${API_BASE}/api/playbooks/${playbookId}/approval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, reviewer }),
  });
  return res.json();
}

export async function stressTestPlaybook(playbookId: string) {
  const res = await fetch(`${API_BASE}/api/playbooks/${playbookId}/stress-test`, {
    method: "POST",
  });
  return res.json();
}

export async function evaluateApprenticeship(userAction: string, scenarioSituation: string) {
  const res = await fetch(`${API_BASE}/api/apprenticeship/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_action: userAction, scenario_situation: scenarioSituation }),
  });
  return res.json();
}

export async function executeLiveCase(params: {
  customer_tier: string;
  claimed_amount: number;
  outage_disruption_hours: number;
  incident_active: boolean;
  account_mrr: number;
}) {
  const res = await fetch(`${API_BASE}/api/execute-live`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function runRedTeamAttack() {
  const res = await fetch(`${API_BASE}/api/red-team/run`, {
    method: "POST",
  });
  return res.json();
}

export async function fetchRedTeamEvolution() {
  const res = await fetch(`${API_BASE}/api/red-team/evolution`);
  return res.json();
}

export async function fetchTimeMachineTimeline() {
  const res = await fetch(`${API_BASE}/api/time-machine/timeline`);
  return res.json();
}

export async function inspectTimeMachine(timestamp: string) {
  const encoded = encodeURIComponent(timestamp);
  const res = await fetch(`${API_BASE}/api/time-machine/inspect?timestamp=${encoded}`);
  return res.json();
}

export async function explainDecision(decisionId: string) {
  const res = await fetch(`${API_BASE}/api/explain-decision/${decisionId}`);
  return res.json();
}

export async function runForgeLabTests() {
  const res = await fetch(`${API_BASE}/api/lab/run-tests`, {
    method: "POST",
  });
  return res.json();
}

export async function fetchKnowledgeHealth() {
  const res = await fetch(`${API_BASE}/api/knowledge-health`);
  return res.json();
}

export async function fetchCausalChain(thresholdAmount: number) {
  const res = await fetch(`${API_BASE}/api/simulation/causal-chain?threshold_amount=${thresholdAmount}`);
  return res.json();
}

// Enterprise Operations & Incident Workflow APIs
export async function fetchIncidents(params?: { status?: string; priority?: string; search?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.append("status", params.status);
  if (params?.priority) q.append("priority", params.priority);
  if (params?.search) q.append("search", params.search);
  const res = await fetch(`${API_BASE}/api/incidents?${q.toString()}`);
  return res.json();
}

export async function fetchIncidentDetail(incidentId: string) {
  const res = await fetch(`${API_BASE}/api/incidents/${incidentId}`);
  return res.json();
}

export async function createIncident(data: {
  customer: string;
  tier?: string;
  mrr?: number;
  impact?: string;
  affected_services?: string[];
  duration_hours?: number;
  claimed_amount?: number;
  priority?: string;
  owner?: string;
}) {
  const res = await fetch(`${API_BASE}/api/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function resolveIncident(incidentId: string, data: {
  approver?: string;
  approved_amount?: number;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE}/api/incidents/${incidentId}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchAuditLedger() {
  const res = await fetch(`${API_BASE}/api/audit/ledger`);
  return res.json();
}

export async function fetchPoliciesSummary() {
  const res = await fetch(`${API_BASE}/api/policies/summary`);
  return res.json();
}

export async function fetchRiskFindings() {
  const res = await fetch(`${API_BASE}/api/risk/findings`);
  return res.json();
}

// --- ARCHITECTURE SPRINT CORE APIS ---

export async function decideDecision(params: {
  situation: string;
  signals?: Record<string, any>;
  customer_tier?: string;
  claimed_amount?: number;
  incident_active?: boolean;
  timestamp?: string;
  organization_id?: string;
  policy_scope?: string;
}) {
  const res = await fetch(`${API_BASE}/api/decide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function fetchDecisionTrace(traceId: string) {
  const res = await fetch(`${API_BASE}/api/trace/${traceId}`);
  return res.json();
}

export async function simulateLabV1vsV2(params?: {
  playbook_v1_id?: string;
  candidate_v2_id?: string;
  temporal_isolation_enabled?: boolean;
  historical_timestamp?: string;
  iterations?: number;
}) {
  const res = await fetch(`${API_BASE}/api/lab/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params || {}),
  });
  return res.json();
}

export async function fetchCandidateV2() {
  const res = await fetch(`${API_BASE}/api/policies/evolve`);
  return res.json();
}

export async function approveCandidatePolicy(params: {
  candidate_id?: string;
  reviewer?: string;
  action?: string;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE}/api/governance/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      candidate_id: params.candidate_id || "CAND-PB-V2-SYBIL-HARDENED",
      reviewer: params.reviewer || "VP of Operations",
      action: params.action || "APPROVE",
      notes: params.notes || "Approved after FORGE LAB verification."
    }),
  });
  return res.json();
}

export async function fetchMemorySummary() {
  const res = await fetch(`${API_BASE}/api/memory/summary`);
  return res.json();
}

export async function fetchRedTeamScenarios() {
  const res = await fetch(`${API_BASE}/api/red-team/scenarios`);
  return res.json();
}

export async function fetchReliabilitySummary() {
  const res = await fetch(`${API_BASE}/api/reliability/summary`);
  return res.json();
}



