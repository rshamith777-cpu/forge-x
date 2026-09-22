"""
Unit tests for FORGE X Domain Models.
"""

import pytest
from datetime import datetime, timezone
from packages.domain.models import (
    Event,
    Evidence,
    Decision,
    DecisionGenome,
    CandidateAction,
    ExceptionRule,
    Workflow,
    WorkflowNode,
    WorkflowEdge,
    Playbook,
    PlaybookReliabilityScore,
    Policy,
    Contradiction,
    KnowledgeGap,
    SimulationResult,
    ContextGravityScore,
)


def test_decision_genome_creation():
    genome = DecisionGenome(
        id="GENOME-TEST-001",
        version="1.0.0",
        situation="Enterprise customer requesting refund over $500 during outage",
        observable_signals={"tier": "enterprise", "amount": 750.0, "outage": True},
        hidden_assumptions=["Enterprise churn risk exceeds $5,000 ARR", "Account exec must be tagged"],
        context_requirements=["customer_mrr", "incident_id", "previous_tickets"],
        constraints=["Max auto-credit cap is $2,000 without VP signoff"],
        candidate_actions=[
            CandidateAction(
                action_name="instant_credit",
                description="Issue credit immediately and notify TAM",
                estimated_cost=750.0,
                estimated_duration_hours=0.1,
                risk_level="low",
                historical_win_rate=0.96,
            ),
            CandidateAction(
                action_name="hold_for_manager",
                description="Route to manager queue",
                estimated_cost=0.0,
                estimated_duration_hours=48.0,
                risk_level="high",
                historical_win_rate=0.45,
            ),
        ],
        preferred_action="instant_credit",
        alternatives=["hold_for_manager"],
        exceptions=[
            ExceptionRule(
                id="EXC-001",
                trigger_condition="account_status == 'churn_risk_flagged'",
                action="call_customer_success_director",
                classification="dangerous_edge_case",
                historical_frequency=0.05,
            )
        ],
        evidence=["EV-001", "EV-002"],
        expected_outcomes={"sla_met": True, "churn_prevented": True},
        confidence=0.94,
        risk=0.12,
        owner="support_operations",
        policy_dependencies=["POL-OPS-012"],
    )

    assert genome.id == "GENOME-TEST-001"
    assert genome.preferred_action == "instant_credit"
    assert genome.confidence == 0.94
    assert len(genome.exceptions) == 1
    assert genome.exceptions[0].classification == "dangerous_edge_case"


def test_context_gravity_score():
    cg = ContextGravityScore(
        score=0.88,
        tier="critical",
        recency_weight=0.9,
        frequency_weight=0.7,
        business_impact=0.95,
        policy_relevance=0.85,
        explanation="Major production outage escalation",
    )
    assert cg.score == 0.88
    assert cg.tier == "critical"


def test_event_and_evidence_linkage():
    event = Event(
        id="evt_slack_991",
        case_id="CASE-104",
        actor="sarah.chen@apexcloud.io",
        actor_role="staff_support_lead",
        source="slack",
        event_type="refund_approved_bypass",
        payload={"ticket_id": "TICK-402", "amount": 850.0, "reason": "VIP churn prevention"},
    )
    evidence = Evidence(
        id="EVID-001",
        event_id=event.id,
        source_type="observed_event",
        description="Observed staff support lead directly approving $850 credit via #incidents channel",
        confidence=0.99,
        is_contradiction=True,
    )
    assert evidence.event_id == "evt_slack_991"
    assert evidence.is_contradiction is True


def test_contradiction_detection_model():
    contra = Contradiction(
        id="CONTRA-001",
        documented_rule="Manager signoff required for any refund exceeding $500",
        observed_behavior="Staff engineers issue up to $1,500 credits directly in 87% of enterprise outage tickets",
        policy_id="POL-OPS-012",
        evidence_ids=["EVID-001", "EVID-002", "EVID-003"],
        frequency_observed=42,
        severity="high",
        suggested_resolution="Update POL-OPS-012 to delegate $1,500 threshold to senior staff for enterprise tier",
    )
    assert contra.severity == "high"
    assert contra.frequency_observed == 42


def test_playbook_reliability_scoring():
    scores = PlaybookReliabilityScore(
        normal_case_success=0.98,
        edge_case_success=0.89,
        adversarial_success=0.74,
        evidence_coverage=0.93,
        policy_coverage=1.0,
        exception_coverage=0.88,
        confidence=0.91,
        overall_health="READY",
    )
    playbook = Playbook(
        id="PB-BILLING-V1",
        name="Enterprise Billing Disruption Playbook",
        version="1.0.0",
        decision_genomes=["GENOME-TEST-001"],
        reliability_scores=scores,
        status="validated",
    )
    assert playbook.reliability_scores.overall_health == "READY"
    assert playbook.reliability_scores.adversarial_success == 0.74
