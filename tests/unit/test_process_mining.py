"""
Unit tests for Process Archaeologist and Process Mining Engine.
"""

import json
import os
import pytest
from packages.process_mining.miner import ProcessArchaeologist
from packages.domain.models import Workflow, WorkflowNode, WorkflowEdge


def test_trace_extraction():
    archaeologist = ProcessArchaeologist()

    raw_events = [
        {"id": "e1", "case_id": "CASE-1", "timestamp": "2026-08-01T10:00:00Z", "event_type": "ticket_created"},
        {"id": "e2", "case_id": "CASE-2", "timestamp": "2026-08-01T10:05:00Z", "event_type": "ticket_created"},
        {"id": "e3", "case_id": "CASE-1", "timestamp": "2026-08-01T10:15:00Z", "event_type": "slack_search"},
        {"id": "e4", "case_id": "CASE-1", "timestamp": "2026-08-01T10:30:00Z", "event_type": "ticket_resolved"},
    ]

    traces = archaeologist.extract_traces(raw_events)
    assert "CASE-1" in traces
    assert len(traces["CASE-1"]) == 3
    assert traces["CASE-1"][1]["event_type"] == "slack_search"


def test_mine_workflow_from_events():
    archaeologist = ProcessArchaeologist()

    raw_events = [
        {"id": "e1", "case_id": "CASE-1", "timestamp": "2026-08-01T10:00:00Z", "event_type": "ticket_created"},
        {"id": "e2", "case_id": "CASE-1", "timestamp": "2026-08-01T10:10:00Z", "event_type": "slack_search"},
        {"id": "e3", "case_id": "CASE-1", "timestamp": "2026-08-01T10:20:00Z", "event_type": "direct_bypass"},
        {"id": "e4", "case_id": "CASE-1", "timestamp": "2026-08-01T10:25:00Z", "event_type": "ticket_resolved"},
    ]

    wf = archaeologist.mine_workflow(raw_events, workflow_id="WF-TEST-01")
    assert wf.id == "WF-TEST-01"
    assert len(wf.nodes) == 4
    assert any(n.id == "direct_bypass" for n in wf.nodes)

    # Check edges
    edge_pairs = [(e.source, e.target) for e in wf.edges]
    assert ("ticket_created", "slack_search") in edge_pairs
    assert ("slack_search", "direct_bypass") in edge_pairs
    assert ("direct_bypass", "ticket_resolved") in edge_pairs


def test_workflow_conformance_comparison():
    archaeologist = ProcessArchaeologist()

    doc_wf = Workflow(
        id="WF-DOC",
        name="Documented",
        type="documented",
        nodes=[
            WorkflowNode(id="step_a", label="A"),
            WorkflowNode(id="step_b", label="B"),
            WorkflowNode(id="step_c", label="C"),
        ],
        edges=[
            WorkflowEdge(id="e1", source="step_a", target="step_b"),
            WorkflowEdge(id="e2", source="step_b", target="step_c"),
        ],
    )

    disc_wf = Workflow(
        id="WF-DISC",
        name="Discovered",
        type="discovered",
        nodes=[
            WorkflowNode(id="step_a", label="A"),
            WorkflowNode(id="step_bypass", label="Bypass"),
            WorkflowNode(id="step_c", label="C"),
        ],
        edges=[
            WorkflowEdge(id="e3", source="step_a", target="step_bypass"),
            WorkflowEdge(id="e4", source="step_bypass", target="step_c"),
        ],
        total_traces=100,
    )

    report = archaeologist.compare_workflows(documented=doc_wf, discovered=disc_wf)
    assert report.total_traces == 100
    assert "step_b" in report.bypassed_documented_nodes
    assert "step_bypass" in report.discovered_undocumented_nodes
    assert report.conformance_rate < 0.5
