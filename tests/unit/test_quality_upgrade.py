"""
Quality Upgrade Automated Test Suite for FORGE X.
Tests all 9 required verification areas:
1. FORGE LAB metric calculations
2. Red Team structured result (5 canonical scenarios, 9-point audit schema)
3. V1 vs V2 evaluation
4. Temporal isolation & zero future-data leakage
5. Candidate V2 quarantine
6. Human approval requirement
7. Organizational Memory promotion
8. Moss evidence propagation
9. Latency telemetry measurement
"""

import pytest
import asyncio
from datetime import datetime, timezone

from packages.domain.models import (
    StructuredAttackScenario,
    DecisionTrace,
    Playbook,
    GovernanceState,
)
from packages.agents.adversarial import get_structured_scenarios, AdversarialAgent
from packages.evaluation.harness import (
    calculate_v1_v2_comparison,
    EvaluationHarness,
)
from packages.decision_engine.engine import DecisionEngine
from apps.api.main import org_memory, retrieval_engine, load_dataset

# Ensure test dataset is loaded
load_dataset()


# --- 1. FORGE LAB Metric Calculations ---
def test_forge_lab_metric_calculations():
    result = calculate_v1_v2_comparison(
        temporal_isolation_enabled=True,
        iterations=100
    )
    assert "metrics_table" in result
    metrics = result["metrics_table"]
    assert len(metrics) == 6
    names = [m["metric"] for m in metrics]
    assert "Decision Accuracy" in names
    assert "Policy Compliance" in names
    assert "Attack Resistance" in names
    assert "Regression Rate" in names
    assert "Recovery Rate" in names
    assert "Evidence Grounding" in names

    acc_metric = next(m for m in metrics if m["metric"] == "Decision Accuracy")
    assert acc_metric["v1"] == 81.4
    assert acc_metric["v2"] == 97.2
    assert acc_metric["status"] == "IMPROVED"


# --- 2. Red Team Structured Results (5 Scenarios & 9 Schema Fields) ---
def test_red_team_structured_scenarios():
    scenarios = get_structured_scenarios()
    assert len(scenarios) == 5

    attack_ids = [s.attack_id for s in scenarios]
    assert "ATK-SCENARIO-01" in attack_ids
    assert "ATK-SCENARIO-02" in attack_ids
    assert "ATK-SCENARIO-03" in attack_ids
    assert "ATK-SCENARIO-04" in attack_ids
    assert "ATK-SCENARIO-05" in attack_ids

    for s in scenarios:
        assert isinstance(s, StructuredAttackScenario)
        # Verify 9 key audit fields
        assert s.attack_name
        assert s.expected_behavior
        assert s.observed_behavior
        assert s.failure_detected is not None
        assert s.root_cause
        assert s.impact
        assert s.candidate_mitigation
        assert s.candidate_playbook_v2
        assert s.status in ("HARDENED_IN_V2", "VERIFIED", "QUARANTINED")
        # Verify 5-step flow presence
        assert len(s.flow_steps) == 5
        assert "Attack" in s.flow_steps[0] or "ATTACK" in s.flow_steps[0]


# --- 3. V1 vs V2 Evaluation ---
def test_v1_vs_v2_evaluation():
    res = calculate_v1_v2_comparison(
        temporal_isolation_enabled=True,
        iterations=100
    )
    assert res["scenarios_tested"] == 100
    assert res["temporal_isolation"]["status"] == "PASS"
    assert res["temporal_isolation"]["future_data_leakage"] == 0
    assert "metrics_table" in res
    assert len(res["metrics_table"]) == 6


# --- 4. Temporal Isolation & Zero Future-Data Leakage ---
def test_temporal_isolation_enforcement():
    # When enabled, cutoff is strictly enforced and future data leakage is 0
    res_isolated = calculate_v1_v2_comparison(temporal_isolation_enabled=True)
    assert res_isolated["temporal_isolation"]["status"] == "PASS"
    assert res_isolated["temporal_isolation"]["future_data_leakage"] == 0

    # When disabled, future leakage is flagged
    res_leaked = calculate_v1_v2_comparison(temporal_isolation_enabled=False)
    assert res_leaked["temporal_isolation"]["status"] == "FAIL"
    assert res_leaked["temporal_isolation"]["future_data_leakage"] > 0


# --- 5. Candidate V2 Quarantine ---
def test_candidate_v2_quarantined_by_default():
    load_dataset()
    active_pb = org_memory.get_active_playbook()
    assert active_pb is not None
    assert active_pb.version.startswith("1")

    candidate = org_memory.get_candidate_playbook()
    assert candidate is not None
    assert candidate.status in ("DRAFT_CANDIDATE", "LAB_TESTED", "PENDING_HUMAN_REVIEW", "QUARANTINED")


# --- 6. Human Approval Requirement ---
def test_human_approval_requirement():
    candidate = org_memory.get_candidate_playbook()
    assert candidate is not None
    # Prior to explicit approval execution, candidate is not promoted
    assert candidate.status != "APPROVED"


# --- 7. Organizational Memory Promotion ---
def test_organizational_memory_promotion():
    candidate = org_memory.get_candidate_playbook()
    assert candidate is not None

    # Execute human operations approval
    promoted = org_memory.approve_candidate_playbook(
        candidate_id=candidate.candidate_id,
        reviewer="Sarah Jenkins (VP of Operations)",
        notes="Empirically verified in FORGE LAB with 94% defense rate."
    )
    assert candidate.status == "APPROVED"
    assert promoted.version.startswith("2")

    # Now active playbook must reflect the promoted hardened V2
    active = org_memory.get_active_playbook()
    assert active.version.startswith("2")

    # Teardown / Reset memory so other integration tests have clean V1 baseline
    load_dataset()


# --- 8. Moss Evidence Propagation into Decision Trace ---
@pytest.mark.asyncio
async def test_moss_evidence_propagation():
    from httpx import AsyncClient, ASGITransport
    from apps.api.main import app, DATASTORE, retrieval_engine

    if not retrieval_engine.local_engine.collections.get("policies") and DATASTORE["policies"]:
        await retrieval_engine.index_documents("policies", DATASTORE["policies"])


    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/decide", json={
            "situation": "Enterprise customer requesting $750 SLA credit after service degradation",
            "customer_tier": "enterprise",
            "claimed_amount": 750.0,
            "incident_active": True,
            "signals": {"duration_hours": 2.5, "mrr": 45000.0}
        })
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "COMPLETED"
        assert data["decision_id"].startswith("DEC-")
        trace = data["trace"]
        assert len(trace["applicable_policies"]) > 0
        assert trace["governance_state"] in ("EXECUTED", "PENDING_REVIEW", "ESCALATED")
        assert data["moss_retrieval_latency_ms"] >= 0.0



# --- 9. Latency Telemetry Measurement ---
@pytest.mark.asyncio
async def test_latency_telemetry_measured():
    from httpx import AsyncClient, ASGITransport
    from apps.api.main import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/decide", json={
            "situation": "Pro customer asking for refund",
            "customer_tier": "pro",
            "claimed_amount": 250.0,
            "incident_active": True,
        })
        assert res.status_code == 200
        data = res.json()
        assert data["moss_retrieval_latency_ms"] >= 0.0
        assert data["total_latency_ms"] >= 0.0
        assert data["total_latency_ms"] >= data["moss_retrieval_latency_ms"]

