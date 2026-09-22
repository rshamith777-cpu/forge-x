"""
FORGE X Domain Models
Pydantic v2 models representing the Organizational Intelligence ontology.
"""

from __future__ import annotations
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field, ConfigDict


class ContextGravityScore(BaseModel):
    """Dynamic relevance score influenced by recency, frequency, business impact, and policy relevance."""
    model_config = ConfigDict(frozen=True)

    score: float = Field(default=0.5, ge=0.0, le=1.0, description="Normalized gravity score [0.0 - 1.0]")
    tier: Literal["low", "medium", "high", "critical"] = "medium"
    recency_weight: float = Field(default=0.5, ge=0.0, le=1.0)
    frequency_weight: float = Field(default=0.5, ge=0.0, le=1.0)
    business_impact: float = Field(default=0.5, ge=0.0, le=1.0)
    policy_relevance: float = Field(default=0.5, ge=0.0, le=1.0)
    explanation: Optional[str] = None


class Event(BaseModel):
    """An atomic observed organizational activity."""
    id: str = Field(description="Unique event ID (e.g. evt_slack_001)")
    case_id: str = Field(description="Associated customer/incident trace ID")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    actor: str = Field(description="Username or email of the person/system who took the action")
    actor_role: str = Field(default="support_engineer", description="Role of the actor")
    source: Literal["slack", "jira", "zendesk", "stripe", "github", "email", "crm", "internal_tool"] = "zendesk"
    event_type: str = Field(description="Normalized action type: ticket_created, message_sent, refund_issued, etc.")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Raw attributes of the event")
    context_gravity: ContextGravityScore = Field(default_factory=ContextGravityScore)


class Evidence(BaseModel):
    """Verified link to events, policies, or cases that support or contradict an organizational rule."""
    id: str = Field(description="Unique evidence ID")
    event_id: Optional[str] = Field(default=None, description="Linked event ID")
    policy_id: Optional[str] = Field(default=None, description="Linked policy ID")
    source_type: Literal["observed_event", "policy_clause", "expert_testimony", "outcome_data"] = "observed_event"
    description: str = Field(description="Human-readable statement of what this evidence proves")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    is_contradiction: bool = Field(default=False, description="True if this evidence refutes a documented policy")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Outcome(BaseModel):
    """Measured consequence of an organizational action or decision."""
    id: str = Field(description="Unique outcome ID")
    case_id: str = Field(description="Case/ticket trace ID")
    action_taken: str = Field(description="Action executed")
    success: bool = Field(description="Did the action resolve the problem favorably?")
    cost: float = Field(default=0.0, ge=0.0, description="Monetary cost incurred in USD")
    duration_minutes: float = Field(default=0.0, ge=0.0, description="Cycle time to resolution in minutes")
    customer_churned: bool = Field(default=False, description="Did customer churn within 30 days?")
    escalation_required: bool = Field(default=False, description="Was executive escalation required?")
    csat_score: Optional[float] = Field(default=None, ge=1.0, le=5.0, description="Customer satisfaction 1-5")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CandidateAction(BaseModel):
    """An action considered during a decision point."""
    action_name: str
    description: str
    estimated_cost: float = 0.0
    estimated_duration_hours: float = 0.0
    risk_level: Literal["low", "medium", "high", "critical"] = "low"
    historical_win_rate: float = 0.5


class ExceptionRule(BaseModel):
    """Mined condition where the standard policy branches into an exception."""
    id: str
    trigger_condition: str = Field(description="e.g. tier == 'enterprise' and delay_hours > 48")
    action: str = Field(description="Override action to take")
    classification: Literal["common_case", "rare_case", "dangerous_edge_case", "unknown_case"] = "common_case"
    historical_frequency: float = Field(default=0.1, description="Observed frequency of this exception")
    supporting_evidence_ids: List[str] = Field(default_factory=list)


class DecisionGenome(BaseModel):
    """
    First-class internal representation of how an organization makes a decision.
    From how people work -> to how machines can reason.
    """
    id: str = Field(description="Unique Genome ID (e.g. GENOME-APEX-BILLING-001)")
    version: str = Field(default="1.0.0", description="SemVer string")
    situation: str = Field(description="Natural language summary of the decision situation")
    observable_signals: Dict[str, Any] = Field(default_factory=dict, description="Identified inputs and metrics")
    hidden_assumptions: List[str] = Field(default_factory=list, description="Tacit knowledge extracted from traces")
    context_requirements: List[str] = Field(default_factory=list, description="Required data elements before deciding")
    constraints: List[str] = Field(default_factory=list, description="Hard organizational and statutory boundaries")
    relevant_history: List[str] = Field(default_factory=list, description="Relevant case or precedent IDs")
    candidate_actions: List[CandidateAction] = Field(default_factory=list)
    preferred_action: str = Field(description="Selected action under current compiled policy")
    alternatives: List[str] = Field(default_factory=list, description="Rejected alternate actions")
    exceptions: List[ExceptionRule] = Field(default_factory=list, description="Explicit exception branches")
    evidence: List[str] = Field(default_factory=list, description="List of supporting Evidence IDs")
    expected_outcomes: Dict[str, Any] = Field(default_factory=dict)
    actual_outcomes: Optional[Dict[str, Any]] = None
    confidence: float = Field(default=0.85, ge=0.0, le=1.0, description="Grounding confidence")
    risk: float = Field(default=0.20, ge=0.0, le=1.0, description="Risk profile")
    owner: str = Field(default="revops_team", description="Team or executive owner")
    policy_dependencies: List[str] = Field(default_factory=list, description="Governing policy codes")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: Literal["draft", "validated", "active", "deprecated", "contradicted"] = "validated"
    provenance: Dict[str, Any] = Field(default_factory=dict, description="Full cryptographic/event lineage")


class Decision(BaseModel):
    """An empirical decision record extracted from historical activity."""
    id: str
    case_id: str
    situation: str
    action_taken: str
    alternatives_rejected: List[str] = Field(default_factory=list)
    actor_id: str
    actor_role: str
    outcome_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    evidence_ids: List[str] = Field(default_factory=list)
    matched_genome_id: Optional[str] = None
    rationale: Optional[str] = None


class WorkflowNode(BaseModel):
    id: str
    label: str
    stage_type: Literal["start", "activity", "decision_point", "exception", "end"] = "activity"
    avg_duration_minutes: float = 0.0
    bottleneck_score: float = 0.0
    is_undocumented: bool = False
    metadata: Dict[str, Any] = Field(default_factory=dict)


class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    frequency: int = 1
    probability: float = 1.0
    avg_latency_minutes: float = 0.0
    is_undocumented_bypass: bool = False


class Workflow(BaseModel):
    """Process graph representation: Documented vs Discovered."""
    id: str
    name: str
    version: str = "1.0.0"
    type: Literal["documented", "discovered"] = "discovered"
    domain: str = "customer_support"
    nodes: List[WorkflowNode] = Field(default_factory=list)
    edges: List[WorkflowEdge] = Field(default_factory=list)
    bottlenecks: List[str] = Field(default_factory=list, description="Node IDs marked as bottlenecks")
    cycles: List[List[str]] = Field(default_factory=list, description="Detected rework/ping-pong loops")
    total_traces: int = 0
    conformance_rate: float = 1.0


class Policy(BaseModel):
    """Formal organizational rules and SOPs."""
    id: str
    code: str = Field(description="Policy code (e.g. POL-OPS-012)")
    title: str
    clause_text: str
    category: str = "billing"
    sla_hours: float = 48.0
    max_refund_auto: float = 200.0
    requires_approval_over: float = 500.0
    version: str = "1.0.0"
    effective_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: Literal["active", "superseded", "review_required"] = "active"


class Contradiction(BaseModel):
    """Detected conflict between formal documentation and actual observed behavior."""
    id: str
    documented_rule: str
    observed_behavior: str
    policy_id: str
    evidence_ids: List[str] = Field(default_factory=list)
    frequency_observed: int = 1
    severity: Literal["low", "medium", "high", "critical"] = "high"
    status: Literal["open", "resolved", "accepted_as_policy"] = "open"
    suggested_resolution: str


class KnowledgeGap(BaseModel):
    """Identified unvalidated blind spot in operational playbooks."""
    id: str
    area: str
    description: str
    impact: Literal["low", "medium", "high", "critical"] = "high"
    missing_evidence_count: int = 0
    priority: int = 1
    recommended_action: str


class PlaybookReliabilityScore(BaseModel):
    """Empirical breakdown of playbook reliability based on real simulations."""
    normal_case_success: float = Field(ge=0.0, le=1.0)
    edge_case_success: float = Field(ge=0.0, le=1.0)
    adversarial_success: float = Field(ge=0.0, le=1.0)
    evidence_coverage: float = Field(ge=0.0, le=1.0)
    policy_coverage: float = Field(ge=0.0, le=1.0)
    exception_coverage: float = Field(ge=0.0, le=1.0)
    regression_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    overall_health: Literal["READY", "REVIEW", "UNSAFE"] = "READY"


class Playbook(BaseModel):
    """An executable operational playbook combining Decision Genomes and rules."""
    id: str
    name: str
    version: str = "1.0.0"
    domain: str = "billing_support"
    decision_genomes: List[str] = Field(default_factory=list, description="Genome IDs in this playbook")
    fallback_action: str = "escalate_to_human_supervisor"
    sla_thresholds: Dict[str, float] = Field(default_factory=lambda: {"standard": 48.0, "enterprise": 4.0})
    reliability_scores: PlaybookReliabilityScore
    status: Literal["draft", "simulating", "validated", "active", "deprecated"] = "draft"
    previous_version_id: Optional[str] = None
    diff_summary: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None


class Scenario(BaseModel):
    """A test situation profile for stress testing."""
    id: str
    name: str
    type: Literal["baseline", "modified_policy", "conservative", "adversarial", "worst_case"] = "baseline"
    description: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    mutations: List[str] = Field(default_factory=list)


class SimulationResult(BaseModel):
    """Result of running a scenario through the discrete-event simulator."""
    id: str
    scenario_id: str
    branch_name: str = "Current Policy"
    iterations: int = 1000
    success_rate: float = 0.95
    failure_rate: float = 0.05
    avg_cost: float = 120.0
    avg_duration_hours: float = 4.2
    risk_score: float = 0.15
    csat_score: float = 4.6
    workload_hours: float = 24.5
    exceptions_count: int = 42
    escalation_rate: float = 0.08
    downstream_effects: List[str] = Field(default_factory=list)
    pareto_point: Dict[str, float] = Field(default_factory=dict)


class ExecutionTrace(BaseModel):
    """Structured audit trace of an agent executing a playbook."""
    id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    agent: str
    task_id: str
    retrieved_context_ids: List[str] = Field(default_factory=list)
    situation: str
    decision_genome_id: str
    action_taken: str
    evidence_ids: List[str] = Field(default_factory=list)
    moss_latency_ms: float = 0.0
    total_latency_ms: float = 0.0
    outcome_status: Literal["success", "failure", "escalated"] = "success"
    confidence: float = 0.92


GovernanceState = Literal["PENDING_REVIEW", "APPROVED", "REJECTED", "ESCALATED", "EXECUTED"]


class DecisionTrace(BaseModel):
    """
    Official FORGE X Decision Trace.
    Complete explainability & audit record produced for every organizational decision.
    """
    decision_id: str = Field(description="Unique Decision ID (e.g. DEC-2026-001)")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    situation: str = Field(description="Context and natural language problem statement")
    signals: Dict[str, Any] = Field(default_factory=dict, description="Observable signals and inputs")
    constraints: List[str] = Field(default_factory=list, description="Policy and statutory constraints applied")
    retrieved_evidence: List[Dict[str, Any]] = Field(default_factory=list, description="Grounding evidence retrieved via Moss")
    applicable_policies: List[Dict[str, Any]] = Field(default_factory=list, description="Governing policy clauses")
    precedents: List[Dict[str, Any]] = Field(default_factory=list, description="Relevant historical decisions")
    exceptions: List[Dict[str, Any]] = Field(default_factory=list, description="Mined exception rules evaluated")
    candidate_actions: List[Dict[str, Any]] = Field(default_factory=list, description="Candidate actions considered")
    selected_action: str = Field(description="Action selected by Decision Engine")
    reasoning: str = Field(description="Provenance and reasoning justification")
    confidence: float = Field(default=0.90, ge=0.0, le=1.0)
    risk: float = Field(default=0.10, ge=0.0, le=1.0)
    policy_dependencies: List[str] = Field(default_factory=list)
    expected_outcome: Dict[str, Any] = Field(default_factory=dict)
    actual_outcome: Optional[Dict[str, Any]] = None
    version_info: Dict[str, str] = Field(
        default_factory=lambda: {
            "playbook_version": "1.0.0",
            "genome_version": "1.0.0",
            "compiler_version": "FORGE-X-2.1.0"
        }
    )
    governance_state: GovernanceState = Field(default="EXECUTED")
    moss_latency_ms: float = 0.0
    total_latency_ms: float = 0.0


class CandidatePlaybookV2(BaseModel):
    """
    Candidate Playbook generated by Failure Analysis & Policy Evolution.
    Security Invariant: AI CANNOT directly mutate production policies.
    Requires FORGE LAB regression verification + Human Approval.
    """
    candidate_id: str = Field(description="Candidate identifier e.g. CAND-PB-V2")
    version: str = "2.0.0"
    base_playbook_id: str
    failure_pattern: str = Field(description="The detected exploit or failure pattern")
    root_cause_category: str = Field(description="Root cause category (e.g. sybil_vulnerability, contradictory_sla)")
    affected_policy_id: str = Field(description="Policy targeted for evolution")
    proposed_change: str = Field(description="Precise proposed amendment or new exception rule")
    expected_improvement: str = Field(description="Anticipated robustness and SLA delta")
    potential_regressions: List[str] = Field(default_factory=list, description="Identified regression risks")
    supporting_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    status: Literal["DRAFT_CANDIDATE", "LAB_TESTED", "PENDING_HUMAN_REVIEW", "APPROVED", "REJECTED"] = "DRAFT_CANDIDATE"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    tested_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    lab_regression_score: Optional[float] = None


class AttackEvaluationResult(BaseModel):
    """Structured evaluation output from Adversarial Red Team attack."""
    attack_id: str
    target_decision_id: str
    attack_strategy: str
    expected_failure: str
    actual_system_response: str
    detection_result: Literal["BLOCKED", "BREACHED", "FLAGGED_FOR_REVIEW"]
    failure_pattern: Optional[str] = None
    recommendation: Optional[str] = None
    synthetic_benchmark: bool = True
    benchmark_provenance: str = "Controlled Adversarial Sandbox / Synthetic Enterprise Scenario"

