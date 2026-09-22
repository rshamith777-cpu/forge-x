"""
Synthetic Data Generator for FORGE X: ApexCloud Demo Scenario.
Generates 5,000 realistic events, 500 decisions, 120 customer cases, 30 policies,
20 employees, and realistic discrepancies between documented vs discovered processes.
Deterministic and reproducible via random.seed(42).
"""

import os
import json
import random
from datetime import datetime, timedelta, timezone

random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(__file__), "demo")
os.makedirs(DATA_DIR, exist_ok=True)

EMPLOYEES = [
    {"id": "emp_01", "name": "Sarah Chen", "role": "staff_support_lead", "department": "Customer Engineering", "tenure_years": 4.5},
    {"id": "emp_02", "name": "Marcus Vance", "role": "support_engineer", "department": "Customer Engineering", "tenure_years": 1.2},
    {"id": "emp_03", "name": "Elena Rostova", "role": "senior_support_eng", "department": "Customer Engineering", "tenure_years": 3.0},
    {"id": "emp_04", "name": "David Kim", "role": "engineering_manager", "department": "Support Operations", "tenure_years": 5.0},
    {"id": "emp_05", "name": "Priya Sharma", "role": "tam_director", "department": "Customer Success", "tenure_years": 4.0},
    {"id": "emp_06", "name": "Alex Thorne", "role": "sre_incident_commander", "department": "Platform Reliability", "tenure_years": 3.5},
    {"id": "emp_07", "name": "Jessica Taylor", "role": "billing_specialist", "department": "Finance Ops", "tenure_years": 2.1},
    {"id": "emp_08", "name": "Raj Patel", "role": "senior_solutions_architect", "department": "Solutions", "tenure_years": 3.8},
    {"id": "emp_09", "name": "Olivia Martinez", "role": "support_engineer", "department": "Customer Engineering", "tenure_years": 0.8},
    {"id": "emp_10", "name": "Liam O'Connor", "role": "product_manager", "department": "Core Platform", "tenure_years": 2.5},
    {"id": "emp_11", "name": "Sophia Zhang", "role": "legal_counsel", "department": "Legal & Compliance", "tenure_years": 4.2},
    {"id": "emp_12", "name": "Ethan Wright", "role": "security_engineer", "department": "InfoSec", "tenure_years": 2.9},
    {"id": "emp_13", "name": "Chloe Bennett", "role": "customer_success_manager", "department": "Customer Success", "tenure_years": 1.9},
    {"id": "emp_14", "name": "Noah Harris", "role": "tier1_agent", "department": "Customer Engineering", "tenure_years": 0.5},
    {"id": "emp_15", "name": "Emma Wilson", "role": "tier1_agent", "department": "Customer Engineering", "tenure_years": 0.7},
    {"id": "emp_16", "name": "Daniel Lee", "role": "billing_manager", "department": "Finance Ops", "tenure_years": 6.1},
    {"id": "emp_17", "name": "Ava Campbell", "role": "staff_architect", "department": "Platform Reliability", "tenure_years": 5.2},
    {"id": "emp_18", "name": "Lucas Scott", "role": "support_engineer", "department": "Customer Engineering", "tenure_years": 1.5},
    {"id": "emp_19", "name": "Mia Robinson", "role": "customer_advocate", "department": "Customer Success", "tenure_years": 2.3},
    {"id": "emp_20", "name": "Benjamin Clark", "role": "vp_customer_experience", "department": "Executive Leadership", "tenure_years": 7.0},
]

POLICIES = [
    {
        "id": "POL-OPS-012",
        "code": "POL-OPS-012",
        "title": "Refund & Credit Authorization Limits",
        "clause_text": "All refund or credit requests exceeding $500.00 require Tier-3 Manager (Director) approval in Jira prior to execution. Maximum turnaround SLA is 48 business hours. Agents issuing unauthorized refunds above $500 are subject to disciplinary review.",
        "category": "billing",
        "sla_hours": 48.0,
        "max_refund_auto": 200.0,
        "requires_approval_over": 500.0,
        "version": "1.2.0",
        "status": "active"
    },
    {
        "id": "POL-SLA-ENT",
        "code": "POL-SLA-ENT",
        "title": "Enterprise Disruption Response Standard",
        "clause_text": "Enterprise Tier-1 clients experiencing production-impacting outages (>99.9% degradation) must receive initial executive notification within 15 minutes and root cause postmortem within 24 hours.",
        "category": "service_assurance",
        "sla_hours": 2.0,
        "max_refund_auto": 500.0,
        "requires_approval_over": 2500.0,
        "version": "2.0.1",
        "status": "active"
    },
    {
        "id": "POL-SEC-004",
        "code": "POL-SEC-004",
        "title": "Data Loss & Token Revocation Protocol",
        "clause_text": "In the event of suspected token leakage, security team must revoke keys immediately without customer consent.",
        "category": "security",
        "sla_hours": 0.5,
        "max_refund_auto": 0.0,
        "requires_approval_over": 0.0,
        "version": "1.0.0",
        "status": "active"
    },
    {
        "id": "POL-RET-009",
        "code": "POL-RET-009",
        "title": "Customer Retention & Emergency Credit Discretion",
        "clause_text": "Staff-level customer engineers may extend courtesy credits up to $250.00 if customer churn probability exceeds 0.70 based on CRM scoring.",
        "category": "retention",
        "sla_hours": 4.0,
        "max_refund_auto": 250.0,
        "requires_approval_over": 250.0,
        "version": "1.1.0",
        "status": "active"
    }
] + [
    {
        "id": f"POL-GEN-{i:03d}",
        "code": f"POL-GEN-{i:03d}",
        "title": f"Operational Standard Directive {i}",
        "clause_text": f"Guideline {i} governing operational workflows and escalation ladders across ApexCloud systems.",
        "category": random.choice(["infra", "billing", "compliance", "support", "network"]),
        "sla_hours": random.choice([4.0, 12.0, 24.0, 48.0, 72.0]),
        "max_refund_auto": 100.0,
        "requires_approval_over": 500.0,
        "version": "1.0.0",
        "status": "active"
    }
    for i in range(5, 31)
]

TIERS = ["starter", "pro", "enterprise", "strategic_partner"]
CHANNELS = ["slack", "zendesk", "jira", "stripe", "github", "email", "crm", "internal_tool"]


def generate_cases_and_events():
    base_time = datetime(2026, 8, 1, 8, 0, 0, tzinfo=timezone.utc)
    cases = []
    events = []
    decisions = []
    contradictions = []

    case_counter = 1
    event_counter = 1
    decision_counter = 1

    # 120 Cases total
    for c_idx in range(120):
        case_id = f"CASE-{case_counter:04d}"
        case_counter += 1
        tier = random.choices(TIERS, weights=[0.3, 0.35, 0.25, 0.1])[0]
        case_start = base_time + timedelta(hours=c_idx * 5 + random.randint(0, 3))
        amount = round(random.uniform(50.0, 3500.0), 2)
        is_high_value = amount > 500.0
        is_enterprise = tier in ["enterprise", "strategic_partner"]
        is_outage_related = random.random() < 0.45

        case_obj = {
            "id": case_id,
            "tier": tier,
            "amount_claimed": amount,
            "is_outage_related": is_outage_related,
            "created_at": case_start.isoformat(),
            "status": "resolved",
            "mrr": round(amount * random.uniform(8, 25), 2) if is_enterprise else round(amount * 2, 2),
            "primary_actor": random.choice(EMPLOYEES)["id"]
        }
        cases.append(case_obj)

        # Generate event trace for this case
        current_time = case_start

        # 1. Ticket Created (Zendesk)
        ev1 = {
            "id": f"evt_{event_counter:06d}",
            "case_id": case_id,
            "timestamp": current_time.isoformat(),
            "actor": "customer_portal",
            "actor_role": "external_customer",
            "source": "zendesk",
            "event_type": "ticket_created",
            "payload": {
                "title": f"Service disruption credit request for {case_id}",
                "tier": tier,
                "amount": amount,
                "urgency": "critical" if is_enterprise else "normal"
            },
            "context_gravity": {
                "score": 0.85 if is_enterprise else 0.45,
                "tier": "critical" if is_enterprise else "medium",
                "recency_weight": 0.9,
                "frequency_weight": 0.6,
                "business_impact": 0.95 if is_enterprise else 0.3,
                "policy_relevance": 0.8
            }
        }
        events.append(ev1)
        event_counter += 1

        # In Documented Process: Ticket -> Investigate -> Manager Approval -> Resolve
        # In Actual Process (Discovered):
        # If Enterprise and Amount > 500:
        # Instead of Jira Manager Queue (which takes 48h), staff engineer checks Slack, checks deployment, bypasses manager, and executes Stripe credit directly!
        if is_enterprise and is_high_value:
            # Step: Search Slack
            current_time += timedelta(minutes=random.randint(5, 15))
            ev_slack = {
                "id": f"evt_{event_counter:06d}",
                "case_id": case_id,
                "timestamp": current_time.isoformat(),
                "actor": "emp_01",  # Sarah Chen (Staff)
                "actor_role": "staff_support_lead",
                "source": "slack",
                "event_type": "slack_search_precedent",
                "payload": {"query": f"outage refund {tier}", "channel": "#incidents-war-room"},
                "context_gravity": {"score": 0.90, "tier": "critical", "recency_weight": 0.9, "frequency_weight": 0.8, "business_impact": 0.9, "policy_relevance": 0.85}
            }
            events.append(ev_slack)
            event_counter += 1

            # Step: Inspect previous case & check deployment
            current_time += timedelta(minutes=random.randint(10, 25))
            ev_dep = {
                "id": f"evt_{event_counter:06d}",
                "case_id": case_id,
                "timestamp": current_time.isoformat(),
                "actor": "emp_01",
                "actor_role": "staff_support_lead",
                "source": "github",
                "event_type": "deployment_incident_check",
                "payload": {"incident_id": "INC-882", "impacted_shards": ["us-east-1", "eu-central-1"]},
                "context_gravity": {"score": 0.88, "tier": "critical", "recency_weight": 0.85, "frequency_weight": 0.7, "business_impact": 0.85, "policy_relevance": 0.8}
            }
            events.append(ev_dep)
            event_counter += 1

            # Decision: Bypass Manager Approval to prevent enterprise churn
            current_time += timedelta(minutes=random.randint(10, 20))
            dec_id = f"DEC-{decision_counter:04d}"
            decision_counter += 1

            dec = {
                "id": dec_id,
                "case_id": case_id,
                "situation": f"Enterprise client {tier} requesting ${amount:.2f} credit after SLA disruption. Formal policy POL-OPS-012 requires 48h manager review. Client threatening immediate contract cancellation.",
                "action_taken": "direct_executive_credit_bypass",
                "alternatives_rejected": ["queue_for_director_approval_48h", "reject_claim", "request_more_telemetry"],
                "actor_id": "emp_01",
                "actor_role": "staff_support_lead",
                "timestamp": current_time.isoformat(),
                "evidence_ids": [ev1["id"], ev_slack["id"], ev_dep["id"]],
                "matched_genome_id": "GENOME-APEX-BILLING-001",
                "rationale": "Enterprise ARR > $50k. Waiting 48h guarantees customer churn. Prior Slack precedent established VP approved direct credit."
            }
            decisions.append(dec)

            # Step: Stripe Direct Credit Issued
            current_time += timedelta(minutes=5)
            ev_stripe = {
                "id": f"evt_{event_counter:06d}",
                "case_id": case_id,
                "timestamp": current_time.isoformat(),
                "actor": "emp_01",
                "actor_role": "staff_support_lead",
                "source": "stripe",
                "event_type": "refund_issued_direct",
                "payload": {"amount": amount, "currency": "USD", "reason": "SLA_BREACH_CREDIT", "bypass_manager": True},
                "context_gravity": {"score": 0.95, "tier": "critical", "recency_weight": 0.95, "frequency_weight": 0.8, "business_impact": 0.95, "policy_relevance": 0.9}
            }
            events.append(ev_stripe)
            event_counter += 1

            # Step: Customer Notified & Ticket Resolved
            current_time += timedelta(minutes=15)
            ev_res = {
                "id": f"evt_{event_counter:06d}",
                "case_id": case_id,
                "timestamp": current_time.isoformat(),
                "actor": "emp_01",
                "actor_role": "staff_support_lead",
                "source": "zendesk",
                "event_type": "ticket_resolved",
                "payload": {"resolution_time_minutes": 65, "csat": 5.0, "churn_prevented": True},
                "context_gravity": {"score": 0.75, "tier": "high", "recency_weight": 0.8, "frequency_weight": 0.6, "business_impact": 0.8, "policy_relevance": 0.7}
            }
            events.append(ev_res)
            event_counter += 1

        else:
            # Standard or Non-Bypass Path
            current_time += timedelta(minutes=random.randint(15, 60))
            ev_inv = {
                "id": f"evt_{event_counter:06d}",
                "case_id": case_id,
                "timestamp": current_time.isoformat(),
                "actor": random.choice(EMPLOYEES)["id"],
                "actor_role": "support_engineer",
                "source": "internal_tool",
                "event_type": "telemetry_investigated",
                "payload": {"metrics_verified": True},
                "context_gravity": {"score": 0.40, "tier": "medium", "recency_weight": 0.5, "frequency_weight": 0.5, "business_impact": 0.3, "policy_relevance": 0.5}
            }
            events.append(ev_inv)
            event_counter += 1

            # Decision
            dec_id = f"DEC-{decision_counter:04d}"
            decision_counter += 1
            action_choice = "standard_credit_approved" if amount <= 200 else "escalate_to_manager"
            dec = {
                "id": dec_id,
                "case_id": case_id,
                "situation": f"Standard claim for tier {tier} with amount ${amount:.2f}",
                "action_taken": action_choice,
                "alternatives_rejected": ["reject_claim", "auto_refund"],
                "actor_id": ev_inv["actor"],
                "actor_role": "support_engineer",
                "timestamp": current_time.isoformat(),
                "evidence_ids": [ev1["id"], ev_inv["id"]],
                "matched_genome_id": "GENOME-APEX-STANDARD-002",
                "rationale": "Followed standard refund limits under POL-OPS-012."
            }
            decisions.append(dec)

    # Generate additional historical decisions across incidents and cases to reach 500 decisions
    decision_types = [
        ("sla_credit_granted", "Approved credit adjustment for impacted customer"),
        ("ticket_escalated_to_tier3", "Escalated high-severity case to engineering lead"),
        ("workaround_provided", "Supplied customer with temporary API bypass script"),
        ("maintenance_window_approved", "Authorized emergency off-hours cluster patch"),
        ("rate_limit_exempted", "Granted temporary 2x API rate limit burst during peak"),
        ("security_session_reset", "Revoked OAuth tokens following anomaly flag"),
        ("contract_terms_amended", "Added custom uptime SLA annex for strategic partner")
    ]

    while len(decisions) < 500:
        dec_id = f"DEC-{decision_counter:04d}"
        decision_counter += 1
        d_type, d_desc = random.choice(decision_types)
        c_rand = random.choice(cases)
        emp_rand = random.choice(EMPLOYEES)
        dec_time = base_time + timedelta(minutes=random.randint(0, 120 * 5 * 60))
        
        dec = {
            "id": dec_id,
            "case_id": c_rand["id"],
            "situation": f"{d_desc} for account {c_rand['id']} ({c_rand['tier']})",
            "action_taken": d_type,
            "alternatives_rejected": ["no_action", "request_further_logs", "reject_request"],
            "actor_id": emp_rand["id"],
            "actor_role": emp_rand["role"],
            "timestamp": dec_time.isoformat(),
            "evidence_ids": [f"evt_{random.randint(1, len(events)):06d}" for _ in range(random.randint(1, 3))],
            "matched_genome_id": "GENOME-APEX-BILLING-001" if "credit" in d_type else "GENOME-APEX-STANDARD-002",
            "rationale": f"Operational judgment applied by {emp_rand['name']} under incident conditions."
        }
        decisions.append(dec)

    # Pad with realistic background enterprise activity events to reach exactly 5,000 events
    extra_needed = 5000 - len(events)
    bg_sources = ["slack", "jira", "github", "email", "crm"]
    bg_types = [
        "slack_standup_message", "jira_status_update", "github_pr_merged", "crm_account_synced",
        "system_health_heartbeat", "slack_incident_chatter", "email_notification_sent",
        "monitoring_alert_cleared", "knowledge_base_article_viewed"
    ]

    for i in range(extra_needed):
        bg_time = base_time + timedelta(minutes=random.randint(0, 120 * 5 * 60))
        emp = random.choice(EMPLOYEES)
        ev_bg = {
            "id": f"evt_{event_counter:06d}",
            "case_id": f"CASE-{random.randint(1, len(cases)):04d}",
            "timestamp": bg_time.isoformat(),
            "actor": emp["id"],
            "actor_role": emp["role"],
            "source": random.choice(bg_sources),
            "event_type": random.choice(bg_types),
            "payload": {"note": f"Routine activity {i}", "system": "ApexCloud Core"},
            "context_gravity": {
                "score": round(random.uniform(0.1, 0.4), 2),
                "tier": "low",
                "recency_weight": round(random.uniform(0.1, 0.5), 2),
                "frequency_weight": round(random.uniform(0.1, 0.6), 2),
                "business_impact": round(random.uniform(0.05, 0.3), 2),
                "policy_relevance": round(random.uniform(0.05, 0.3), 2)
            }
        }
        events.append(ev_bg)
        event_counter += 1

    # Sort events by timestamp
    events.sort(key=lambda x: x["timestamp"])

    # Sort decisions
    decisions.sort(key=lambda x: x["timestamp"])


    # Documented vs Discovered Workflows
    workflows = [
        {
            "id": "WF-DOC-001",
            "name": "Documented Enterprise Billing SOP",
            "version": "1.0.0",
            "type": "documented",
            "domain": "billing_support",
            "nodes": [
                {"id": "doc_start", "label": "Ticket Received", "stage_type": "start", "avg_duration_minutes": 0, "is_undocumented": False},
                {"id": "doc_triage", "label": "Triage & Investigate", "stage_type": "activity", "avg_duration_minutes": 45, "is_undocumented": False},
                {"id": "doc_manager_review", "label": "Manager Review Queue (> $500)", "stage_type": "decision_point", "avg_duration_minutes": 2400, "bottleneck_score": 0.88, "is_undocumented": False},
                {"id": "doc_refund_exec", "label": "Execute Refund in Portal", "stage_type": "activity", "avg_duration_minutes": 15, "is_undocumented": False},
                {"id": "doc_end", "label": "Ticket Resolved", "stage_type": "end", "avg_duration_minutes": 0, "is_undocumented": False},
            ],
            "edges": [
                {"id": "e_doc_1", "source": "doc_start", "target": "doc_triage", "frequency": 120, "probability": 1.0, "avg_latency_minutes": 10},
                {"id": "e_doc_2", "source": "doc_triage", "target": "doc_manager_review", "frequency": 120, "probability": 1.0, "avg_latency_minutes": 45},
                {"id": "e_doc_3", "source": "doc_manager_review", "target": "doc_refund_exec", "frequency": 110, "probability": 0.92, "avg_latency_minutes": 2400},
                {"id": "e_doc_4", "source": "doc_refund_exec", "target": "doc_end", "frequency": 110, "probability": 1.0, "avg_latency_minutes": 15},
            ],
            "bottlenecks": ["doc_manager_review"],
            "cycles": [],
            "total_traces": 120,
            "conformance_rate": 0.38
        },
        {
            "id": "WF-DISC-001",
            "name": "Discovered Actual Enterprise Support Process",
            "version": "1.0.0",
            "type": "discovered",
            "domain": "billing_support",
            "nodes": [
                {"id": "disc_start", "label": "Ticket Received", "stage_type": "start", "avg_duration_minutes": 0, "is_undocumented": False},
                {"id": "disc_slack_search", "label": "Slack Incident Search", "stage_type": "activity", "avg_duration_minutes": 12, "is_undocumented": True},
                {"id": "disc_dep_check", "label": "Verify Outage Shards", "stage_type": "activity", "avg_duration_minutes": 18, "is_undocumented": True},
                {"id": "disc_direct_bypass", "label": "Senior Staff Direct Credit Bypass", "stage_type": "decision_point", "avg_duration_minutes": 8, "is_undocumented": True},
                {"id": "disc_stripe_exec", "label": "Stripe Direct Credit", "stage_type": "activity", "avg_duration_minutes": 5, "is_undocumented": False},
                {"id": "disc_end", "label": "Resolved with 5-Star CSAT", "stage_type": "end", "avg_duration_minutes": 0, "is_undocumented": False},
            ],
            "edges": [
                {"id": "e_disc_1", "source": "disc_start", "target": "disc_slack_search", "frequency": 88, "probability": 0.73, "avg_latency_minutes": 12, "is_undocumented_bypass": True},
                {"id": "e_disc_2", "source": "disc_slack_search", "target": "disc_dep_check", "frequency": 85, "probability": 0.96, "avg_latency_minutes": 18, "is_undocumented_bypass": True},
                {"id": "e_disc_3", "source": "disc_dep_check", "target": "disc_direct_bypass", "frequency": 82, "probability": 0.96, "avg_latency_minutes": 8, "is_undocumented_bypass": True},
                {"id": "e_disc_4", "source": "disc_direct_bypass", "target": "disc_stripe_exec", "frequency": 80, "probability": 0.98, "avg_latency_minutes": 5, "is_undocumented_bypass": True},
                {"id": "e_disc_5", "source": "disc_stripe_exec", "target": "disc_end", "frequency": 80, "probability": 1.0, "avg_latency_minutes": 10, "is_undocumented_bypass": False},
            ],
            "bottlenecks": [],
            "cycles": [],
            "total_traces": 120,
            "conformance_rate": 0.89
        }
    ]

    # Expand to 15 departmental workflows (Billing, SRE, Security, Access, Compliance, etc.)
    dept_names = [
        ("WF-SRE-001", "Production Incident Triage", "infra"),
        ("WF-SEC-002", "Credential Revocation Protocol", "security"),
        ("WF-OPS-003", "Enterprise Onboarding & Provisioning", "customer_success"),
        ("WF-REV-004", "Churn Risk Intervention", "retention"),
        ("WF-DAT-005", "Customer Data Deletion & GDPR", "compliance"),
        ("WF-ACC-006", "Privileged IAM Escalation", "security"),
        ("WF-NET-007", "DDoS Mitigation Pipeline", "network"),
        ("WF-API-008", "Rate Limit Anomaly Resolution", "platform"),
        ("WF-DEP-009", "Emergency Rollback Pipeline", "infra"),
        ("WF-BIL-010", "Disputed Chargeback Arbitration", "billing"),
        ("WF-TAM-011", "Quarterly Executive Business Review", "customer_success"),
        ("WF-LGL-012", "Enterprise Subpoena & Legal Hold", "legal"),
        ("WF-INT-013", "Partner API Integration Review", "solutions"),
    ]

    for wf_id, wf_name, wf_domain in dept_names:
        workflows.append({
            "id": wf_id,
            "name": wf_name,
            "version": "1.0.0",
            "type": "discovered",
            "domain": wf_domain,
            "nodes": [
                {"id": f"{wf_id}_n1", "label": "Trigger Event", "stage_type": "start", "avg_duration_minutes": 0, "is_undocumented": False},
                {"id": f"{wf_id}_n2", "label": "Context Gathering", "stage_type": "activity", "avg_duration_minutes": 15, "is_undocumented": False},
                {"id": f"{wf_id}_n3", "label": "Decision Gateway", "stage_type": "decision_point", "avg_duration_minutes": 25, "is_undocumented": False},
                {"id": f"{wf_id}_n4", "label": "Execution & Verification", "stage_type": "activity", "avg_duration_minutes": 30, "is_undocumented": False},
                {"id": f"{wf_id}_n5", "label": "Outcome Recorded", "stage_type": "end", "avg_duration_minutes": 0, "is_undocumented": False},
            ],
            "edges": [
                {"id": f"{wf_id}_e1", "source": f"{wf_id}_n1", "target": f"{wf_id}_n2", "frequency": 45, "probability": 1.0, "avg_latency_minutes": 15},
                {"id": f"{wf_id}_e2", "source": f"{wf_id}_n2", "target": f"{wf_id}_n3", "frequency": 45, "probability": 1.0, "avg_latency_minutes": 25},
                {"id": f"{wf_id}_e3", "source": f"{wf_id}_n3", "target": f"{wf_id}_n4", "frequency": 42, "probability": 0.93, "avg_latency_minutes": 30},
                {"id": f"{wf_id}_e4", "source": f"{wf_id}_n4", "target": f"{wf_id}_n5", "frequency": 42, "probability": 1.0, "avg_latency_minutes": 10},
            ],
            "bottlenecks": [],
            "cycles": [],
            "total_traces": 45,
            "conformance_rate": 0.91
        })


    # Contradictions
    contradictions = [
        {
            "id": "CONTRA-001",
            "documented_rule": "POL-OPS-012 mandates Tier-3 Director signoff for credits > $500 with up to 48 hours SLA.",
            "observed_behavior": "Customer Engineering Staff bypass manager approval in 87% of enterprise outage claims, issuing up to $1,500 credits within 65 minutes.",
            "policy_id": "POL-OPS-012",
            "evidence_ids": [events[1]["id"], events[2]["id"]],
            "frequency_observed": 82,
            "severity": "critical",
            "status": "open",
            "suggested_resolution": "Update POL-OPS-012 to codify the 'Enterprise Fast-Track Credit' threshold up to $1,500 for Staff Engineers."
        },
        {
            "id": "CONTRA-002",
            "documented_rule": "All communication regarding outage refunds must occur inside Zendesk tickets.",
            "observed_behavior": "Engineers negotiate and confirm refunds in private Slack DM channels and #incidents-war-room before updating tickets.",
            "policy_id": "POL-OPS-012",
            "evidence_ids": [events[1]["id"]],
            "frequency_observed": 94,
            "severity": "medium",
            "status": "open",
            "suggested_resolution": "Integrate Slack-to-Zendesk automatic conversation mirroring to capture tacit context."
        }
    ]

    # Knowledge Gaps
    knowledge_gaps = [
        {
            "id": "GAP-001",
            "area": "International Multi-Currency Disputes",
            "description": "Your refund playbook has no validated behavior or tax compliance rules for EUR/GBP currency conversion adjustments during outages.",
            "impact": "high",
            "missing_evidence_count": 18,
            "priority": 1,
            "recommended_action": "Synthesize automated FX adjustment clause with Finance Ops team."
        },
        {
            "id": "GAP-002",
            "area": "SLA Claims During Cloud Provider Upstream Outages",
            "description": "No formal decision genome exists when outage is caused by AWS US-East-1 vs ApexCloud application failure.",
            "impact": "critical",
            "missing_evidence_count": 34,
            "priority": 2,
            "recommended_action": "Add third-party upstream outage exception rule to Decision Genome."
        }
    ]

    return {
        "cases": cases,
        "events": events,
        "decisions": decisions,
        "policies": POLICIES,
        "employees": EMPLOYEES,
        "workflows": workflows,
        "contradictions": contradictions,
        "knowledge_gaps": knowledge_gaps
    }


def main():
    print("Generating ApexCloud synthetic dataset...")
    data = generate_cases_and_events()

    for key, val in data.items():
        filepath = os.path.join(DATA_DIR, f"{key}.json")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(val, f, indent=2)
        print(f"  -> Wrote {len(val)} records to {filepath}")

    print(f"Dataset generated successfully! Total events: {len(data['events'])}, decisions: {len(data['decisions'])}, cases: {len(data['cases'])}")


if __name__ == "__main__":
    main()
