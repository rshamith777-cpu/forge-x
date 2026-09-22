"""
Pareto Multi-Objective Frontier Analyzer for FORGE X.
Calculates non-dominated tradeoffs across Cost, Speed, Risk, CSAT, and Workload.
"""

from __future__ import annotations
from typing import Dict, List, Any
from pydantic import BaseModel


class ParetoPoint(BaseModel):
    name: str
    cost: float          # Lower is better
    duration_hours: float # Lower is better
    risk: float          # Lower is better
    workload: float      # Lower is better
    csat: float          # Higher is better
    is_non_dominated: bool = True


class ParetoAnalyzer:
    """
    Computes Pareto-optimal decision configurations.
    Avoids claiming there is a single magical 'best' answer; exposes tradeoff space.
    """

    @staticmethod
    def is_dominated(p1: ParetoPoint, p2: ParetoPoint) -> bool:
        """
        Returns True if p1 is dominated by p2.
        p2 dominates p1 if p2 is at least as good in all dimensions and strictly better in at least one.
        """
        better_or_equal = (
            p2.cost <= p1.cost and
            p2.duration_hours <= p1.duration_hours and
            p2.risk <= p1.risk and
            p2.workload <= p1.workload and
            p2.csat >= p1.csat
        )
        strictly_better = (
            p2.cost < p1.cost or
            p2.duration_hours < p1.duration_hours or
            p2.risk < p1.risk or
            p2.workload < p1.workload or
            p2.csat > p1.csat
        )
        return better_or_equal and strictly_better

    def compute_frontier(self, points: List[ParetoPoint]) -> List[ParetoPoint]:
        """Marks and returns non-dominated Pareto frontier points."""
        results = []
        for i, p1 in enumerate(points):
            dominated = False
            for j, p2 in enumerate(points):
                if i != j and self.is_dominated(p1, p2):
                    dominated = True
                    break
            p1.is_non_dominated = not dominated
            results.append(p1)
        return results
