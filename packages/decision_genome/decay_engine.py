"""
Knowledge Decay & Context Gravity Engine for FORGE X.
Tracks operational freshness of playbooks, genomes, and evidence.
Calculates dynamic Context Gravity scores based on recency, frequency, and business impact.
"""

from __future__ import annotations
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from packages.domain.models import ContextGravityScore, Playbook, DecisionGenome, Contradiction


class KnowledgeDecayEngine:
    """
    Evaluates institutional knowledge freshness.
    When policies age, contradiction counts mount, or last validation exceeds threshold,
    flags playbooks with WARNING: REVALIDATION REQUIRED.
    """

    def __init__(self, max_stale_days: int = 30):
        self.max_stale_days = max_stale_days

    def evaluate_playbook_decay(
        self,
        playbook: Playbook,
        contradictions: List[Contradiction],
        last_observed_use: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """
        Calculates freshness percentage, contradiction penalty, and revalidation status.
        """
        now = datetime.now(timezone.utc)
        created = playbook.created_at
        age_days = max(0, (now - created).days)

        # Freshness base calculation (decays linearly over 90 days)
        freshness_pct = max(10, int(100 - (age_days / 90.0) * 100))

        # Contradiction count penalty
        relevant_contradictions = [c for c in contradictions if c.status == "open"]
        contra_count = len(relevant_contradictions)
        freshness_pct = max(5, freshness_pct - (contra_count * 15))

        revalidation_required = freshness_pct < 60 or contra_count >= 2

        status_label = "HEALTHY"
        if freshness_pct < 45 or contra_count >= 3:
            status_label = "CRITICAL — DECAY EXCEEDED"
        elif revalidation_required:
            status_label = "WARNING — REVALIDATION REQUIRED"

        return {
            "playbook_id": playbook.id,
            "playbook_version": playbook.version,
            "evidence_freshness_pct": freshness_pct,
            "recent_contradictions": contra_count,
            "age_days": age_days,
            "last_observed_use": (last_observed_use or now).isoformat(),
            "status": status_label,
            "revalidation_required": revalidation_required,
            "recommended_action": "Initiate automated adversarial stress test and solicit expert resolution." if revalidation_required else "Playbook within healthy operational boundaries."
        }

    @staticmethod
    def calculate_context_gravity(
        event_type: str,
        source: str,
        is_enterprise: bool = False,
        is_incident: bool = False,
        age_minutes: float = 0.0,
    ) -> ContextGravityScore:
        """
        Calculates dynamic Context Gravity:
        - README / background sync: low gravity (~0.2)
        - Customer ticket / message: medium gravity (~0.5)
        - Customer escalation / outage: high gravity (~0.85)
        - Production incident + enterprise breach: critical gravity (~0.95)
        """
        recency = max(0.1, 1.0 - (age_minutes / 1440.0))  # Decays over 24h
        business_impact = 0.95 if is_enterprise else 0.4
        policy_relevance = 0.85 if is_incident else 0.3

        if "incident" in event_type.lower() or "bypass" in event_type.lower() or "disruption" in event_type.lower():
            base_score = 0.85
        elif "refund" in event_type.lower() or "escalate" in event_type.lower():
            base_score = 0.70
        elif source in ["slack", "zendesk"]:
            base_score = 0.50
        else:
            base_score = 0.20

        # Weighted gravity score
        score = (base_score * 0.4) + (recency * 0.2) + (business_impact * 0.25) + (policy_relevance * 0.15)
        score = round(min(1.0, max(0.05, score)), 2)

        tier = "low"
        if score >= 0.85:
            tier = "critical"
        elif score >= 0.70:
            tier = "high"
        elif score >= 0.45:
            tier = "medium"

        return ContextGravityScore(
            score=score,
            tier=tier,
            recency_weight=round(recency, 2),
            frequency_weight=0.7,
            business_impact=round(business_impact, 2),
            policy_relevance=round(policy_relevance, 2),
            explanation=f"Gravity determined by {event_type} event on {source} with tier={tier}."
        )
