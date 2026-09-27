/**
 * FORGE X — Production Demo & Offline Fallback Datasets.
 * Provides authentic, high-fidelity enterprise data structures ensuring
 * zero-config standalone Vercel deployments render 100% operational.
 */

export const DEMO_HEALTH = {
  status: "online",
  system: "FORGE X Compiler Runtime",
  timestamp: new Date().toISOString(),
  moss_retrieval: {
    engine: "Moss L1 In-Memory Ring Buffer",
    status: "operational",
    p50_latency_ms: 1.2
  },
  dataset_summary: {
    events_loaded: 5000,
    decisions_loaded: 500,
    policies_loaded: 30,
    cases_loaded: 120,
    workflows_loaded: 15,
    contradictions_detected: 2,
    knowledge_gaps_identified: 2
  }
};

export const DEMO_MOSS_METRICS = {
  engine_name: "Moss L1 In-Memory Ring Buffer",
  active_mode: "MOSS_RETRIEVAL_FABRIC",
  moss_cloud_active: true,
  moss_cloud_status: "operational",
  moss_metrics: { p50_ms: 1.2, hit_rate: 0.984 },
  fallback_metrics: { p50_ms: 4.8, hit_rate: 0.92 },
  corpus_summary: "5,000 events, 500 decisions, 30 policies indexed",
  total_queries: 1420,
  p50_latency_ms: 1.2,
  p95_latency_ms: 2.4,
  p99_latency_ms: 4.1,
  cache_hit_rate: 0.984,
  avg_context_tokens: 1280,
  sub_10ms_guarantee_met: true
};

export const DEMO_COMMAND_CENTER = {
  organization: {
    name: "ApexCloud Platform",
    domain: "Cloud Infrastructure & SaaS",
    total_events_observed: 5000,
    active_experts: 20
  },
  playbook_health: {
    active_playbook: "Enterprise Incident Resolution Playbook",
    version: "v1.4",
    scores: {
      overall: 88.5,
      compliance: 94.2,
      latency: 91.0,
      human_alignment: 86.8
    }
  },
  emerging_anomalies: [
    { id: "ANOM-01", type: "SLO_DRIFT", description: "War-room bypass detected in 87% of high-tier tickets", severity: "HIGH" },
    { id: "ANOM-02", type: "VELOCITY_SPIKE", description: "Subnet clustering anomaly detected in 45-second refund burst", severity: "CRITICAL" }
  ],
  knowledge_gaps: [
    { id: "GAP-01", domain: "Multi-AZ Cassandra Outage Escalation", confidence: 0.42 }
  ],
  moss_telemetry: {
    p50_latency_ms: 1.2,
    cache_hit_rate: 0.984
  },
  recent_traces: [
    { id: "TRC-8942", task_id: "CASE-LIVE-0104", agent: "DecisionExecutorAgent", action_taken: "approved_credit_850", timestamp: "12m ago" },
    { id: "TRC-8939", task_id: "CASE-LIVE-0103", agent: "DecisionExecutorAgent", action_taken: "approved_credit_1400", timestamp: "45m ago" },
    { id: "TRC-8931", task_id: "CASE-LIVE-0102", agent: "DecisionExecutorAgent", action_taken: "adjusted_limit_200", timestamp: "2h ago" },
    { id: "TRC-8924", task_id: "CASE-LIVE-0101", agent: "DecisionExecutorAgent", action_taken: "automated_credit_450", timestamp: "3h ago" }
  ]
};

export const DEMO_ARCHAEOLOGY = {
  documented_workflow: {
    id: "WF-DOC-001",
    name: "Documented Enterprise Billing SOP",
    version: "1.0.0",
    type: "documented",
    domain: "billing_support",
    nodes: [
      { id: "doc_start", label: "Ticket Received", stage_type: "start", avg_duration_minutes: 0, is_undocumented: false },
      { id: "doc_triage", label: "Triage & Investigate", stage_type: "activity", avg_duration_minutes: 45, is_undocumented: false },
      { id: "doc_manager_review", label: "Manager Review Queue (> $500)", stage_type: "decision_point", avg_duration_minutes: 2400, bottleneck_score: 0.88, is_undocumented: false },
      { id: "doc_refund_exec", label: "Execute Refund in Portal", stage_type: "activity", avg_duration_minutes: 15, is_undocumented: false },
      { id: "doc_end", label: "Ticket Resolved", stage_type: "end", avg_duration_minutes: 0, is_undocumented: false }
    ],
    edges: [
      { id: "e_doc_1", source: "doc_start", target: "doc_triage", frequency: 120, probability: 1.0, avg_latency_minutes: 10 },
      { id: "e_doc_2", source: "doc_triage", target: "doc_manager_review", frequency: 120, probability: 1.0, avg_latency_minutes: 45 },
      { id: "e_doc_3", source: "doc_manager_review", target: "doc_refund_exec", frequency: 110, probability: 0.92, avg_latency_minutes: 2400 },
      { id: "e_doc_4", source: "doc_refund_exec", target: "doc_end", frequency: 110, probability: 1.0, avg_latency_minutes: 15 }
    ],
    bottlenecks: ["doc_manager_review"],
    cycles: [],
    total_traces: 120,
    conformance_rate: 0.38
  },
  discovered_workflow: {
    id: "WF-DISC-001",
    name: "Discovered Actual Enterprise Support Process",
    version: "1.0.0",
    type: "discovered",
    domain: "billing_support",
    nodes: [
      { id: "disc_start", label: "Ticket Received", stage_type: "start", avg_duration_minutes: 0, is_undocumented: false },
      { id: "disc_slack_search", label: "Slack Incident Search", stage_type: "activity", avg_duration_minutes: 12, is_undocumented: true },
      { id: "disc_dep_check", label: "Verify Outage Shards", stage_type: "activity", avg_duration_minutes: 18, is_undocumented: true },
      { id: "disc_direct_bypass", label: "Senior Staff Direct Credit Bypass", stage_type: "decision_point", avg_duration_minutes: 8, is_undocumented: true },
      { id: "disc_stripe_exec", label: "Stripe Direct Credit", stage_type: "activity", avg_duration_minutes: 5, is_undocumented: false },
      { id: "disc_end", label: "Resolved with 5-Star CSAT", stage_type: "end", avg_duration_minutes: 0, is_undocumented: false }
    ],
    edges: [
      { id: "e_disc_1", source: "disc_start", target: "disc_slack_search", frequency: 120, probability: 1.0, avg_latency_minutes: 5 },
      { id: "e_disc_2", source: "disc_slack_search", target: "disc_dep_check", frequency: 112, probability: 0.93, avg_latency_minutes: 12 },
      { id: "e_disc_3", source: "disc_dep_check", target: "disc_direct_bypass", frequency: 104, probability: 0.93, avg_latency_minutes: 18 },
      { id: "e_disc_4", source: "disc_direct_bypass", target: "disc_stripe_exec", frequency: 104, probability: 1.0, avg_latency_minutes: 8 },
      { id: "e_disc_5", source: "disc_stripe_exec", target: "disc_end", frequency: 104, probability: 1.0, avg_latency_minutes: 5 }
    ],
    bottlenecks: [],
    cycles: [],
    total_traces: 120,
    conformance_rate: 0.38
  },
  all_workflows: [],
  conformance_report: {
    conformance_rate: 0.38,
    observed_deviations: 87,
    divergence_summary: "87% of traces bypass 48h manager queue via Slack war-room shortcuts.",
    bottlenecks_detected: ["doc_manager_review"]
  }
};

export const DEMO_GENOMES = {
  total_genomes: 3,
  genomes: [
    {
      id: "GENOME-APEX-BILLING-001",
      version: "1.2.0",
      situation: "Enterprise customer demanding outage credit/refund exceeding standard automated authorization threshold ($500.00)",
      observable_signals: {
        claimed_amount: 850.0,
        customer_tier: "enterprise",
        outage_disruption_hours: 3.5,
        subnet_cluster_entropy: 0.88,
        account_mrr: 45000.0
      },
      hidden_assumptions: [
        "Engineers prioritize churn prevention over procedural approval lag",
        "Slack consensus functions as tacit authorization in enterprise incidents"
      ],
      context_requirements: ["Account MRR", "System incident logs", "Historical churn score"],
      constraints: ["SOX compliance ledger entry", "Director notification if amount > $1,000"],
      relevant_history: ["CASE-APEX-8841", "CASE-APEX-9921"],
      candidate_actions: [
        {
          action_name: "Direct Courtesy Credit & Slack Status Notification",
          description: "Immediate Stripe credit applied with proactive Slack war-room sync",
          estimated_cost: 850,
          risk_level: "low",
          historical_win_rate: 0.96
        },
        {
          action_name: "Escalate to Tier-3 Manager Queue",
          description: "Route through Jira 48h approval queue per POL-OPS-012",
          estimated_cost: 850,
          risk_level: "high",
          historical_win_rate: 0.34
        },
        {
          action_name: "Deny Claim Under Standard SLA Clause 4.2",
          description: "Strict interpretation of unscheduled maintenance clause",
          estimated_cost: 0,
          risk_level: "critical",
          historical_win_rate: 0.12
        }
      ],
      preferred_action: "Direct Courtesy Credit & Slack Status Notification",
      alternatives: ["Escalate to Tier-3 Manager Queue", "Deny Claim Under Standard SLA Clause 4.2"],
      exceptions: [
        {
          id: "EXC-FRAUD-SYBIL",
          trigger_condition: "subnet_cluster_entropy < 0.45",
          action: "HALT_AND_REDIRECT_TO_FRAUD",
          classification: "dangerous_edge_case"
        },
        {
          id: "EXC-ENT-OVERRIDE",
          trigger_condition: "customer_tier == 'enterprise' AND account_mrr > 25000",
          action: "INSTANT_AUTHORIZATION",
          classification: "common_case"
        }
      ],
      policy_dependencies: ["POL-OPS-012", "POL-SLA-ENT"],
      evidence: [
        "EV-TRACE-8841 (Slack channel #outages)",
        "EV-STRIPE-9921 (Direct credit authorization)",
        "EV-INC-0012 (Tier 1 customer bypass log)"
      ],
      confidence: 0.965,
      grounding_score: 0.965,
      empirical_cases_analyzed: 500
    },
    {
      id: "GENOME-APEX-OUTAGE-002",
      version: "1.0.0",
      situation: "Storage shard multi-region degradation affecting API latency for Pro customers",
      observable_signals: { customer_tier: "pro", outage_disruption_hours: 1.2, claimed_amount: 150.0 },
      hidden_assumptions: ["Pro users accept standard service credit within 24 hours"],
      context_requirements: ["Service latency logs", "Subscription tier status"],
      constraints: ["Max automated credit $250.00"],
      relevant_history: ["CASE-APEX-7712"],
      candidate_actions: [
        { action_name: "Automated Tier Credit", description: "Issue automated billing voucher", estimated_cost: 150, risk_level: "low", historical_win_rate: 0.98 }
      ],
      preferred_action: "Automated Tier Credit",
      alternatives: ["Manual Support Review"],
      exceptions: [],
      policy_dependencies: ["POL-OPS-009"],
      evidence: ["EV-MON-4412 (Datadog API latency trace)"],
      confidence: 0.98
    }
  ]
};

export const DEMO_PLAYBOOKS = {
  playbooks: [
    {
      id: "PB-OPS-V1",
      name: "Enterprise Incident Resolution Playbook",
      version: "1.4.0",
      status: "active",
      diff_summary: "Baseline initial compilation from historical activity.",
      reliability_scores: {
        normal_case_success: 0.88,
        edge_case_success: 0.33,
        latency_score: 0.91,
        adversarial_resilience: 0.33,
        overall_score: 0.61
      }
    },
    {
      id: "PB-OPS-V2",
      name: "Sybil-Hardened Resilient Operations Playbook",
      version: "2.0.0-rc1",
      status: "candidate",
      diff_summary: "Synthesized post-adversarial strike: integrates subnet cluster entropy gating (>= 0.45) & high-MRR protection exceptions.",
      reliability_scores: {
        normal_case_success: 0.99,
        edge_case_success: 0.94,
        latency_score: 0.98,
        adversarial_resilience: 0.94,
        overall_score: 0.96
      }
    }
  ],
  evolution_history: [
    { version: "2.0.0-rc1", timestamp: "2026-08-01 11:00", description: "Automated synthesis of EXC-FRAUD-SYBIL to prevent burst refund exploitation." },
    { version: "1.4.0", timestamp: "2026-07-15 09:30", description: "Enterprise tier fast-track exception for outage compensation." }
  ]
};

export const DEMO_AUDIT_LEDGER = {
  ledger: [
    { timestamp: "10:42", record_id: "REC-2026-8942", incident_id: "INC-1042", action: "Settlement Approved", actor: "Ananya R. (Lead)", policy: "POL-OPS-012", reference: "VCH-2026-X8841", status: "Verified", amount: "$1,250.00" },
    { timestamp: "10:38", record_id: "REC-2026-8939", incident_id: "INC-1038", action: "Policy Exception Flagged", actor: "Automated Rule Engine", policy: "POL-OPS-015", reference: "EXC-FRAUD-SYBIL", status: "Investigating", amount: "$1,400.00" },
    { timestamp: "10:21", record_id: "REC-2026-8931", incident_id: "INC-1031", action: "Automated SLA Credit", actor: "Rule Engine", policy: "POL-OPS-009", reference: "VCH-2026-X8812", status: "Verified", amount: "$450.00" },
    { timestamp: "09:54", record_id: "REC-2026-8902", incident_id: "POL-012", action: "Policy Threshold Updated", actor: "Rahul Verma (Director)", policy: "POL-OPS-012", reference: "AUD-8821", status: "Verified", amount: "N/A" }
  ],
  total: 4
};

export const DEMO_POLICIES_SUMMARY = {
  policies: [
    { id: "POL-OPS-012", code: "POL-OPS-012", title: "Refund & Credit Authorization Limits", clause_text: "All refund or credit requests exceeding $500.00 require Tier-3 Manager (Director) approval in Jira prior to execution. Maximum turnaround SLA is 48 business hours.", category: "billing", sla_hours: 48.0, max_refund_auto: 200.0, requires_approval_over: 500.0, version: "1.2.0", status: "active" },
    { id: "POL-SLA-ENT", code: "POL-SLA-ENT", title: "Enterprise Disruption Response Standard", clause_text: "Enterprise Tier-1 clients experiencing production-impacting outages (>99.9% degradation) must receive initial executive notification within 15 minutes and root cause postmortem within 24 hours.", category: "service_assurance", sla_hours: 2.0, max_refund_auto: 500.0, requires_approval_over: 2500.0, version: "2.0.1", status: "active" },
    { id: "POL-RET-009", code: "POL-RET-009", title: "Customer Retention & Emergency Credit Discretion", clause_text: "Staff-level customer engineers may extend courtesy credits up to $250.00 if customer churn probability exceeds 0.70 based on CRM scoring.", category: "retention", sla_hours: 4.0, max_refund_auto: 250.0, requires_approval_over: 250.0, version: "1.1.0", status: "active" },
    { id: "POL-SEC-004", code: "POL-SEC-004", title: "Data Loss & Token Revocation Protocol", clause_text: "In the event of suspected token leakage, security team must revoke keys immediately without customer consent.", category: "security", sla_hours: 0.5, max_refund_auto: 0.0, requires_approval_over: 0.0, version: "1.0.0", status: "active" }
  ],
  total_active: 4,
  categories: ["billing", "service_assurance", "retention", "security"],
  authority_matrix: [
    { tier: "Tier 1: Team Lead", max_amount: 500.0, sla_hours: 4.0 },
    { tier: "Tier 2: Operations Manager", max_amount: 1500.0, sla_hours: 24.0 },
    { tier: "Tier 3: VP Operations / Finance", max_amount: 2500.0, sla_hours: 48.0 },
    { tier: "Tier 4: CFO / Board Approval", max_amount: 10000.0, sla_hours: 72.0 }
  ]
};

export const DEMO_RISK_FINDINGS = {
  open_vulnerabilities: 4,
  high_risk_policies: 2,
  new_patterns: 3,
  tests_this_month: 126,
  findings: [
    {
      id: "RISK-01",
      test: "Sybil Burst Exploit",
      policy: "POL-OPS-012",
      weakness: "Static $500 threshold blind to burst arrival velocity and IP subnet clustering",
      risk_level: "HIGH",
      status: "MITIGATION REQUIRED",
      recommended_patch: "Enforce cluster entropy verification (entropy >= 0.45) on all claims within 10-minute arrival window."
    },
    {
      id: "RISK-02",
      test: "Split Claim Loopholes",
      policy: "POL-OPS-012",
      weakness: "Multiple claims below individual approval threshold submitted within 15 minutes",
      risk_level: "HIGH",
      status: "MITIGATION REQUIRED",
      recommended_patch: "Require aggregated rolling 24h account threshold enforcement."
    },
    {
      id: "RISK-03",
      test: "VIP Context Drift",
      policy: "POL-SLA-ENT",
      weakness: "Downgraded enterprise accounts retain expedited bypass privileges for 30 days",
      risk_level: "MEDIUM",
      status: "IN_REVIEW",
      recommended_patch: "Synchronize live billing CRM status into Moss retrieval context."
    }
  ]
};

export const DEMO_TIMELINE = {
  min_timestamp: "2026-08-01T08:00:00+00:00",
  max_timestamp: "2026-08-01T12:00:00+00:00",
  total_events: 5000,
  total_decisions: 500,
  checkpoints: [
    { timestamp: "2026-08-01T08:00:00+00:00", label: "08:00 AM", title: "Normal Operations Baseline", active_incident: false },
    { timestamp: "2026-08-01T09:30:00+00:00", label: "09:30 AM", title: "Latency Anomaly Detected", active_incident: false },
    { timestamp: "2026-08-01T10:15:00+00:00", label: "10:15 AM", title: "INC-8891 Multi-AZ Outage Declared", active_incident: true },
    { timestamp: "2026-08-01T10:30:00+00:00", label: "10:30 AM", title: "Refund Surge & Backlog Peak", active_incident: true },
    { timestamp: "2026-08-01T11:00:00+00:00", label: "11:00 AM", title: "Incident Mitigated & Playbook v2 Deployed", active_incident: false }
  ]
};

export function getDemoTimeMachineSnapshot(timestamp: string) {
  const isPeak = timestamp.includes("10:15") || timestamp.includes("10:30");
  return {
    target_timestamp: timestamp,
    hindsight_bias_protection: "ACTIVE — Zero future information leakage",
    state: {
      total_events_known: isPeak ? 3420 : 1240,
      future_events_masked: isPeak ? 1580 : 3760,
      total_decisions_known: isPeak ? 310 : 80,
      future_decisions_masked: isPeak ? 190 : 420,
      active_incident: {
        active: isPeak,
        incident_id: isPeak ? "INC-8891" : null,
        severity: isPeak ? "SEV-1 Critical" : "SEV-4 Normal",
        description: isPeak ? "Multi-Region Storage Shard Latency Spike" : "Systems nominal"
      },
      active_policies_count: 4,
      recent_events: [
        { id: "EV-01", type: "SLACK_MESSAGE", channel: "#outages", text: "Customer Acme experiencing 500 error burst" },
        { id: "EV-02", type: "STRIPE_CHARGE_FAILED", amount: 850.0, customer: "Acme Global" }
      ],
      recent_decisions: [
        { id: "DEC-01", action_taken: "approved_credit_850", actor_id: "Ananya R." }
      ],
      what_we_did_not_know_then: isPeak ? [
        "The incoming Sybil bot attack using $499 auto-refund loopholes",
        "Total customer churn ARR ($45,000) that would accumulate by 11:30 AM",
        "That POL-OPS-012 was being systematically bypassed by support staff in Slack war-rooms"
      ] : [
        "Full long-term retention recovery rate of customers receiving instant credits"
      ]
    }
  };
}

export const DEMO_MEMORY_SUMMARY = {
  retrieval_engine: "Moss L1 In-Memory Ring Buffer",
  p50_latency_ms: 1.2,
  cache_hit_rate: 0.984,
  events_indexed: 5000,
  decisions_indexed: 500,
  policies_indexed: 30,
  status: "OPERATIONAL",
  memory_tier: "L1 High-Frequency In-Memory"
};

export const DEMO_RELIABILITY_SUMMARY = {
  baseline_reliability: 42.5,
  v2_candidate_reliability: 98.2,
  sla_adherence_rate: "99.4%",
  mean_time_to_resolve_hours: "1.1 hrs (vs 48 hrs documented SOP)",
  total_decisions_executed: 1420,
  false_positive_rate: "0.2%"
};

export const DEMO_KNOWLEDGE_HEALTH = {
  overall_health_score: 86,
  decaying_items_count: 1,
  knowledge_items: [
    {
      id: "GENOME-APEX-BILLING-001",
      type: "Decision Genome",
      name: "Customer SLA Disruption Resolution",
      health_score: 82,
      last_validated: "17 days ago",
      contradiction_count: 1,
      usage_frequency: "48 queries / day",
      outcome_drift: "+14%",
      status: "NEEDS VALIDATION"
    },
    {
      id: "POL-OPS-012",
      type: "Policy",
      name: "Refund & Credit Authorization Limits",
      health_score: 91,
      last_validated: "4 days ago",
      contradiction_count: 1,
      usage_frequency: "120 evaluations / day",
      outcome_drift: "+2%",
      status: "HEALTHY"
    }
  ],
  contradictions: [
    {
      id: "CONTRA-01",
      policy_a: "POL-OPS-012",
      policy_b: "POL-SLA-ENT",
      description: "POL-OPS-012 requires 48h manager queue for >$500, while POL-SLA-ENT mandates 2h resolution for enterprise outages."
    }
  ],
  unknown_unknowns: [
    {
      id: "GAP-01",
      description: "No documented SOP for cross-region Cassandra storage degradation."
    }
  ]
};
