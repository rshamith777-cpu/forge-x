"""
Unit tests for Specialized Agent Pipeline (Adversarial, Evolver, Apprenticeship, Expert Capture).
"""

import pytest
from packages.domain.models import Playbook, PlaybookReliabilityScore, DecisionGenome, CandidateAction
from packages.agents.adversarial import AdversarialAgent
from packages.agents.playbook_evolver import PlaybookEvolver
from packages.agents.apprenticeship import AIApprenticeshipTrainer
from packages.agents.expert_capture import ExpertKnowledgeCaptureEngine


def test_adversarial_agent():
    agent = AdversarialAgent()

    scores_v1 = PlaybookReliabilityScore(
        normal_case_success=0.95,
        edge_case_success=0.80,
        adversarial_success=0.65,
        evidence_coverage=0.90,
        policy_coverage=1.0,
        exception_coverage=0.75,
        confidence=0.88,
    )
    pb_v1 = Playbook(
        id="PB-001",
        name="Billing Playbook V1",
        version="1.0.0",
        reliability_scores=scores_v1,
    )

    report = agent.stress_test_playbook(pb_v1)
    assert report.scenarios_tested == 3
    assert report.breached_scenarios > 0
    assert len(report.vulnerabilities) > 0


def test_playbook_evolver_and_human_approval():
    evolver = PlaybookEvolver()

    scores_v1 = PlaybookReliabilityScore(
        normal_case_success=0.95,
        edge_case_success=0.80,
        adversarial_success=0.65,
        evidence_coverage=0.90,
        policy_coverage=1.0,
        exception_coverage=0.75,
        confidence=0.88,
    )
    pb_v1 = Playbook(
        id="PB-001",
        name="Billing Playbook V1",
        version="1.0.0",
        reliability_scores=scores_v1,
    )

    scores_v2 = PlaybookReliabilityScore(
        normal_case_success=0.98,
        edge_case_success=0.92,
        adversarial_success=0.94,
        evidence_coverage=0.95,
        policy_coverage=1.0,
        exception_coverage=0.92,
        confidence=0.96,
        overall_health="READY",
    )

    # Evolve from v1 -> v2
    pb_v2, record = evolver.evolve_playbook(
        current_playbook=pb_v1,
        new_genomes=["GENOME-APEX-BILLING-002"],
        change_summary="Codified Fast-Track Enterprise Credit up to $1,500 with Sybil fraud guard",
        reason="Address adversarial vulnerability ATK-001 and prevent 48h manager queue churn",
        evidence_ids=["EVID-01", "EVID-02"],
        updated_scores=scores_v2,
    )

    assert pb_v2.version == "2.0.0"
    assert pb_v2.status == "simulating"
    assert record.approval_status == "PENDING_HUMAN_REVIEW"

    # Human Gate: VP Approves
    approved_pb = evolver.apply_human_approval(pb_v2, action="APPROVE", reviewer="Benjamin Clark (VP CX)")
    assert approved_pb.status == "active"
    assert approved_pb.approved_by == "Benjamin Clark (VP CX)"


def test_apprenticeship_trainer():
    trainer = AIApprenticeshipTrainer()

    genome = DecisionGenome(
        id="GENOME-BILLING-001",
        version="1.0.0",
        situation="Enterprise customer requesting credit after outage",
        preferred_action="direct_executive_credit_bypass",
        policy_dependencies=["POL-OPS-012"],
    )

    # Trainee makes wrong conservative decision
    eval_wrong = trainer.evaluate_trainee_decision(
        scenario_situation="Enterprise client demanding $750 refund",
        user_chosen_action="queue_for_manager_review_48h",
        active_genome=genome,
    )
    assert eval_wrong.did_align is False
    assert eval_wrong.alignment_score < 0.6
    assert "Why this decision differed" in eval_wrong.tacit_reasoning_explanation
    assert len(eval_wrong.overlooked_signals) > 0

    # Trainee makes aligned decision
    eval_correct = trainer.evaluate_trainee_decision(
        scenario_situation="Enterprise client demanding $750 refund",
        user_chosen_action="direct_executive_credit_bypass",
        active_genome=genome,
    )
    assert eval_correct.did_align is True
    assert eval_correct.alignment_score == 1.0


def test_expert_knowledge_capture():
    engine = ExpertKnowledgeCaptureEngine()

    prompt = engine.generate_elicitation_prompt(
        situation="Outage credit ambiguity",
        conflicting_branches=["Manager queue", "Slack bypass"],
    )
    assert len(prompt.options) == 3

    captured = engine.capture_expert_response(
        prompt_id=prompt.prompt_id,
        expert_name="Sarah Chen (Staff Lead)",
        chosen_option="Always auto-refund immediately if ARR > $50,000",
        expert_rationale="Accounts above $50k ARR have dedicated TAMs who verify claims within 2 hours anyway.",
    )
    assert captured.derived_exception.action == "instant_sla_credit_with_tam_notification"
    assert captured.generated_evidence.source_type == "expert_testimony"
    assert captured.author_expert == "Sarah Chen (Staff Lead)"
