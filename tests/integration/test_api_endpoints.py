"""
Integration tests for FORGE X Backend API endpoints.
Verifies all REST endpoints using FastAPI TestClient.
"""

import pytest
from fastapi.testclient import TestClient
from apps.api.main import app, load_dataset

# Load dataset for testing
load_dataset()
client = TestClient(app)


def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "moss_retrieval" in data
    assert data["dataset_summary"]["events_loaded"] >= 1000


def test_api_moss_metrics():
    res = client.get("/api/metrics/moss")
    assert res.status_code == 200
    data = res.json()
    assert "p50_latency_ms" in data
    assert data["sub_10ms_guarantee_met"] is True


def test_api_command_center():
    res = client.get("/api/command-center")
    assert res.status_code == 200
    data = res.json()
    assert "organization" in data
    assert "playbook_health" in data
    assert len(data["emerging_anomalies"]) > 0


def test_api_archaeology():
    res = client.get("/api/archaeology")
    assert res.status_code == 200
    data = res.json()
    assert data["documented_workflow"] is not None
    assert data["discovered_workflow"] is not None
    assert "conformance_report" in data


def test_api_decision_genomes():
    res = client.get("/api/genomes")
    assert res.status_code == 200
    data = res.json()
    assert data["total_genomes"] >= 1
    genome_id = data["genomes"][0]["id"]

    res_detail = client.get(f"/api/genomes/{genome_id}")
    assert res_detail.status_code == 200
    assert res_detail.json()["id"] == genome_id


def test_api_fork_reality():
    payload = {
        "threshold_amount": 1500.0,
        "auto_approve_enterprise": True,
        "sla_escalation_hours": 24.0,
        "require_manager_approval": False,
        "fraud_check_strictness": 0.85,
        "iterations": 500,
    }
    res = client.post("/api/fork-reality", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "current_policy" in data
    assert "modified_policy" in data
    assert "tradeoff_summary" in data
    assert len(data["pareto_frontier"]) == 5
    # Speed improvement should be positive
    assert data["tradeoff_summary"]["speed_improvement_hours"] > 0


def test_api_playbooks_and_approval():
    res = client.get("/api/playbooks")
    assert res.status_code == 200
    data = res.json()
    assert len(data["playbooks"]) >= 2
    pb_id = data["playbooks"][1]["id"]

    # Submit approval
    approval_payload = {
        "action": "APPROVE",
        "reviewer": "Benjamin Clark (VP CX)",
        "notes": "Approved for enterprise fast track",
    }
    res_app = client.post(f"/api/playbooks/{pb_id}/approval", json=approval_payload)
    assert res_app.status_code == 200
    assert res_app.json()["playbook"]["status"] == "active"


def test_api_stress_test():
    res_pb = client.get("/api/playbooks")
    pb_id = res_pb.json()["playbooks"][0]["id"]

    res = client.post(f"/api/playbooks/{pb_id}/stress-test")
    assert res.status_code == 200
    data = res.json()
    assert data["scenarios_tested"] == 3


def test_api_apprenticeship_evaluate():
    payload = {
        "user_action": "direct_executive_credit_bypass",
        "scenario_situation": "Enterprise client with $750 credit request",
    }
    res = client.post("/api/apprenticeship/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["did_align"] is True
    assert data["alignment_score"] == 1.0


def test_api_execute_live():
    payload = {
        "customer_tier": "enterprise",
        "claimed_amount": 750.0,
        "outage_disruption_hours": 2.5,
        "incident_active": True,
        "account_mrr": 48000.0,
    }
    res = client.post("/api/execute-live", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["execution_status"] == "COMPLETED"
    assert "moss_retrieval_latency_ms" in data
    assert "trace" in data
