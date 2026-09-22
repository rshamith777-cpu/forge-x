"""
Unit tests for Discrete-Event Simulation Engine, Fork Reality, and Pareto Analysis.
"""

import pytest
from packages.simulation.engine import (
    DiscreteEventSimulationEngine,
    RuleConfiguration,
)
from packages.simulation.pareto import ParetoAnalyzer, ParetoPoint


def test_simulation_branch_execution():
    engine = DiscreteEventSimulationEngine(base_seed=42)

    rule = RuleConfiguration(
        threshold_amount=500.0,
        auto_approve_enterprise=False,
        sla_escalation_hours=48.0,
        require_manager_approval=True,
    )

    res = engine.simulate_branch("Current Policy", rule, scenario_type="baseline", iterations=500)

    assert res.iterations == 500
    assert res.branch_name == "Current Policy"
    assert res.success_rate > 0.5
    assert res.avg_duration_hours > 5.0  # Manager queue incurs delay
    assert len(res.downstream_effects) > 0


def test_fork_reality_comparison():
    engine = DiscreteEventSimulationEngine(base_seed=42)

    current_rule = RuleConfiguration(
        threshold_amount=500.0,
        auto_approve_enterprise=False,
        require_manager_approval=True,
    )

    modified_rule = RuleConfiguration(
        threshold_amount=1500.0,
        auto_approve_enterprise=True,  # Instant credit for enterprise
        require_manager_approval=False,
        fraud_check_strictness=0.85,
    )

    fork = engine.fork_reality(current_rule, modified_rule, iterations=1000)

    assert fork.current_policy.branch_name == "Current Policy"
    assert fork.modified_policy.branch_name == "Modified Policy"

    # Modified policy should be significantly faster
    assert fork.modified_policy.avg_duration_hours < fork.current_policy.avg_duration_hours
    # Modified policy should have higher CSAT
    assert fork.modified_policy.csat_score > fork.current_policy.csat_score

    # Verify all 5 reality branches are present
    assert fork.conservative_scenario is not None
    assert fork.adversarial_scenario is not None
    assert fork.worst_case_scenario is not None
    assert "speed_improvement_hours" in fork.tradeoff_summary
    assert len(fork.pareto_frontier) == 5


def test_pareto_analyzer():
    analyzer = ParetoAnalyzer()

    p1 = ParetoPoint(name="Policy A", cost=100.0, duration_hours=2.0, risk=0.1, workload=5.0, csat=4.8)
    p2 = ParetoPoint(name="Policy B (Dominated by A)", cost=200.0, duration_hours=10.0, risk=0.5, workload=20.0, csat=3.2)
    p3 = ParetoPoint(name="Policy C (Cheaper but slower)", cost=50.0, duration_hours=15.0, risk=0.2, workload=10.0, csat=4.0)

    frontier = analyzer.compute_frontier([p1, p2, p3])

    assert frontier[0].is_non_dominated is True   # Policy A
    assert frontier[1].is_non_dominated is False  # Policy B dominated
    assert frontier[2].is_non_dominated is True   # Policy C trade-off
