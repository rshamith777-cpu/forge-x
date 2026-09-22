"""
FORGE X Retrieval Package
Provides low-latency semantic and metadata retrieval powered by Moss
with deterministic local fallback and real microsecond telemetry.
"""

from .service import RetrievalService, SearchResult, RetrievalMetrics, DualRetrievalReport
from .local_engine import LocalDeterministicRetrievalEngine
from .moss_adapter import MossRetrievalEngine

__all__ = [
    "RetrievalService",
    "SearchResult",
    "RetrievalMetrics",
    "DualRetrievalReport",
    "LocalDeterministicRetrievalEngine",
    "MossRetrievalEngine",
]

