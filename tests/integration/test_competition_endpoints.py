"""
Integration tests for competition upgrade endpoints:
Red Team, Explain Decision, FORGE LAB, Knowledge Health, and Causal Chain.
"""

from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)


def test_red_team_endpoints():
    res = client.post("/api/red-team/run")
    assert res.status_code == 200
    data = res.json()
    assert data["v1_robustness_pct"] == 33.0
    assert data["v2_robustness_pct"] == 94.0

    res_get = client.get("/api/red-team/evolution")
    assert res_get.status_code == 200
    assert res_get.json()["v1_robustness_pct"] == 33.0


def test_explain_decision_endpoint():
    res = client.get("/api/explain-decision/DEC-0001")
    assert res.status_code == 200
    data = res.json()
    assert data["decision_id"] == "DEC-0001"
    assert "decision_genome" in data
    assert "governing_policy" in data
    assert "retrieved_evidence" in data
    assert data["retrieved_evidence"]["status"] == "VALIDATED PROVENANCE"


def test_forge_lab_benchmarks():
    res = client.post("/api/lab/run-tests")
    assert res.status_code == 200
    data = res.json()
    assert len(data["tests"]) == 6
    for t in data["tests"]:
        assert "benchmark_provenance" in t
        assert "Seeded benchmark" in t["benchmark_provenance"]
    assert "retrieval_fabric" in data


def test_knowledge_health():
    res = client.get("/api/knowledge-health")
    assert res.status_code == 200
    data = res.json()
    assert "overall_health_score" in data
    assert "knowledge_items" in data
    assert len(data["unknown_unknowns"]) > 0


def test_simulation_causal_chain():
    res = client.get("/api/simulation/causal-chain?threshold_amount=1500")
    assert res.status_code == 200
    data = res.json()
    assert len(data["causal_nodes"]) == 6
    assert "Changing one policy changes the whole organization" in data["core_insight"]
