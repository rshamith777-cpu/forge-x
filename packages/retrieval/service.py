"""
Retrieval Service Protocol and Schemas for FORGE X.
Supports semantic similarity, exact metadata filtering, entity filtering,
and real measured latency metrics tracking (P50, P95, P99).
"""

from __future__ import annotations
import time
from typing import Dict, List, Optional, Any, Protocol, runtime_checkable
from pydantic import BaseModel, Field


class SearchResult(BaseModel):
    id: str
    collection: str  # "policies", "cases", "decisions", "exceptions", "events"
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    score: float = Field(ge=0.0, le=1.0)
    latency_ms: float = 0.0


class RetrievalMetrics(BaseModel):
    total_queries: int = 0
    p50_latency_ms: float = 0.0
    p95_latency_ms: float = 0.0
    p99_latency_ms: float = 0.0
    cache_hit_rate: float = 0.0
    avg_context_tokens: int = 0
    engine_name: str = "LocalDeterministicRetrievalEngine"


class DualRetrievalReport(BaseModel):
    """
    Strictly honest reporting distinguishing Moss Cloud from Local Fallback.
    Never presents local fallback metrics as Moss cloud benchmarks.
    """
    active_mode: str = "LOCAL FALLBACK ACTIVE"
    moss_cloud_active: bool = False
    moss_cloud_status: str = "MOSS UNAVAILABLE — LOCAL FALLBACK ACTIVE"
    moss_metrics: Optional[RetrievalMetrics] = None
    fallback_metrics: RetrievalMetrics
    corpus_summary: Dict[str, int] = Field(
        default_factory=lambda: {
            "events": 5000,
            "decisions": 500,
            "cases": 120,
            "policies": 30
        }
    )


class RetrievalContextResult(BaseModel):
    """
    Standardized result contract for FORGE X retrieval layer.
    Provider-independent contract shared by Moss Cloud and Local Fallback.
    """
    policies: List[Dict[str, Any]] = Field(default_factory=list)
    precedents: List[Dict[str, Any]] = Field(default_factory=list)
    exceptions: List[Dict[str, Any]] = Field(default_factory=list)
    evidence: List[Dict[str, Any]] = Field(default_factory=list)
    provenance: Dict[str, Any] = Field(default_factory=dict)
    timestamps: Dict[str, Any] = Field(default_factory=dict)
    relevance_metadata: Dict[str, Any] = Field(default_factory=dict)
    active_mode: str = "LOCAL FALLBACK ACTIVE"
    moss_cloud_active: bool = False
    measured_latency_ms: float = 0.0


@runtime_checkable
class RetrievalService(Protocol):
    """Protocol for low-latency organizational memory retrieval."""

    async def index_documents(self, collection: str, docs: List[Dict[str, Any]]) -> int:
        """Indexes raw documents into the target collection."""
        ...

    async def search(
        self,
        collection: str,
        query: str,
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None,
        entity_id: Optional[str] = None,
        time_range: Optional[tuple[Optional[str], Optional[str]]] = None,
    ) -> List[SearchResult]:
        """Perform sub-10ms semantic and filtered query."""
        ...

    async def retrieve_policies(self, situation: str, category: Optional[str] = None, top_k: int = 3) -> List[SearchResult]:
        """Retrieve applicable organizational policies for a situation."""
        ...

    async def retrieve_similar_decisions(self, situation: str, top_k: int = 5) -> List[SearchResult]:
        """Find historical decision precedents matching situation."""
        ...

    async def retrieve_exceptions(self, situation: str, top_k: int = 3) -> List[SearchResult]:
        """Retrieve mined exception patterns applicable to this situation."""
        ...

    async def retrieve_context(
        self,
        query: str,
        timestamp: Optional[str] = None,
        organization_id: Optional[str] = None,
        policy_scope: Optional[str] = None,
        top_k: int = 5,
    ) -> RetrievalContextResult:
        """
        Unified provider-independent context retrieval for Decision Engine.
        Respects temporal isolation (knowledge created <= timestamp).
        """
        ...

    def get_metrics(self) -> RetrievalMetrics:
        """Returns empirical measured latency distribution (P50, P95, P99)."""
        ...

