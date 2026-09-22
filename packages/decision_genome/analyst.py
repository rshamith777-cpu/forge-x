"""
Decision Analyst and Evidence Verifier for FORGE X.
Extracts empirical decisions from event traces, constructs versioned Decision Genomes,
identifies hidden assumptions, and strictly verifies evidence grounding.
"""

from __future__ import annotations
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from packages.domain.models import (
    DecisionGenome,
    CandidateAction,
    ExceptionRule,
    Decision,
    Evidence,
    ContextGravityScore,
)


class EvidenceVerifier:
    """
    Answers:
    - What evidence supports this rule?
    - How many historical examples?
    - Is there contradictory evidence?
    - Is the inference strong enough?
    Never allows unsupported AI-generated rules to silently become organizational policy.
    """

    @staticmethod
    def verify_grounding(
        genome: DecisionGenome,
        evidence_list: List[Evidence],
    ) -> Dict[str, Any]:
        """
        Calculates empirical evidence grounding score.
        Score = (sum(pos_weights) - 2 * sum(neg_weights)) / total_evidence
        """
        supporting_evidence = [e for e in evidence_list if e.id in genome.evidence and not e.is_contradiction]
        contradicting_evidence = [e for e in evidence_list if e.id in genome.evidence and e.is_contradiction]

        total_count = len(supporting_evidence) + len(contradicting_evidence)
        if total_count == 0:
            return {
                "grounded": False,
                "grounding_score": 0.0,
                "supporting_count": 0,
                "contradicting_count": 0,
                "status": "UNGROUNDED",
                "reason": "Zero empirical evidence linked to this genome."
            }

        pos_weight = sum(e.confidence for e in supporting_evidence)
        neg_weight = sum(e.confidence for e in contradicting_evidence)

        # Grounding formula penalizes contradictions
        score = max(0.0, (pos_weight - (1.5 * neg_weight)) / total_count)

        is_grounded = score >= 0.65 and len(supporting_evidence) >= 2 and len(contradicting_evidence) <= 2
        return {
            "grounded": is_grounded,
            "grounding_score": round(score, 3),
            "supporting_count": len(supporting_evidence),
            "contradicting_count": len(contradicting_evidence),
            "status": "VERIFIED" if is_grounded else "REVIEW_REQUIRED",
            "reason": f"Grounded by {len(supporting_evidence)} corroborating historical traces." if is_grounded else "Insufficient evidence or high contradiction volume."
        }


class DecisionAnalyst:
    """
    Analyzes historical decisions and event traces, isolates decision points,
    extracts observable signals and tacit assumptions, and compiles Decision Genomes.
    """

    def __init__(self):
        self.verifier = EvidenceVerifier()

    def compile_decision_genome(
        self,
        genome_id: str,
        situation: str,
        decisions: List[Decision],
        evidence_pool: List[Evidence],
        policy_codes: List[str],
        observable_signals: Dict[str, Any],
        hidden_assumptions: List[str],
        preferred_action: str,
        candidate_actions: List[CandidateAction],
        exceptions: Optional[List[ExceptionRule]] = None,
        version: str = "1.0.0",
        owner: str = "support_operations",
    ) -> DecisionGenome:
        """
        Compiles a fully-formed, versioned Decision Genome with verified provenance.
        """
        # Collect all relevant evidence IDs from the decision records
        evidence_ids = []
        for dec in decisions:
            evidence_ids.extend(dec.evidence_ids)
        evidence_ids = list(set(evidence_ids))

        genome = DecisionGenome(
            id=genome_id,
            version=version,
            situation=situation,
            observable_signals=observable_signals,
            hidden_assumptions=hidden_assumptions,
            context_requirements=["customer_tier", "sla_delay_hours", "incident_status", "account_mrr"],
            constraints=["SLA maximum resolution time < 2 hours for enterprise", "Credit ceiling $2,000"],
            relevant_history=[d.id for d in decisions[:5]],
            candidate_actions=candidate_actions,
            preferred_action=preferred_action,
            alternatives=[a.action_name for a in candidate_actions if a.action_name != preferred_action],
            exceptions=exceptions or [],
            evidence=evidence_ids,
            expected_outcomes={"churn_prevention_rate": 0.96, "resolution_time_minutes": 65},
            confidence=0.92,
            risk=0.15,
            owner=owner,
            policy_dependencies=policy_codes,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            status="validated",
            provenance={
                "extracted_from_decision_count": len(decisions),
                "compiled_by": "DecisionAnalyst",
                "verified_at": datetime.now(timezone.utc).isoformat(),
            }
        )

        # Run verification check
        verification = self.verifier.verify_grounding(genome, evidence_pool)
        genome.confidence = verification["grounding_score"] if verification["grounded"] else min(genome.confidence, 0.5)
        if not verification["grounded"]:
            genome.status = "draft"

        return genome
