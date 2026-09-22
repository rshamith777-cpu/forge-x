"""
FORGE X Simulation Package
Event-driven counterfactual simulation engine and Pareto trade-off analyzer for Fork Reality.
"""

from .engine import DiscreteEventSimulationEngine, RealityForkResult
from .pareto import ParetoAnalyzer, ParetoPoint

__all__ = [
    "DiscreteEventSimulationEngine",
    "RealityForkResult",
    "ParetoAnalyzer",
    "ParetoPoint",
]
