"""
Unit tests for FORGE X Adversarial Evolution: "WE BROKE OUR OWN AI".
Verifies that V1 fails under Sybil attacks (33% robustness) and V2 hardens (94% robustness).
"""

from packages.agents.adversarial import AdversarialAgent


def test_sybil_burst_red_team_evolution():
    agent = AdversarialAgent()
    narrative = agent.run_sybil_burst_red_team()

    # Verify narrative title and structure
    assert "WE BROKE OUR OWN AI" in narrative.title
    assert "Seeded benchmark / synthetic enterprise environment" in narrative.benchmark_provenance

    # Verify V1 failure (round 1)
    assert narrative.v1_robustness_pct == 33.0
    assert narrative.v1_breached_count == 67
    assert narrative.v1_fraud_loss_usd > 30000.0

    # Verify learning loop
    assert len(narrative.learning_loop) == 6
    assert narrative.mutated_exception["id"] == "EXC-FRAUD-SYBIL"

    # Verify V2 hardening (round 2)
    assert narrative.v2_robustness_pct == 94.0
    assert narrative.v2_breached_count == 6
    assert narrative.v2_fraud_loss_usd < 3000.0

    # Verify sample cases contain bot attacks
    assert len(narrative.sample_cases) > 10
    sample = narrative.sample_cases[0]
    assert sample.synthetic_id.startswith("BOT-SYN-")
    assert sample.claimed_amount < 500.0
