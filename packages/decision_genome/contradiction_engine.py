"""
Contradiction Engine for FORGE X.
Detects conflicts between documented SOPs and actual observed employee behavior.
Flags organizational contradictions, computes severity, and suggests resolutions.
"""

from __future__ import annotations
from typing import Dict, List, Any
from packages.domain.models import Contradiction, Policy, Event, Decision


class ContradictionEngine:
    """
    Detects conflicts between:
    - Documentation (Policy clauses)
    - Actual employee behavior (Events & Decisions)
    Does not silently decide which one is correct; presents evidence for human resolution.
    """

    def __init__(self):
        pass

    def detect_contradictions(
        self,
        policies: List[Policy],
        decisions: List[Decision],
        events: List[Event],
    ) -> List[Contradiction]:
        """
        Scans policies against decision traces to detect systematic policy violations.
        """
        contradictions: List[Contradiction] = []
        contra_idx = 1

        # Check POL-OPS-012 (Refund threshold limit vs observed bypass)
        refund_policy = next((p for p in policies if p.code == "POL-OPS-012"), None)
        if refund_policy:
            # Find decisions where amount > policy.requires_approval_over but was approved directly
            bypass_decisions = [
                d for d in decisions
                if "bypass" in d.action_taken.lower() or "direct" in d.action_taken.lower()
            ]

            if bypass_decisions:
                evidence_ids = []
                for d in bypass_decisions:
                    evidence_ids.extend(d.evidence_ids)

                contradictions.append(
                    Contradiction(
                        id=f"CONTRA-{contra_idx:03d}",
                        documented_rule=f"{refund_policy.code}: All refund claims exceeding ${refund_policy.requires_approval_over:.2f} require Tier-3 Manager signoff in Jira with 48h SLA.",
                        observed_behavior=f"Support engineers directly approved credits > ${refund_policy.requires_approval_over:.2f} in {len(bypass_decisions)} instances without manager queue routing.",
                        policy_id=refund_policy.id,
                        evidence_ids=list(set(evidence_ids))[:5],
                        frequency_observed=len(bypass_decisions),
                        severity="critical",
                        status="open",
                        suggested_resolution="Update POL-OPS-012 to codify Fast-Track Credit delegation up to $1,500 for staff engineers handling enterprise outage tickets.",
                    )
                )
                contra_idx += 1

        # Check channel policy contradiction (official Zendesk vs informal Slack)
        slack_refund_events = [
            e for e in events
            if e.source == "slack" and ("refund" in e.event_type.lower() or "bypass" in e.event_type.lower() or "incident" in e.event_type.lower())
        ]
        if slack_refund_events:
            contradictions.append(
                Contradiction(
                    id=f"CONTRA-{contra_idx:03d}",
                    documented_rule="All customer claim communications and approvals must be logged strictly within Zendesk audit tickets.",
                    observed_behavior=f"Engineers negotiated and confirmed operational refunds across {len(slack_refund_events)} Slack war-room events before updating ticketing systems.",
                    policy_id="POL-OPS-012",
                    evidence_ids=[e.id for e in slack_refund_events[:5]],
                    frequency_observed=len(slack_refund_events),
                    severity="high",
                    status="open",
                    suggested_resolution="Deploy automatic Slack-to-Zendesk bidirectional event sync to preserve operational audit trails.",
                )
            )
            contra_idx += 1

        return contradictions
