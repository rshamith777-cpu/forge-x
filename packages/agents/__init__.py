"""
FORGE X Specialized Agent Pipeline Package
Implements typed, non-chatter agents for Adversarial Stress-Testing,
Playbook Evolution, Apprenticeship Reasoning, and Expert Tacit Knowledge Capture.
"""

from .adversarial import AdversarialAgent, AttackScenario, AdversarialEvolutionNarrative, SybilIdentityAttack
from .playbook_evolver import PlaybookEvolver, EvolutionRecord
from .apprenticeship import AIApprenticeshipTrainer, ApprenticeshipEvaluation
from .expert_capture import ExpertKnowledgeCaptureEngine, ExpertElicitationPrompt

__all__ = [
    "AdversarialAgent",
    "AttackScenario",
    "AdversarialEvolutionNarrative",
    "SybilIdentityAttack",
    "PlaybookEvolver",
    "EvolutionRecord",
    "AIApprenticeshipTrainer",
    "ApprenticeshipEvaluation",
    "ExpertKnowledgeCaptureEngine",
    "ExpertElicitationPrompt",
]
