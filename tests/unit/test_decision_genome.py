"""
Unit tests for Decision Genome, Exception Mining, Contradiction Engine, and Knowledge Decay.
"""

import pytest
from datetime import datetime, timezone, timedelta
from packages.domain.models import (
    Decision,
    Evidence,
    CandidateAction,
    Policy,
    Event,
    Playbook,
    PlaybookReliabilityScore,
)
from packages.decision_genome.analyst import DecisionAnalyst, EvidenceVerifier
from packages.decision_genome.exception_miner import ExceptionMiner
from packages.decision_genome.contradiction_engine import ContradictionEngine
from packages.decision_genome.decay_engine import KnowledgeDecayEngine


def test_decision_genome_compilation_and_verification():
    analyst = DecisionAnalyst()

    decisions = [
        Decision(
            id="D-1",
            case_id="C-1",
            situation="Outage credit claim $750 for Enterprise",
            action_taken="direct_executive_credit_bypass",
            actor_id="emp_01",
            actor_role="staff_support_lead",
            evidence_ids=["EV-1", "EV-2"],
        )
    ]
    evidence_pool = [
        Evidence(id="EV-1", description="Slack escalation approved by VP", confidence=0.95),
        Evidence(id="EV-2", description="Stripe transaction confirmed", confidence=0.98),
    ]

    candidate_actions = [
        CandidateAction(action_name="direct_executive_credit_bypass", description="Direct credit bypass", estimated_cost=750.0),
        CandidateAction(action_name="queue_for_manager", description="Standard review", estimated_cost=0.0),
    ]

    genome = analyst.compile_decision_genome(
        genome_id="GENOME-TEST-001",
        situation="Enterprise customer requesting refund over $500 during outage",
        decisions=decisions,
        evidence_pool=evidence_pool,
        policy_codes=["POL-OPS-012"],
        observable_signals={"tier": "enterprise", "amount": 750.0},
        hidden_assumptions=["Enterprise churn risk exceeds short term financial refund cost"],
        preferred_action="direct_executive_credit_bypass",
        candidate_actions=candidate_actions,
    )

    assert genome.id == "GENOME-TEST-001"
    assert genome.status == "validated"
    assert genome.confidence >= 0.8
    assert "direct_executive_credit_bypass" == genome.preferred_action


def test_exception_miner():
    miner = ExceptionMiner()

    cases = [{"id": "C-1", "tier": "enterprise"}, {"id": "C-2", "tier": "starter"}]
    decisions = [
        {"id": "D-1", "case_id": "C-1", "action_taken": "direct_executive_credit_bypass", "evidence_ids": ["E-1"]},
        {"id": "D-2", "case_id": "C-2", "action_taken": "standard_credit_approved", "evidence_ids": ["E-2"]},
    ]

    exceptions = miner.mine_exceptions_from_traces(cases, decisions)
    assert len(exceptions) >= 2
    assert any(e.action == "direct_executive_credit_bypass" for e in exceptions)
    assert any(e.classification == "dangerous_edge_case" for e in exceptions)


def test_contradiction_engine():
    engine = ContradictionEngine()

    policies = [
        Policy(
            id="POL-1",
            code="POL-OPS-012",
            title="Refund limits",
            clause_text="Manager signoff required for refunds > $500",
            requires_approval_over=500.0,
        )
    ]
    decisions = [
        Decision(
            id="D-1",
            case_id="C-1",
            situation="Claim over $500",
            action_taken="direct_executive_credit_bypass",
            actor_id="emp_01",
            actor_role="staff_support_lead",
            evidence_ids=["EV-1"],
        )
    ]
    events = [
        Event(
            id="EV-1",
            case_id="C-1",
            actor="emp_01",
            source="slack",
            event_type="refund_approved_bypass",
        )
    ]

    contradictions = engine.detect_contradictions(policies, decisions, events)
    assert len(contradictions) >= 1
    assert contradictions[0].severity in ["high", "critical"]
    assert "POL-OPS-012" in contradictions[0].documented_rule


def test_knowledge_decay_engine():
    decay_engine = KnowledgeDecayEngine()

    scores = PlaybookReliabilityScore(
        normal_case_success=0.95,
        edge_case_success=0.85,
        adversarial_success=0.70,
        evidence_coverage=0.90,
        policy_coverage=1.0,
        exception_coverage=0.85,
        confidence=0.90,
    )
    # Stale playbook created 60 days ago
    old_time = datetime.now(timezone.utc) - timedelta(days=60)
    playbook = Playbook(
        id="PB-STALE-01",
        name="Stale Billing Playbook",
        version="1.0.0",
        reliability_scores=scores,
        created_at=old_time,
    )

    from packages.domain.models import Contradiction
    contras = [
        Contradiction(
            id="C-1",
            documented_rule="rule",
            observed_behavior="violation",
            policy_id="POL-1",
            suggested_resolution="fix",
            status="open",
        ),
        Contradiction(
            id="C-2",
            documented_rule="rule 2",
            observed_behavior="violation 2",
            policy_id="POL-1",
            suggested_resolution="fix",
            status="open",
        ),
    ]

    report = decay_engine.evaluate_playbook_decay(playbook, contras)
    assert report["revalidation_required"] is True
    assert "WARNING" in report["status"] or "CRITICAL" in report["status"]

    # Test dynamic Context Gravity
    cg_crit = decay_engine.calculate_context_gravity("production_incident_outage", "slack", is_enterprise=True, is_incident=True)
    assert cg_crit.tier == "critical"
    assert cg_crit.score >= 0.85

    cg_low = decay_engine.calculate_context_gravity("github_pr_merged", "github", is_enterprise=False, is_incident=False)
    assert cg_low.tier == "low"
    assert cg_low.score < 0.45
