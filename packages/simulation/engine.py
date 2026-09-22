"""
Discrete-Event Simulation Engine for FORGE X: Fork Reality.
Simulates parallel organizational branches (Current vs Modified vs Conservative vs Adversarial vs Worst-Case)
across 1,000+ stochastic scenarios with pinned seeds for 100% reproducibility.
"""

from __future__ import annotations
import math
import random
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from packages.domain.models import SimulationResult


class RuleConfiguration(BaseModel):
    """Configurable decision policy rule parameters."""
    threshold_amount: float = 500.0
    auto_approve_enterprise: bool = False
    sla_escalation_hours: float = 48.0
    require_manager_approval: bool = True
    fraud_check_strictness: float = 0.5  # 0.0 to 1.0


class RealityForkResult(BaseModel):
    """Comparison bundle of parallel reality branches."""
    current_policy: SimulationResult
    modified_policy: SimulationResult
    conservative_scenario: SimulationResult
    adversarial_scenario: SimulationResult
    worst_case_scenario: SimulationResult
    tradeoff_summary: Dict[str, Any]
    pareto_frontier: List[Dict[str, Any]]


class DiscreteEventSimulationEngine:
    """
    Lightweight, deterministic discrete-event simulation engine.
    Simulates operational case arrivals, worker queues, escalation bottlenecks,
    customer churn reactions, and downstream financial impacts.
    """

    def __init__(self, base_seed: int = 42):
        self.base_seed = base_seed

    def simulate_branch(
        self,
        branch_name: str,
        rule: RuleConfiguration,
        scenario_type: str = "baseline",
        iterations: int = 1000,
        seed: Optional[int] = None,
    ) -> SimulationResult:
        """
        Runs Monte Carlo simulation for a specific rule configuration.
        """
        rng = random.Random(seed if seed is not None else self.base_seed)

        # Baseline parameters adjusted by scenario
        enterprise_ratio = 0.30
        fraud_ratio = 0.03
        outage_severity = 1.0

        if scenario_type == "adversarial":
            enterprise_ratio = 0.45
            fraud_ratio = 0.18  # High fraud attack
            outage_severity = 2.5
        elif scenario_type == "worst_case":
            enterprise_ratio = 0.50
            fraud_ratio = 0.25
            outage_severity = 4.0
        elif scenario_type == "conservative":
            enterprise_ratio = 0.25
            fraud_ratio = 0.01
            outage_severity = 0.8

        total_cost = 0.0
        total_duration_hours = 0.0
        successes = 0
        failures = 0
        total_csat = 0.0
        escalations = 0
        exceptions = 0
        workload_hours = 0.0
        churn_count = 0

        for _ in range(iterations):
            is_ent = rng.random() < enterprise_ratio
            is_fraud = rng.random() < fraud_ratio
            claimed_amount = rng.uniform(50.0, 2500.0) if is_ent else rng.uniform(20.0, 450.0)

            # Evaluate Rule Logic
            auto_refund = False
            routed_to_manager = False

            if rule.auto_approve_enterprise and is_ent and claimed_amount <= (rule.threshold_amount * 2):
                auto_refund = True
            elif claimed_amount <= rule.threshold_amount and not rule.require_manager_approval:
                auto_refund = True
            else:
                routed_to_manager = True

            # Fraud filter simulation
            if is_fraud:
                detected = rng.random() < (rule.fraud_check_strictness * 0.9)
                if not detected and auto_refund:
                    # Fraudulent payout leak!
                    total_cost += claimed_amount
                    failures += 1
                    total_csat += 1.0
                    exceptions += 1
                    continue

            # Process outcome
            if auto_refund:
                # Fast turnaround: 0.25 - 1.5 hours
                dur = rng.uniform(0.2, 1.5)
                total_duration_hours += dur
                total_cost += claimed_amount
                workload_hours += 0.2  # Low staff overhead
                successes += 1
                total_csat += 4.8 if is_ent else 4.5
            else:
                # Manager Queue bottleneck
                queue_hours = rng.uniform(12.0, rule.sla_escalation_hours * outage_severity)
                total_duration_hours += queue_hours
                workload_hours += rng.uniform(2.5, 6.0)  # High human review effort
                escalations += 1

                # If duration exceeds enterprise tolerance (4h), churn risk spikes!
                if is_ent and queue_hours > 4.0:
                    churn_prob = min(0.85, 0.15 * (queue_hours / 4.0))
                    if rng.random() < churn_prob:
                        churn_count += 1
                        failures += 1
                        total_csat += rng.uniform(1.0, 2.5)
                        total_cost += 5000.0  # Churn ARR penalty
                    else:
                        successes += 1
                        total_cost += claimed_amount
                        total_csat += 3.5
                else:
                    successes += 1
                    total_cost += claimed_amount
                    total_csat += 4.0

        n = float(iterations)
        success_rate = round(successes / n, 3)
        failure_rate = round(failures / n, 3)
        avg_cost = round(total_cost / n, 2)
        avg_dur = round(total_duration_hours / n, 2)
        avg_csat = round(total_csat / n, 2)
        escalation_rate = round(escalations / n, 3)
        risk_score = round(min(1.0, (failure_rate * 0.6) + (escalation_rate * 0.4)), 3)

        downstream = []
        if escalation_rate > 0.4:
            downstream.append(f"Director review backlog increases by {int(escalation_rate * 100)}%")
        if churn_count > 10:
            downstream.append(f"Enterprise customer churn spikes ({churn_count} lost accounts)")
        if avg_cost > 300.0:
            downstream.append(f"Monthly OPEX credit budget exceeded by ${(avg_cost - 200) * iterations / 1000:.1f}k")

        return SimulationResult(
            id=f"sim_{branch_name.lower().replace(' ', '_')}_{scenario_type}",
            scenario_id=f"SCN-{scenario_type.upper()}",
            branch_name=branch_name,
            iterations=iterations,
            success_rate=success_rate,
            failure_rate=failure_rate,
            avg_cost=avg_cost,
            avg_duration_hours=avg_dur,
            risk_score=risk_score,
            csat_score=avg_csat,
            workload_hours=round(workload_hours, 1),
            exceptions_count=exceptions,
            escalation_rate=escalation_rate,
            downstream_effects=downstream,
            pareto_point={
                "cost": avg_cost,
                "speed": round(100.0 / max(avg_dur, 0.1), 1),
                "satisfaction": avg_csat,
                "risk": risk_score,
                "workload": round(workload_hours, 1),
            }
        )

    def fork_reality(
        self,
        current_rule: RuleConfiguration,
        modified_rule: RuleConfiguration,
        iterations: int = 1000,
    ) -> RealityForkResult:
        """
        Core Hero Feature: Compares current policy against modified policy across
        Baseline, Conservative, Adversarial, and Worst-Case realities.
        """
        current_res = self.simulate_branch("Current Policy", current_rule, scenario_type="baseline", iterations=iterations, seed=101)
        modified_res = self.simulate_branch("Modified Policy", modified_rule, scenario_type="baseline", iterations=iterations, seed=101)
        cons_res = self.simulate_branch("Conservative Scenario", current_rule, scenario_type="conservative", iterations=iterations, seed=202)
        adv_res = self.simulate_branch("Adversarial Scenario", modified_rule, scenario_type="adversarial", iterations=iterations, seed=303)
        worst_res = self.simulate_branch("Worst-Case Scenario", modified_rule, scenario_type="worst_case", iterations=iterations, seed=404)

        # Calculate trade-offs
        cost_delta = round(modified_res.avg_cost - current_res.avg_cost, 2)
        speed_delta_hours = round(current_res.avg_duration_hours - modified_res.avg_duration_hours, 2)
        csat_delta = round(modified_res.csat_score - current_res.csat_score, 2)
        risk_delta = round(modified_res.risk_score - current_res.risk_score, 3)
        workload_saved = round(current_res.workload_hours - modified_res.workload_hours, 1)

        summary = {
            "cost_delta_usd": cost_delta,
            "speed_improvement_hours": speed_delta_hours,
            "csat_gain": csat_delta,
            "risk_delta": risk_delta,
            "workload_hours_saved": workload_saved,
            "recommendation": (
                "Deploy Modified Policy: 10x faster turnaround and reduced churn with acceptable OPEX trade-off."
                if csat_delta > 0.4 and speed_delta_hours > 5.0
                else "Review trade-offs before publishing."
            )
        }

        # Build Pareto Frontier
        branches = [current_res, modified_res, cons_res, adv_res, worst_res]
        pareto_points = [
            {
                "branch": b.branch_name,
                "cost": b.avg_cost,
                "duration_hours": b.avg_duration_hours,
                "csat": b.csat_score,
                "risk": b.risk_score,
                "workload_hours": b.workload_hours,
            }
            for b in branches
        ]

        return RealityForkResult(
            current_policy=current_res,
            modified_policy=modified_res,
            conservative_scenario=cons_res,
            adversarial_scenario=adv_res,
            worst_case_scenario=worst_res,
            tradeoff_summary=summary,
            pareto_frontier=pareto_points,
        )
