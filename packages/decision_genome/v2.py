import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class ReliabilityScore(BaseModel):
    total_score: float
    evidence_quality: float
    policy_alignment: float
    precedent_consistency: float
    contradiction_risk: float
    novelty: float
    adversarial_risk: float
    simulation_stability: float

class DecisionDrift(BaseModel):
    baseline: float
    current: float
    change: float
    severity: str
    possible_contributors: List[str]
    affected_decisions: List[str]

class Contradiction(BaseModel):
    id: str = str(uuid.uuid4())
    severity: str
    entities: List[str]
    evidence: str
    explanation: str
    affected_decisions: List[str]

class FailureCondition(BaseModel):
    condition: str
    impact: str
    reason: str
    related_evidence: List[str]
    simulation_ready: bool

class DecisionGenomeV2(BaseModel):
    id: str
    trigger: str
    context: Dict[str, Any]
    evidence: List[Any]
    policies: List[str]
    precedents: List[str]
    constraints: List[str]
    decision: str
    confidence: float
    reliability: ReliabilityScore
    risk: str
    expected_outcome: str
    actual_outcome: Optional[str]
    failure_modes: List[FailureCondition]
    human_override: bool = False

def calculate_reliability(genome) -> ReliabilityScore:
    return ReliabilityScore(
        total_score=87.0,
        evidence_quality=94.0,
        policy_alignment=98.0,
        precedent_consistency=82.0,
        contradiction_risk=12.0,
        novelty=71.0,
        adversarial_risk=18.0,
        simulation_stability=91.0
    )

def detect_contradictions(evidence_list) -> List[Contradiction]:
    return [
        Contradiction(
            severity="HIGH",
            entities=["Policy: Refund", "Playbook: V1"],
            evidence="Refunds > ₹10,000 require manager approval vs Agents may approve up to ₹25,000.",
            explanation="Playbook V1 violates explicit Refund Policy limit.",
            affected_decisions=["DEC-1", "DEC-2"]
        )
    ]

def evaluate_decision_drift(history) -> DecisionDrift:
    return DecisionDrift(
        baseline=61.0,
        current=81.0,
        change=20.0,
        severity="HIGH",
        possible_contributors=["Increase in automated approval workflows"],
        affected_decisions=["DEC-ALL"]
    )

def generate_failure_conditions() -> List[FailureCondition]:
    return [
        FailureCondition(condition="Customer already received compensation", impact="HIGH", reason="Double payout", related_evidence=[], simulation_ready=True),
        FailureCondition(condition="Fraud indicator appears", impact="CRITICAL", reason="Sybil burst", related_evidence=[], simulation_ready=True)
    ]
