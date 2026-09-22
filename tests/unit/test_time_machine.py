"""
Unit tests for FORGE X Organizational Time Machine.
Verifies strict zero future leakage and chronological historical isolation.
"""

from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)


def test_time_machine_timeline():
    response = client.get("/api/time-machine/timeline")
    assert response.status_code == 200
    data = response.json()
    assert "min_timestamp" in data
    assert "max_timestamp" in data
    assert len(data["checkpoints"]) >= 3


def test_time_machine_zero_future_leakage():
    # At 08:30 AM, events after 08:30 AM must be completely masked
    target_ts = "2026-08-01T08:30:00+00:00"
    response = client.get(f"/api/time-machine/inspect?timestamp={target_ts}")
    assert response.status_code == 200
    data = response.json()

    assert data["target_timestamp"] == target_ts
    assert "Zero future information leakage" in data["hindsight_bias_protection"]

    state = data["state"]
    # There must be future events and decisions masked
    assert state["future_events_masked"] > 0
    assert state["future_decisions_masked"] > 0

    # Incident declared at 10:15 should NOT be active at 08:30
    assert state["active_incident"]["active"] is False

    # Check later time: 10:30 AM should show incident active
    res_outage = client.get("/api/time-machine/inspect?timestamp=2026-08-01T10:30:00+00:00")
    data_outage = res_outage.json()
    assert data_outage["state"]["active_incident"]["active"] is True
    assert data_outage["state"]["active_incident"]["incident_id"] == "INC-8891"
