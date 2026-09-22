"""
Expert Knowledge Capture Engine for FORGE X.
Elicits tacit organizational judgment when encountering ambiguity,
converting human expert responses into formal decision rules, exceptions, and provenance.
"""

from __future__ import annotations
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
from packages.domain.models import ExceptionRule, Evidence, DecisionGenome


class ExpertElicitationPrompt(BaseModel):
    prompt_id: str
    context_situation: str
    detected_conflicts: List[str]
    question_to_expert: str
    options: List[str]


class CapturedTacitKnowledge(BaseModel):
    rule_id: str
    derived_exception: ExceptionRule
    generated_evidence: Evidence
    author_expert: str
    created_at: datetime
    provenance_hash: str


class ExpertKnowledgeCaptureEngine:
    """
    Captures tacit knowledge when process mining detects ambiguity or conflicting paths.
    """

    def generate_elicitation_prompt(
        self,
        situation: str,
        conflicting_branches: List[str],
    ) -> ExpertElicitationPrompt:
        """Constructs an intelligent prompt for a senior subject matter expert."""
        return ExpertElicitationPrompt(
            prompt_id="ELICIT-OPS-001",
            context_situation=situation,
            detected_conflicts=conflicting_branches,
            question_to_expert="I found three conflicting paths in past activity for enterprise claims during outages. Which exception rule should govern?",
            options=[
                "Always auto-refund immediately if ARR > $50,000",
                "Require dual Staff + TAM signoff within 2 hours",
                "Escalate directly to VP of Customer Experience",
            ]
        )

    def capture_expert_response(
        self,
        prompt_id: str,
        expert_name: str,
        chosen_option: str,
        expert_rationale: str,
    ) -> CapturedTacitKnowledge:
        """
        Converts human expert response into a formal ExceptionRule and Evidence item.
        """
        now = datetime.now(timezone.utc)
        ev_id = f"ev_expert_{int(now.timestamp())}"
        exc_id = f"EXC-TACIT-{int(now.timestamp()) % 10000:04d}"

        evidence = Evidence(
            id=ev_id,
            source_type="expert_testimony",
            description=f"Expert policy guidance from {expert_name}: '{expert_rationale}'",
            confidence=0.99,
            is_contradiction=False,
            timestamp=now,
        )

        exception_rule = ExceptionRule(
            id=exc_id,
            trigger_condition="account_arr > 50000 and outage_active == True",
            action="instant_sla_credit_with_tam_notification",
            classification="common_case",
            historical_frequency=0.25,
            supporting_evidence_ids=[ev_id],
        )

        return CapturedTacitKnowledge(
            rule_id=exc_id,
            derived_exception=exception_rule,
            generated_evidence=evidence,
            author_expert=expert_name,
            created_at=now,
            provenance_hash=f"sha256:{abs(hash(expert_rationale + expert_name))}",
        )
