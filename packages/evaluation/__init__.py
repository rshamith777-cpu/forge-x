"""
FORGE X Evaluation Package.
Formal evaluation harness measuring Process Discovery Accuracy, Decision Extraction,
Exception Detection, Evidence Grounding, Moss Latency, and Adversarial Robustness.
"""

from .harness import EvaluationHarness, EvaluationReport

__all__ = ["EvaluationHarness", "EvaluationReport"]
