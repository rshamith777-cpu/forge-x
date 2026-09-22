"""
Unit and benchmark tests for FORGE X Retrieval Engine.
Verifies sub-10ms latency, semantic search, metadata filtering, and empirical metrics.
"""

import pytest
import asyncio
from packages.retrieval.local_engine import LocalDeterministicRetrievalEngine
from packages.retrieval.moss_adapter import MossRetrievalEngine


@pytest.mark.asyncio
async def test_retrieval_indexing_and_search():
    engine = LocalDeterministicRetrievalEngine()

    policies = [
        {
            "id": "POL-OPS-012",
            "clause_text": "Refunds over $500 require Tier-3 Manager approval in Jira. SLA is 48 business hours.",
            "category": "billing",
            "tier": "standard"
        },
        {
            "id": "POL-SLA-ENT",
            "clause_text": "Enterprise clients experiencing production disruption receive fast-track executive notification within 15 minutes.",
            "category": "service_assurance",
            "tier": "enterprise"
        },
        {
            "id": "POL-SEC-004",
            "clause_text": "Immediate revocation of leaked OAuth credentials without customer notification.",
            "category": "security",
            "tier": "all"
        }
    ]

    indexed = await engine.index_documents("policies", policies)
    assert indexed == 3

    # Semantic query
    results = await engine.search(
        collection="policies",
        query="customer demanding $750 refund after outage",
        top_k=2
    )

    assert len(results) > 0
    assert results[0].id == "POL-OPS-012"
    # Verify sub-10ms latency
    assert results[0].latency_ms < 10.0


@pytest.mark.asyncio
async def test_metadata_filtering():
    engine = LocalDeterministicRetrievalEngine()

    decisions = [
        {"id": "DEC-001", "situation": "Enterprise refund approval bypass", "tier": "enterprise", "amount": 850},
        {"id": "DEC-002", "situation": "Standard tier refund rejection", "tier": "starter", "amount": 150},
        {"id": "DEC-003", "situation": "Enterprise credit granted for latency burst", "tier": "enterprise", "amount": 1200},
    ]

    await engine.index_documents("decisions", decisions)

    # Filter by enterprise tier only
    results = await engine.search(
        collection="decisions",
        query="refund granted",
        top_k=5,
        filters={"tier": "enterprise"}
    )

    assert len(results) == 2
    for r in results:
        assert r.metadata["tier"] == "enterprise"


@pytest.mark.asyncio
async def test_empirical_latency_metrics():
    engine = LocalDeterministicRetrievalEngine()

    cases = [{"id": f"C-{i}", "text": f"Customer support case regarding shard downtime in region {i}"} for i in range(50)]
    await engine.index_documents("cases", cases)

    # Run 20 queries to benchmark real percentiles
    for i in range(20):
        await engine.search("cases", f"downtime shard {i % 5}", top_k=3)

    metrics = engine.get_metrics()
    assert metrics.total_queries == 20
    assert metrics.p50_latency_ms > 0.0
    assert metrics.p50_latency_ms < 10.0  # Must be sub-10ms
    assert metrics.p95_latency_ms >= metrics.p50_latency_ms
    assert metrics.p99_latency_ms >= metrics.p95_latency_ms
