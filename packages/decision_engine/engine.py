"""
FORGE X Decision Engine.
Implements the Synchronous Low-Latency Hot Path:
User/Event -> Gateway -> Moss Retrieval -> Decision Context Builder ->
Decision Engine -> Decision Trace / Decision Genome -> Human Governance Hub -> Execution.
"""

from __future__ import annotations
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from packages.domain.models import Decision, DecisionTrace, GovernanceState
from packages.retrieval.service import RetrievalContextResult
from packages.retrieval.moss_adapter import MossRetrievalEngine
from packages.memory.organizational_memory import OrganizationalMemory
from packages.events.bus import AsyncEventBus


class DecisionEngine:
    """
    Lightweight, synchronous Decision Engine for the hot path.
    Consumes retrieved organizational context from Moss and produces
    structured Decision Traces without running expensive adversarial loops.
    """

    def __init__(
        self,
        retrieval_engine: MossRetrievalEngine,
        memory: OrganizationalMemory,
        event_bus: Optional[AsyncEventBus] = None,
    ):
        self.retrieval = retrieval_engine
        self.memory = memory
        self.event_bus = event_bus

    async def decide(
        self,
        situation: str,
        signals: Optional[Dict[str, Any]] = None,
        customer_tier: str = "enterprise",
        claimed_amount: float = 750.0,
        incident_active: bool = True,
        timestamp: Optional[str] = None,
        organization_id: str = "ApexCloud",
        policy_scope: str = "billing",
    ) -> DecisionTrace:
        """
        Executes the Synchronous Hot Path:
        1. Query Moss Retrieval Layer for policies, precedents, exceptions.
        2. Build Decision Context.
        3. Evaluate constraints & candidate actions against active Playbook.
        4. Determine Human Governance routing.
        5. Generate cryptographic Decision Trace.
        6. Asynchronously publish to Event Bus.
        """
        start_ns = time.perf_counter_ns()
        signals = signals or {}
        signals.setdefault("tier", customer_tier)
        signals.setdefault("amount_claimed", claimed_amount)
        signals.setdefault("outage_active", incident_active)

        # Step 1: Moss Retrieval Layer (sub-10ms)
        query = f"{customer_tier} refund claim ${claimed_amount} outage {signals.get('duration_hours', 2.0)}h {situation}"
        ctx: RetrievalContextResult = await self.retrieval.retrieve_context(
            query=query,
            timestamp=timestamp,
            organization_id=organization_id,
            policy_scope=policy_scope,
            top_k=3
        )
        moss_latency = ctx.measured_latency_ms

        # Step 2: Context Builder & Playbook Matching
        active_pb = self.memory.get_active_playbook()
        active_genome = self.memory.get_active_genome()

        constraints = [
            "POL-OPS-012: Manager approval required for claims > $1,000" if (not active_pb or active_pb.version.startswith("1")) else "POL-OPS-012-V2: Automated credit authorized up to $1,500 for enterprise tenants",
            "Statutory CFO signoff mandated for amounts > $2,500",
        ]

        # Step 3: Evaluate Exceptions & Attack Signals
        # Sybil defense check
        cluster_entropy = float(signals.get("subnet_cluster_entropy", 1.0))
        burst_count = int(signals.get("claims_in_last_10m", 1))
        is_sybil_threat = cluster_entropy < 0.45 or burst_count > 2
        is_chargeback_threat = bool(signals.get("chargeback_threat", False))

        # Check if active genome has the Sybil exception
        has_sybil_rule = False
        if active_genome:
            for exc in active_genome.exceptions:
                exc_id = exc.id if hasattr(exc, "id") else exc.get("id")
                if exc_id == "EXC-FRAUD-SYBIL":
                    has_sybil_rule = True
                    break

        candidate_actions = [
            {
                "action_name": "instant_direct_credit_issued",
                "description": f"Issue immediate ${claimed_amount:.2f} billing credit via Stripe",
                "estimated_cost": claimed_amount,
                "risk_level": "low" if not is_sybil_threat else "critical",
                "authority_required": "Tier-1 Automated Clearance",
            },
            {
                "action_name": "queue_for_manager_approval",
                "description": "Hold claim and route to Tier-2 Operations Lead queue",
                "estimated_cost": 0.0,
                "risk_level": "medium",
                "authority_required": "Manager Sign-off Required",
            },
            {
                "action_name": "halt_and_route_to_security_verification",
                "description": "Quarantine claim and enforce multi-factor identity verification",
                "estimated_cost": 0.0,
                "risk_level": "high",
                "authority_required": "Fraud / Security Investigation",
            },
        ]

        # Step 4: Decision Engine Action Selection
        if is_sybil_threat and has_sybil_rule:
            selected_action = "halt_and_route_to_security_verification"
            reasoning = "EXC-FRAUD-SYBIL triggered: subnet entropy < 0.45 indicates coordinated burst pattern. Instant payout halted."
            confidence = 0.98
            risk = 0.05
            governance_state: GovernanceState = "PENDING_REVIEW"
        elif is_sybil_threat and not has_sybil_rule:
            # V1 Vulnerability: Under V1, the system does not recognize the Sybil pattern and approves sub-threshold amounts!
            if claimed_amount <= 500.0:
                selected_action = "instant_direct_credit_issued"
                reasoning = "Standard automated rule clearance: claim under $500 approved without manager escalation."
                confidence = 0.72
                risk = 0.88
                governance_state = "EXECUTED"
            else:
                selected_action = "queue_for_manager_approval"
                reasoning = "Claim exceeds $500 threshold; queued for human review."
                confidence = 0.85
                risk = 0.40
                governance_state = "PENDING_REVIEW"
        elif is_chargeback_threat:
            selected_action = "queue_for_manager_approval"
            reasoning = "Active dispute / chargeback threat detected. Statutory legal policy requires executive review."
            confidence = 0.95
            risk = 0.35
            governance_state = "ESCALATED"
        elif claimed_amount > 2000.0:
            selected_action = "queue_for_manager_approval"
            reasoning = "Claim exceeds VP discretionary limit ($2,000). Dual executive sign-off required."
            confidence = 0.94
            risk = 0.25
            governance_state = "PENDING_REVIEW"
        elif active_pb and active_pb.version.startswith("2") and claimed_amount <= 1500.0 and customer_tier == "enterprise":
            selected_action = "instant_direct_credit_issued"
            reasoning = "Playbook V2 fast-track policy: enterprise tenant SLA recovery up to $1,500 auto-cleared."
            confidence = 0.96
            risk = 0.08
            governance_state = "EXECUTED"
        elif claimed_amount <= 500.0:
            selected_action = "instant_direct_credit_issued"
            reasoning = "Standard Tier-1 authority limit: claim within $500 auto-clearance threshold."
            confidence = 0.92
            risk = 0.12
            governance_state = "EXECUTED"
        else:
            selected_action = "queue_for_manager_approval"
            reasoning = "Claim exceeds standard $500 auto-approval threshold. Manager sign-off required."
            confidence = 0.89
            risk = 0.20
            governance_state = "PENDING_REVIEW"

        total_latency = round((time.perf_counter_ns() - start_ns) / 1_000_000.0, 3)

        decision_id = f"DEC-{int(time.time() * 1000) % 1000000:06d}"

        # Step 5: Decision Trace Construction
        trace = DecisionTrace(
            decision_id=decision_id,
            timestamp=datetime.now(timezone.utc),
            situation=situation,
            signals=signals,
            constraints=constraints,
            retrieved_evidence=ctx.evidence,
            applicable_policies=ctx.policies,
            precedents=ctx.precedents,
            exceptions=ctx.exceptions,
            candidate_actions=candidate_actions,
            selected_action=selected_action,
            reasoning=reasoning,
            confidence=confidence,
            risk=risk,
            policy_dependencies=[p.get("code") or p.get("id") for p in ctx.policies if isinstance(p, dict)],
            expected_outcome={
                "sla_recovery_achieved": True,
                "churn_prevented": True,
                "payout_amount": claimed_amount if selected_action == "instant_direct_credit_issued" else 0.0,
            },
            version_info={
                "playbook_version": active_pb.version if active_pb else "1.0.0",
                "genome_version": active_genome.version if active_genome else "1.0.0",
                "compiler_version": "FORGE-X-2.1.0",
                "retrieval_mode": ctx.active_mode,
            },
            governance_state=governance_state,
            moss_latency_ms=moss_latency,
            total_latency_ms=total_latency,
        )

        # Record in Memory
        dec_obj = Decision(
            id=decision_id,
            case_id=signals.get("case_id", f"CASE-{decision_id[-4:]}"),
            situation=situation,
            action_taken=selected_action,
            actor_id="FORGE_DECISION_ENGINE",
            actor_role="automated_system",
            timestamp=datetime.now(timezone.utc),
            evidence_ids=[e.get("id", "") for e in ctx.evidence if isinstance(e, dict)],
            matched_genome_id=active_genome.id if active_genome else "GENOME-APEX-BILLING-001",
            rationale=reasoning,
        )
        self.memory.record_decision(dec_obj, trace)

        # Step 6: Asynchronous Event Bus Dispatch (Non-blocking)
        if self.event_bus:
            self.event_bus.publish_nowait(
                topic="DECISION_CREATED",
                payload={
                    "decision_id": decision_id,
                    "situation": situation,
                    "action_taken": selected_action,
                    "governance_state": governance_state,
                    "signals": signals,
                    "risk": risk,
                    "confidence": confidence,
                    "trace_id": decision_id,
                }
            )

        return trace
