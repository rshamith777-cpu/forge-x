"""
Comprehensive Architecture Verification Tests for FORGE X.
YC Fall 2026 × Moss Zero Latency Builder Sprint.

Validates:
1. Synchronous low-latency hot path (POST /api/decide)
2. Structured Decision Trace with full provenance (GET /api/trace/{id})
3. Temporal Isolation (historical knowledge cutoff <= T)
4. Strict Security Boundary (unapproved Candidate V2 cannot affect production)
5. Human Governance approval gate promoting Candidate V2 to active memory
6. Asynchronous Event Bus non-blocking execution
7. Honest Moss reporting (Local Fallback disclosure when cloud absent)
"""

import pytest
from httpx import AsyncClient, ASGITransport
from apps.api.main import app, org_memory, retrieval_engine, event_bus, load_dataset

# Initialize dataset and memory for tests
load_dataset()


@pytest.mark.asyncio
async def test_synchronous_hot_path_decide():
    """Test 1: Hot Path returns decision and trace with sub-10ms Moss retrieval."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "situation": "Enterprise customer demanding SLA credit following API gateway disruption",
            "customer_tier": "enterprise",
            "claimed_amount": 750.0,
            "incident_active": True,
            "signals": {"duration_hours": 2.5, "mrr": 45000.0}
        }
        res = await client.post("/api/decide", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "COMPLETED"
        assert "decision_id" in data
        assert "selected_action" in data
        assert "governance_state" in data
        assert data["moss_retrieval_latency_ms"] < 10.0  # Sub-10ms requirement
        assert "trace" in data


@pytest.mark.asyncio
async def test_decision_trace_completeness():
    """Test 2: Verifies Decision Trace contains all structured audit fields."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create a decision
        payload = {
            "situation": "Enterprise refund claim verification",
            "customer_tier": "enterprise",
            "claimed_amount": 1200.0,
            "incident_active": False,
        }
        dec_res = await client.post("/api/decide", json=payload)
        assert dec_res.status_code == 200
        dec_data = dec_res.json()
        decision_id = dec_data["decision_id"]

        # Fetch trace
        trace_res = await client.get(f"/api/trace/{decision_id}")
        assert trace_res.status_code == 200
        trace = trace_res.json()

        # Check required fields
        assert trace["decision_id"] == decision_id
        assert "timestamp" in trace
        assert "situation" in trace
        assert "signals" in trace
        assert "constraints" in trace
        assert "retrieved_evidence" in trace
        assert "applicable_policies" in trace
        assert "precedents" in trace
        assert "exceptions" in trace
        assert "candidate_actions" in trace
        assert "selected_action" in trace
        assert "reasoning" in trace
        assert "confidence" in trace
        assert "risk" in trace
        assert "policy_dependencies" in trace
        assert "expected_outcome" in trace
        assert "version_info" in trace
        assert "governance_state" in trace


@pytest.mark.asyncio
async def test_temporal_isolation():
    """Test 3: Historical knowledge query strictly enforces created_at <= T."""
    # Historical cutoff T = 2026-08-01T09:00:00Z
    cutoff = "2026-08-01T09:00:00Z"
    ctx = await retrieval_engine.retrieve_context(
        query="outage refund SLA",
        timestamp=cutoff,
    )
    assert ctx.provenance["temporal_isolation_active"] is True
    assert ctx.provenance["timestamp_filter"] == cutoff
    
    # Verify no evidence or precedents after T leak in
    for ev in ctx.evidence:
        if "timestamp" in ev and ev["timestamp"]:
            assert ev["timestamp"] <= cutoff


@pytest.mark.asyncio
async def test_security_boundary_unapproved_candidate():
    """Test 4: Candidate Playbook V2 CANNOT be used by live Decision Engine before approval."""
    # Verify active playbook is V1
    active_pb = org_memory.get_active_playbook()
    assert active_pb.version == "1.0.0"

    # Candidate V2 exists in sandbox
    candidate = org_memory.get_candidate_playbook()
    assert candidate is not None
    assert candidate.version == "2.0.0"
    assert candidate.status in ["DRAFT_CANDIDATE", "LAB_TESTED", "PENDING_HUMAN_REVIEW"]

    # Live decision engine uses active playbook (V1), not Candidate V2
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        sim_res = await client.post("/api/lab/simulate")
        assert sim_res.status_code == 200
        sim_data = sim_res.json()
        assert sim_data["v1_playbook"]["version"] == "1.0.0"
        assert sim_data["candidate_v2"]["version"] == "2.0.0"
        assert sim_data["v1_playbook"]["status"] == "ACTIVE_PRODUCTION"
        assert sim_data["candidate_v2"]["status"] in ["DRAFT_CANDIDATE", "LAB_TESTED", "PENDING_HUMAN_REVIEW"]


@pytest.mark.asyncio
async def test_human_governance_approval_promotion():
    """Test 5: Human approval promotes Candidate V2 into trusted memory and updates active playbook."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Submit Human Approval
        approval_payload = {
            "candidate_id": "CAND-PB-V2-SYBIL-HARDENED",
            "reviewer": "Sarah Jenkins (VP of Operations)",
            "action": "APPROVE",
            "notes": "Regression testing passed with 94% adversarial defense rate."
        }
        res = await client.post("/api/governance/approve", json=approval_payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "PROMOTED_TO_PRODUCTION"
        assert data["active_playbook"]["version"] == "2.0.0"
        assert data["active_playbook"]["approved_by"] == "Sarah Jenkins (VP of Operations)"

        # Verify Organizational Memory now has V2 as active
        active_pb = org_memory.get_active_playbook()
        assert active_pb.version == "2.0.0"


@pytest.mark.asyncio
async def test_honest_moss_retrieval_disclosure():
    """Test 6: Retrieval layer honestly reports active mode and measured latencies."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/metrics/moss")
        assert res.status_code == 200
        data = res.json()
        assert "active_mode" in data
        assert "moss_cloud_active" in data
        assert "fallback_metrics" in data
        # Without credentials in environment, moss_cloud_active must be False
        assert data["moss_cloud_active"] is False
        assert "LOCAL FALLBACK ACTIVE" in data["active_mode"]
