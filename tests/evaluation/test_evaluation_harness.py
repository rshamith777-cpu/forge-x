"""
Integration test running the full FORGE X Automated Evaluation Harness.
"""

import os
import pytest
from packages.evaluation.harness import EvaluationHarness

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "demo")


@pytest.mark.asyncio
async def test_full_evaluation_harness():
    harness = EvaluationHarness()
    report = await harness.run_full_evaluation(DATA_DIR)

    # Integrity assertions
    assert report.process_discovery_accuracy >= 0.90
    assert report.decision_grounding_score >= 0.85
    assert report.exception_detection_recall == 1.0
    assert report.contradiction_detection_rate == 1.0
    # Moss sub-10ms latency guarantee
    assert report.moss_p50_latency_ms < 10.0
    assert report.moss_p95_latency_ms < 10.0
    # Simulation determinism
    assert report.simulation_consistency == 1.0
    # Adversarial robustness improvement
    assert report.adversarial_robustness_v2 >= report.adversarial_robustness_v1

    print("\n" + "="*60)
    print("FORGE X AUTOMATED BENCHMARK EVALUATION REPORT")
    print("="*60)
    print(f"Process Discovery Accuracy : {report.process_discovery_accuracy * 100:.1f}%")
    print(f"Decision Grounding Score   : {report.decision_grounding_score * 100:.1f}%")
    print(f"Exception Detection Recall : {report.exception_detection_recall * 100:.1f}%")
    print(f"Contradiction Detection    : {report.contradiction_detection_rate * 100:.1f}%")
    print(f"Moss P50 Latency           : {report.moss_p50_latency_ms:.3f} ms (< 10ms target: PASS)")
    print(f"Moss P95 Latency           : {report.moss_p95_latency_ms:.3f} ms")
    print(f"Moss P99 Latency           : {report.moss_p99_latency_ms:.3f} ms")
    print(f"Simulation Determinism     : 100% (Bit-exact across seeds)")
    print(f"Adversarial Robustness V1  : {report.adversarial_robustness_v1 * 100:.1f}%")
    print(f"Adversarial Robustness V2  : {report.adversarial_robustness_v2 * 100:.1f}%")
    print(f"Final Verdict              : {report.verdict}")
    print("="*60)
