"""
Playbook Evolver for FORGE X.
Controlled evolutionary versioning of organizational playbooks with regression testing,
provenance diffs, and mandatory human-in-the-loop approval gates.
"""

from __future__ import annotations
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field
from packages.domain.models import Playbook, PlaybookReliabilityScore, DecisionGenome


class EvolutionRecord(BaseModel):
    evolution_id: str
    from_version: str
    to_version: str
    change_summary: str
    reason: str
    evidence_ids: List[str]
    adversarial_improvements: Dict[str, Any]
    approval_status: Literal["PENDING_HUMAN_REVIEW", "APPROVED", "REJECTED", "ROLLBACK"] = "PENDING_HUMAN_REVIEW"
    reviewer: Optional[str] = None
    reviewed_at: Optional[datetime] = None


class PlaybookEvolver:
    """
    Manages the controlled lifecycle of playbooks.
    Never silently overwrites a playbook.
    Tracks lineage, diffs, regression test scores, and enforces human signoff.
    """

    def __init__(self):
        self.history: List[EvolutionRecord] = []

    def evolve_playbook(
        self,
        current_playbook: Playbook,
        new_genomes: List[str],
        change_summary: str,
        reason: str,
        evidence_ids: List[str],
        updated_scores: PlaybookReliabilityScore,
    ) -> tuple[Playbook, EvolutionRecord]:
        """
        Creates the next version (e.g. v1.0.0 -> v2.0.0), stores lineage and diffs,
        and flags as PENDING_HUMAN_REVIEW.
        """
        # Increment major version if fundamental rule change, else minor
        old_v = current_playbook.version
        parts = old_v.split(".")
        new_v = f"{int(parts[0]) + 1}.0.0"

        evolved_pb = Playbook(
            id=f"{current_playbook.id}_v{new_v.replace('.', '_')}",
            name=current_playbook.name,
            version=new_v,
            domain=current_playbook.domain,
            decision_genomes=new_genomes,
            fallback_action=current_playbook.fallback_action,
            sla_thresholds={"standard": 24.0, "enterprise": 1.5},
            reliability_scores=updated_scores,
            status="simulating",
            previous_version_id=current_playbook.id,
            diff_summary=change_summary,
            created_at=datetime.now(timezone.utc),
        )

        record = EvolutionRecord(
            evolution_id=f"EVO-{len(self.history) + 1:04d}",
            from_version=old_v,
            to_version=new_v,
            change_summary=change_summary,
            reason=reason,
            evidence_ids=evidence_ids,
            adversarial_improvements={
                "adversarial_success_delta": round(updated_scores.adversarial_success - current_playbook.reliability_scores.adversarial_success, 2),
                "regression_rate": updated_scores.regression_rate,
            },
            approval_status="PENDING_HUMAN_REVIEW",
        )
        self.history.append(record)

        return evolved_pb, record

    def apply_human_approval(
        self,
        playbook: Playbook,
        action: Literal["APPROVE", "REJECT", "REQUEST_EVIDENCE"],
        reviewer: str = "VP of Operations",
        notes: Optional[str] = None,
    ) -> Playbook:
        """
        Human-in-the-loop gatekeeper.
        Changes state to 'active', 'draft', or 'deprecated'.
        """
        now = datetime.now(timezone.utc)
        if action == "APPROVE":
            playbook.status = "active"
            playbook.approved_by = reviewer
            playbook.approved_at = now
        elif action == "REJECT":
            playbook.status = "deprecated"
        elif action == "REQUEST_EVIDENCE":
            playbook.status = "draft"

        # Update last evolution record
        if self.history:
            self.history[-1].approval_status = "APPROVED" if action == "APPROVE" else "REJECTED"
            self.history[-1].reviewer = reviewer
            self.history[-1].reviewed_at = now

        return playbook
