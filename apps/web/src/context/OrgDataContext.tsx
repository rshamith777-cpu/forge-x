import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { ORGANIZATIONS, type OrganizationProfile } from '../components/layout/AppShell';
import { addAuditLedgerRecord, saveStoredIncidents, localIncidents } from '../lib/api';

export interface OrgPerson {
  id: string;
  name: string;
  role: string;
  department: string;
  tenureYears: number;
  avatarBg: string;
}

export interface OrgPolicy {
  id: string;
  code: string;
  title: string;
  clauseText: string;
  category: string;
  slaHours: number;
  maxRefundAuto: number;
  requiresApprovalOver: number;
  version: string;
  status: 'active' | 'under_review' | 'deprecated';
}

export interface OrgDecision {
  id: string;
  title: string;
  context: string;
  actors: string[];
  evidenceIds: string[];
  policyId: string;
  workflowId: string;
  outcome: string;
  confidence: number;
  timestamp: string;
  claimedAmount?: number;
  status: 'approved' | 'escalated' | 'rejected' | 'bypassed';
  rationale: string;
  alternativesConsidered: string[];
}

export interface OrgCase {
  id: string;
  customer: string;
  tier: 'Enterprise' | 'Pro' | 'Starter';
  claimedAmount: number;
  issue: string;
  status: 'Open' | 'Resolved' | 'Escalated';
  durationHours: number;
  slaBreach: boolean;
  assignedTo: string;
  decisionId?: string;
  timestamp: string;
}

export interface OrgEvent {
  id: string;
  timestamp: string;
  employee: string;
  department: string;
  action: string;
  caseId: string;
  decisionId?: string;
  policyId?: string;
  system: string;
  details: string;
}

export interface OrgWorkflowNode {
  id: string;
  label: string;
  type: 'start' | 'activity' | 'decision_point' | 'end';
  durationMinutes: number;
  isBottleneck?: boolean;
  isUndocumented?: boolean;
  systemRef?: string;
  roleRef?: string;
}

export interface OrgWorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  frequency: number;
  probability: number;
  avgLatencyMinutes: number;
  isBypass?: boolean;
}

export interface OrgWorkflow {
  id: string;
  name: string;
  type: 'documented' | 'discovered';
  domain: string;
  conformanceRate?: number;
  nodes: OrgWorkflowNode[];
  edges: OrgWorkflowEdge[];
  bottlenecks: string[];
  deviations: string[];
}

export interface TwinGraphNode {
  id: string;
  label: string;
  type: 'person' | 'policy' | 'event' | 'decision' | 'system' | 'evidence' | 'workflow' | 'outcome';
  x: number;
  y: number;
  details: string;
  provenance: string;
  meta?: Record<string, any>;
}

export interface TwinGraphEdge {
  source: string;
  target: string;
  label: string;
  color?: string;
}

export interface DatasetSummary {
  events: number;
  decisions: number;
  customerCases: number;
  policies: number;
  people: number;
  workflows: number;
  systems: number;
  evidenceLinks: number;
}

export interface IngestionPipelineStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export interface SchemaMappingField {
  sourceField: string;
  detectedType: string;
  targetEntity: string;
  sampleValue: string;
  status: 'matched' | 'unrecognized';
}

export interface MossAnswer {
  question: string;
  answer: string;
  groundedFacts: string[];
  evidenceCards: {
    id: string;
    source: string;
    snippet: string;
    relevanceScore: number;
  }[];
  latencyMs: number;
}

// ----------------------------------------------------
// DETERMINISTIC DATA SEEDS (Domain: Customer Support & Refund Operations)
// ----------------------------------------------------

const SEED_PEOPLE: OrgPerson[] = [
  { id: 'emp_01', name: 'Sarah Chen', role: 'Staff Support Lead', department: 'Customer Engineering', tenureYears: 4.5, avatarBg: 'linear-gradient(135deg, #06b6d4, #2563eb)' },
  { id: 'emp_02', name: 'Marcus Vance', role: 'Support Engineer', department: 'Customer Engineering', tenureYears: 1.2, avatarBg: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 'emp_03', name: 'Elena Rostova', role: 'Senior Support Eng', department: 'Customer Engineering', tenureYears: 3.0, avatarBg: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
  { id: 'emp_04', name: 'David Kim', role: 'Engineering Manager', department: 'Support Operations', tenureYears: 5.0, avatarBg: 'linear-gradient(135deg, #dc2626, #f43f5e)' },
  { id: 'emp_05', name: 'Priya Sharma', role: 'TAM Director', department: 'Customer Success', tenureYears: 4.0, avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { id: 'emp_06', name: 'Alex Thorne', role: 'SRE Incident Commander', department: 'Platform Reliability', tenureYears: 3.5, avatarBg: 'linear-gradient(135deg, #0284c7, #0369a1)' },
  { id: 'emp_07', name: 'Jessica Taylor', role: 'Billing Specialist', department: 'Finance Ops', tenureYears: 2.1, avatarBg: 'linear-gradient(135deg, #ec4899, #be185d)' },
  { id: 'emp_08', name: 'Raj Patel', role: 'Principal Solutions Architect', department: 'Solutions', tenureYears: 3.8, avatarBg: 'linear-gradient(135deg, #6366f1, #4338ca)' },
  { id: 'emp_09', name: 'Daniel Lee', role: 'Billing Operations VP', department: 'Finance Ops', tenureYears: 6.1, avatarBg: 'linear-gradient(135deg, #14b8a6, #0f766e)' },
  { id: 'emp_10', name: 'Rachel Torres', role: 'Chief Operating Officer', department: 'Executive Leadership', tenureYears: 7.2, avatarBg: 'linear-gradient(135deg, #f97316, #c2410c)' },
];

const SEED_SYSTEMS = [
  'Stripe Billing Gateway',
  'Zendesk Ticketing',
  'Datadog APM & Telemetry',
  'Slack War Rooms (#incidents-war-room)',
  'Jira Service Management',
  'PagerDuty On-Call',
  'Salesforce CRM',
  'Snowflake Data Warehouse',
  'AWS Multi-Region Infrastructure',
  'Okta SSO & Identity Matrix',
  'GitHub Enterprise',
  'Confluence SOP Handbook'
];

const SEED_POLICIES: OrgPolicy[] = [
  {
    id: 'POL-OPS-012',
    code: 'POL-OPS-012',
    title: 'Refund & Credit Authorization Limits',
    clauseText: 'All refund or credit requests exceeding $500.00 require Tier-3 Manager (Director) approval in Jira prior to execution. Maximum turnaround SLA is 48 business hours. Agents issuing unauthorized refunds above $500 are subject to disciplinary review.',
    category: 'Billing Governance',
    slaHours: 48.0,
    maxRefundAuto: 200.0,
    requiresApprovalOver: 500.0,
    version: '1.2.0',
    status: 'active'
  },
  {
    id: 'POL-SLA-ENT',
    code: 'POL-SLA-ENT',
    title: 'Enterprise Disruption Response Standard',
    clauseText: 'Enterprise Tier-1 clients experiencing production-impacting outages (>99.9% degradation) must receive initial executive notification within 15 minutes and root cause postmortem within 24 hours.',
    category: 'Service Assurance',
    slaHours: 2.0,
    maxRefundAuto: 500.0,
    requiresApprovalOver: 2500.0,
    version: '2.0.1',
    status: 'active'
  },
  {
    id: 'POL-RET-009',
    code: 'POL-RET-009',
    title: 'Customer Retention & Emergency Credit Discretion',
    clauseText: 'Staff-level customer engineers may extend courtesy credits up to $1,500.00 if customer churn probability exceeds 0.70 based on CRM scoring during Sev-1 outages.',
    category: 'Retention',
    slaHours: 4.0,
    maxRefundAuto: 250.0,
    requiresApprovalOver: 1500.0,
    version: '1.1.0',
    status: 'active'
  },
  {
    id: 'POL-FIN-102',
    code: 'POL-FIN-102',
    title: 'Capital Clearing & Wire Exception Protocol',
    clauseText: 'Wire settlement exemptions require dual-key verification when variance exceeds 0.05% of transaction batch volume.',
    category: 'Finance Clearing',
    slaHours: 1.0,
    maxRefundAuto: 1000.0,
    requiresApprovalOver: 5000.0,
    version: '1.8.0',
    status: 'active'
  },
  {
    id: 'POL-HLTH-004',
    code: 'POL-HLTH-004',
    title: 'Critical EHR Telemetry Priority Response',
    clauseText: 'Healthcare provider webhook degradations require instant failover routing within 30 minutes with mandatory compliance logging.',
    category: 'Healthcare Compliance',
    slaHours: 0.5,
    maxRefundAuto: 2500.0,
    requiresApprovalOver: 2500.0,
    version: '3.1.0',
    status: 'active'
  }
];

const SEED_WORKFLOWS: OrgWorkflow[] = [
  {
    id: 'WF-DOC-001',
    name: 'Documented Enterprise Billing SOP',
    type: 'documented',
    domain: 'Customer Support / Refund Operations',
    conformanceRate: 0.38,
    nodes: [
      { id: 'doc_1', label: 'Customer Request Received', type: 'start', durationMinutes: 0 },
      { id: 'doc_2', label: 'Support Review & Triage', type: 'activity', durationMinutes: 45 },
      { id: 'doc_3', label: 'Formal Policy Check', type: 'activity', durationMinutes: 30 },
      { id: 'doc_4', label: 'Finance Review Queue', type: 'activity', durationMinutes: 720 },
      { id: 'doc_5', label: 'Manager Approval (> $500)', type: 'decision_point', durationMinutes: 2400, isBottleneck: true },
      { id: 'doc_6', label: 'Stripe Resolution & Payout', type: 'end', durationMinutes: 15 }
    ],
    edges: [
      { id: 'e1', source: 'doc_1', target: 'doc_2', frequency: 120, probability: 1.0, avgLatencyMinutes: 5 },
      { id: 'e2', source: 'doc_2', target: 'doc_3', frequency: 120, probability: 1.0, avgLatencyMinutes: 45 },
      { id: 'e3', source: 'doc_3', target: 'doc_4', frequency: 85, probability: 0.71, avgLatencyMinutes: 30 },
      { id: 'e4', source: 'doc_4', target: 'doc_5', frequency: 85, probability: 1.0, avgLatencyMinutes: 720 },
      { id: 'e5', source: 'doc_5', target: 'doc_6', frequency: 78, probability: 0.92, avgLatencyMinutes: 2400 }
    ],
    bottlenecks: ['Manager Approval (> $500) (48h Queue Delay)'],
    deviations: ['87% of high-value cases diverge around the manager queue']
  },
  {
    id: 'WF-DISC-001',
    name: 'Discovered Actual Incident Resolution Reality',
    type: 'discovered',
    domain: 'Customer Support / Refund Operations',
    conformanceRate: 0.94,
    nodes: [
      { id: 'disc_1', label: 'Customer Incident Outage Report', type: 'start', durationMinutes: 0 },
      { id: 'disc_2', label: 'Slack War Room Triage (#incidents)', type: 'activity', durationMinutes: 12, isUndocumented: true },
      { id: 'disc_3', label: 'Datadog Shard Latency Verification', type: 'activity', durationMinutes: 18, isUndocumented: true },
      { id: 'disc_4', label: 'Senior Staff Discretionary Bypass', type: 'decision_point', durationMinutes: 8, isUndocumented: true },
      { id: 'disc_5', label: 'Direct Stripe Credit ($750 - $1,500)', type: 'activity', durationMinutes: 5 },
      { id: 'disc_6', label: 'Resolution Confirmed (4.9 CSAT, 65m cycle)', type: 'end', durationMinutes: 0 }
    ],
    edges: [
      { id: 'de1', source: 'disc_1', target: 'disc_2', frequency: 114, probability: 0.95, avgLatencyMinutes: 4, isBypass: true },
      { id: 'de2', source: 'disc_2', target: 'disc_3', frequency: 114, probability: 1.0, avgLatencyMinutes: 12, isBypass: true },
      { id: 'de3', source: 'disc_3', target: 'disc_4', frequency: 98, probability: 0.86, avgLatencyMinutes: 18, isBypass: true },
      { id: 'de4', source: 'disc_4', target: 'disc_5', frequency: 98, probability: 1.0, avgLatencyMinutes: 8, isBypass: true },
      { id: 'de5', source: 'disc_5', target: 'disc_6', frequency: 98, probability: 1.0, avgLatencyMinutes: 5 }
    ],
    bottlenecks: ['None (65 minute average turnaround vs 48h SLA)'],
    deviations: ['Tacit bypass of POL-OPS-012 using VP Slack authorization']
  }
];

const SEED_DECISIONS: OrgDecision[] = [
  {
    id: 'DEC-0012',
    title: 'Direct Fast-Track Credit ($750)',
    context: 'Enterprise client ApexCloud experienced API Gateway disruption; churn risk 0.82.',
    actors: ['Sarah Chen (Staff Lead)', 'David Kim (Manager)'],
    evidenceIds: ['EVID-001 (Slack #incidents)', 'EVID-002 (Datadog latency telemetry)'],
    policyId: 'POL-OPS-012',
    workflowId: 'WF-DISC-001',
    outcome: 'Customer churn avoided; 5-star CSAT recorded in Zendesk; total credit $750 disbursed.',
    confidence: 0.94,
    timestamp: '2026-09-24T14:22:00Z',
    claimedAmount: 750,
    status: 'bypassed',
    rationale: 'Prioritizing customer retention over rigid 48h manager queue compliance based on executive Slack precedent.',
    alternativesConsidered: ['Route to 48h Jira manager queue (High churn risk)', 'Offer $200 standard credit without review (Rejected by client)']
  },
  {
    id: 'DEC-0018',
    title: 'Wire Latency Settlement Exception ($4,950)',
    context: 'FinTech Prime clearing rail breached 1.0h SLA window during market close.',
    actors: ['Marcus Vance', 'Elena Rostova'],
    evidenceIds: ['EVID-003 (SWIFT clearing ack)', 'EVID-004 (Risk ledger)'],
    policyId: 'POL-FIN-102',
    workflowId: 'WF-DOC-001',
    outcome: 'Voucher VCH-2026-X8841 issued with dual VP sign-off.',
    confidence: 0.98,
    timestamp: '2026-09-25T09:10:00Z',
    claimedAmount: 4950,
    status: 'approved',
    rationale: 'Mandatory contractual penalty triggered by P99.9 latency SLA breach.',
    alternativesConsidered: ['Dispute downtime measurement (Counter to telemetry)', 'Escalate to litigation reserve']
  },
  {
    id: 'DEC-0025',
    title: 'Critical Care Telemetry Priority Failover ($2,500)',
    context: 'Hospital EHR client HealthSync bio-telemetry queue backlog exceeding 400ms.',
    actors: ['Alex Thorne', 'Sarah Chen'],
    evidenceIds: ['EVID-005 (PagerDuty Sev-1 Incident)', 'EVID-006 (HL7 webhook log)'],
    policyId: 'POL-HLTH-004',
    workflowId: 'WF-DISC-001',
    outcome: 'Emergency priority lane allocated; credit applied to invoice.',
    confidence: 0.99,
    timestamp: '2026-09-25T18:45:00Z',
    claimedAmount: 2500,
    status: 'approved',
    rationale: 'Life-critical patient telemetry takes priority over financial threshold gating.',
    alternativesConsidered: ['Wait for scheduled overnight maintenance (Unacceptable safety risk)']
  },
  {
    id: 'DEC-0031',
    title: 'Sybil Burst Refund Interception (100 Bots)',
    context: 'Adversarial red-team flood: 100 bots claiming $499 each from subnet 198.51.100.0/24.',
    actors: ['Automated Decision Engine V2', 'David Kim'],
    evidenceIds: ['EVID-007 (Subnet entropy 0.18)', 'EVID-008 (Red Team Benchmark Run)'],
    policyId: 'POL-OPS-012',
    workflowId: 'WF-DOC-001',
    outcome: '94 bots blocked instantly; $33,433 fraud loss averted by Candidate V2 policy.',
    confidence: 0.97,
    timestamp: '2026-09-26T11:05:00Z',
    claimedAmount: 49900,
    status: 'rejected',
    rationale: 'Subnet cluster entropy 0.18 indicates coordinated Sybil burst despite sub-$500 threshold.',
    alternativesConsidered: ['V1 naive auto-approval (Approved 67 bots, catastrophic breach)', 'Global payment shutdown']
  }
];

const SEED_CASES: OrgCase[] = [
  { id: 'CASE-1042', customer: 'Acme Global Cloud', tier: 'Enterprise', claimedAmount: 1250, issue: 'API Gateway shard outage in us-east-1', status: 'Resolved', durationHours: 1.1, slaBreach: false, assignedTo: 'Sarah Chen', decisionId: 'DEC-0012', timestamp: '2026-09-24T14:00:00Z' },
  { id: 'CASE-1043', customer: 'FinTech Prime Corp', tier: 'Enterprise', claimedAmount: 4950, issue: 'Latency breach during clearing batch', status: 'Resolved', durationHours: 0.8, slaBreach: false, assignedTo: 'Elena Rostova', decisionId: 'DEC-0018', timestamp: '2026-09-25T08:50:00Z' },
  { id: 'CASE-1044', customer: 'HealthSync Bio', tier: 'Enterprise', claimedAmount: 2500, issue: 'EHR webhook telemetry degradation', status: 'Resolved', durationHours: 0.4, slaBreach: false, assignedTo: 'Alex Thorne', decisionId: 'DEC-0025', timestamp: '2026-09-25T18:30:00Z' },
  { id: 'CASE-1045', customer: 'OmniRetail Logistics', tier: 'Pro', claimedAmount: 850, issue: 'Checkout webhook timeout during flash sale', status: 'Escalated', durationHours: 5.2, slaBreach: true, assignedTo: 'Marcus Vance', timestamp: '2026-09-26T07:15:00Z' },
  { id: 'CASE-1046', customer: 'QuantumSec Defense', tier: 'Enterprise', claimedAmount: 8500, issue: 'GovCloud air-gap token synchronization delay', status: 'Open', durationHours: 0.2, slaBreach: false, assignedTo: 'Raj Patel', timestamp: '2026-09-26T12:00:00Z' }
];

const SEED_EVENTS: OrgEvent[] = [
  { id: 'EVT-5001', timestamp: '2026-09-24T14:02:11Z', employee: 'Sarah Chen', department: 'Customer Engineering', action: 'TICKET_TRIAGED', caseId: 'CASE-1042', system: 'Zendesk', details: 'Sev-1 client outage detected on us-east shard' },
  { id: 'EVT-5002', timestamp: '2026-09-24T14:05:40Z', employee: 'Sarah Chen', department: 'Customer Engineering', action: 'WAR_ROOM_JOINED', caseId: 'CASE-1042', system: 'Slack (#incidents-war-room)', details: 'Joined incident response thread with SRE team' },
  { id: 'EVT-5003', timestamp: '2026-09-24T14:14:02Z', employee: 'Alex Thorne', department: 'Platform Reliability', action: 'TELEMETRY_CONFIRMED', caseId: 'CASE-1042', system: 'Datadog', details: 'Shard latency spiked to 2,800ms between 13:40 and 14:10' },
  { id: 'EVT-5004', timestamp: '2026-09-24T14:19:35Z', employee: 'Sarah Chen', department: 'Customer Engineering', action: 'POLICY_EXCEPTION_INVOKED', caseId: 'CASE-1042', policyId: 'POL-RET-009', system: 'Confluence', details: 'Invoked tacit retention authority to prevent churn' },
  { id: 'EVT-5005', timestamp: '2026-09-24T14:22:00Z', employee: 'Sarah Chen', department: 'Customer Engineering', action: 'DIRECT_CREDIT_ISSUED', caseId: 'CASE-1042', decisionId: 'DEC-0012', system: 'Stripe Gateway', details: 'Disbursed $750 SLA credit directly to client account' },
  { id: 'EVT-5006', timestamp: '2026-09-24T14:25:10Z', employee: 'Sarah Chen', department: 'Customer Engineering', action: 'TICKET_RESOLVED', caseId: 'CASE-1042', system: 'Zendesk', details: 'Client confirmed receipt; CSAT 5/5 recorded' },
  { id: 'EVT-5007', timestamp: '2026-09-25T08:55:00Z', employee: 'Elena Rostova', department: 'Customer Engineering', action: 'SETTLEMENT_CALCULATED', caseId: 'CASE-1043', decisionId: 'DEC-0018', system: 'Snowflake', details: 'Batch clearing latency penalty tallied at $4,950' }
];

// Rich interactive graph nodes and edges for Organizational Digital Twin
const SEED_GRAPH_NODES: TwinGraphNode[] = [
  // People
  { id: 'usr_01', label: 'Sarah Chen (Staff Lead)', type: 'person', x: 120, y: 140, details: 'Customer Engineering Staff Lead with tacit bypass discretion and high retention authority.', provenance: 'Slack war room logs + HR Org Matrix', meta: { role: 'Staff Support Lead', tenure: '4.5 yrs', casesHandled: 420 } },
  { id: 'usr_02', label: 'David Kim (Engineering Mgr)', type: 'person', x: 120, y: 320, details: 'Support Operations Manager governing 48h Jira escalation queue.', provenance: 'Jira Service Management authority', meta: { role: 'Manager', queueLimit: '$500+' } },
  { id: 'usr_03', label: 'Alex Thorne (SRE Lead)', type: 'person', x: 120, y: 460, details: 'Platform Incident Commander verifying root cause shard telemetries.', provenance: 'Datadog incident responders log', meta: { role: 'Incident Commander', onCall: true } },

  // Policies
  { id: 'pol_01', label: 'POL-OPS-012 (Refund Policy)', type: 'policy', x: 420, y: 60, details: 'Documented rule mandating 48h manager review for refunds > $500.', provenance: 'Confluence SOP Handbook v1.2', meta: { rule: '> $500 requires Manager', sla: '48h' } },
  { id: 'pol_02', label: 'POL-RET-009 (Emergency Credit)', type: 'policy', x: 680, y: 60, details: 'Tacit guideline permitting up to $1,500 courtesy credit when churn score > 0.70.', provenance: 'Executive Memo / Slack #incidents', meta: { limit: '$1,500', churnThreshold: '0.70' } },

  // Decisions
  { id: 'dec_01', label: 'DEC-0012: Direct Fast-Track Credit ($750)', type: 'decision', x: 420, y: 220, details: 'Approved $750 credit to prevent enterprise customer churn without waiting for 48h queue.', provenance: 'GENOME-APEX-BILLING-001 (Immutable Trace)', meta: { amount: 750, confidence: 0.94, time: '65m cycle' } },
  { id: 'dec_02', label: 'DEC-0031: Sybil Bot Defense ($49,900)', type: 'decision', x: 420, y: 380, details: 'Candidate V2 policy intercepted 94 of 100 bots based on subnet cluster entropy < 0.45.', provenance: 'Red Team Adversarial Audit Run', meta: { v2InterceptRate: '94%', fraudPrevented: '$33,433' } },

  // Workflows
  { id: 'wf_01', label: 'WF-DISC-001 (Discovered 65m Path)', type: 'workflow', x: 700, y: 220, details: 'Empirical execution flow discovered across 5,000 trace events.', provenance: 'Process Mining Engine (Alpha Miner)', meta: { conformance: '94%', avgDuration: '65m' } },
  { id: 'wf_02', label: 'WF-DOC-001 (Documented 48h SOP)', type: 'workflow', x: 700, y: 360, details: 'Formal Confluence SOP showing 4-tier manager bottleneck.', provenance: 'Confluence Import', meta: { conformance: '38%', bottleneckDelay: '2,400 min' } },

  // Systems
  { id: 'sys_01', label: 'Stripe Billing System', type: 'system', x: 920, y: 150, details: 'Payment gateway executing live credits and customer vouchers.', provenance: 'Stripe webhook telemetry (api.stripe.com)', meta: { uptime: '99.99%', integration: 'Webhook + REST' } },
  { id: 'sys_02', label: 'Zendesk Support Portal', type: 'system', x: 920, y: 270, details: 'Official support portal where enterprise tickets originate.', provenance: 'Ticket ID: CASE-1042', meta: { queue: 'Enterprise Tier 1' } },
  { id: 'sys_03', label: 'Slack (#incidents-war-room)', type: 'system', x: 920, y: 400, details: 'Real-time collaborative hub where tacit bypass consensus is reached.', provenance: 'Slack Enterprise Grid API', meta: { messageVolume: '5,000+ msgs/wk' } },

  // Evidence
  { id: 'evi_01', label: 'EVID-001: VP Slack Authority Log', type: 'evidence', x: 420, y: 520, details: 'Prior VP message explicitly establishing fast-track credit authority during outages.', provenance: 'Slack message ID #msg-9921 in #war-room', meta: { author: 'Benjamin Clark (VP)', date: '2026-08-14' } },
  { id: 'evi_02', label: 'EVID-002: Datadog P99 Latency Telemetry', type: 'evidence', x: 680, y: 520, details: 'Metric datadog.shard.latency spiking above 2,800ms during incident.', provenance: 'Datadog APM shard-us-east-1', meta: { p99: '2,840ms', duration: '32m' } },

  // Events
  { id: 'evt_01', label: 'EVT-5001: Shard Latency Outage', type: 'event', x: 120, y: 60, details: 'Multi-region shard disruption affecting Enterprise tier accounts.', provenance: 'Datadog incident INC-882', meta: { severity: 'SEV-1', timestamp: '14:02:11' } },

  // Outcomes
  { id: 'out_01', label: 'OUT-01: Zero Enterprise Churn & 5/5 CSAT', type: 'outcome', x: 920, y: 520, details: 'Client retained with 100% contract renewal and 4.9 average satisfaction rating.', provenance: 'Salesforce CRM Churn Analytics', meta: { mrrSaved: '$45,000/mo', csat: '4.9/5.0' } }
];

const SEED_GRAPH_EDGES: TwinGraphEdge[] = [
  { source: 'evt_01', target: 'dec_01', label: 'triggered_by', color: '#f43f5e' },
  { source: 'usr_01', target: 'dec_01', label: 'executed_by', color: '#38bdf8' },
  { source: 'pol_01', target: 'dec_01', label: 'governed_by', color: '#fbbf24' },
  { source: 'pol_02', target: 'dec_01', label: 'exception_from', color: '#a855f7' },
  { source: 'evi_01', target: 'dec_01', label: 'justified_by', color: '#10b981' },
  { source: 'evi_02', target: 'dec_01', label: 'grounded_in', color: '#10b981' },
  { source: 'dec_01', target: 'wf_01', label: 'routed_through', color: '#06b6d4' },
  { source: 'dec_01', target: 'sys_01', label: 'applied_in', color: '#818cf8' },
  { source: 'wf_01', target: 'out_01', label: 'results_in', color: '#34d399' },
  { source: 'sys_02', target: 'usr_01', label: 'routed_to', color: '#64748b' },
  { source: 'sys_03', target: 'usr_01', label: 'collaborates_in', color: '#64748b' },
  { source: 'usr_02', target: 'wf_02', label: 'approves_in', color: '#f43f5e' },
  { source: 'dec_02', target: 'pol_01', label: 'mutates_policy', color: '#f43f5e' }
];

// ----------------------------------------------------
// CONTEXT INTERFACE
// ----------------------------------------------------

export interface OrgDataContextType {
  isLoaded: boolean;
  currentOrg: OrganizationProfile;
  setCurrentOrg: (org: OrganizationProfile) => void;
  selectOrganizationById: (id: string) => void;
  datasetSummary: DatasetSummary;
  people: OrgPerson[];
  policies: OrgPolicy[];
  decisions: OrgDecision[];
  cases: OrgCase[];
  events: OrgEvent[];
  workflows: OrgWorkflow[];
  systems: string[];
  twinNodes: TwinGraphNode[];
  twinEdges: TwinGraphEdge[];
  
  // Approvals & Governance State (shared across all views)
  approvedPlaybooks: Record<string, { status: string; version: string; approver: string; approvedAt: string; notes?: string }>;
  approvedPolicies: Record<string, any>;
  resolvedIncidents: Record<string, any>;
  isCandidateV2Approved: boolean;
  recordPlaybookApproval: (orgId: string, version: string, approver: string, notes?: string) => void;
  recordIncidentResolution: (incidentId: string, voucher: any) => void;
  recordPolicyAmendment: (policyId: string, updates: Partial<OrgPolicy>) => void;

  // Ingestion Pipeline State
  pipelineStatus: 'idle' | 'running' | 'completed' | 'error';
  pipelineSteps: IngestionPipelineStep[];
  currentStepIndex: number;
  uploadedFiles: { name: string; size: number; type: string; classification: string }[];
  schemaFields: SchemaMappingField[];
  unsupportedFields: string[];
  errorMessage: string | null;
  
  // Actions
  generateDemoOrganization: () => Promise<void>;
  uploadFiles: (files: FileList | File[]) => Promise<boolean>;
  updateSchemaMapping: (sourceField: string, targetEntity: string) => void;
  confirmAndBuildModel: () => Promise<void>;
  resetOrganization: () => void;
  askMoss: (question: string) => Promise<MossAnswer>;
  runForkRealitySimulation: (params: {
    thresholdAmount: number;
    requireManagerApproval: boolean;
    autoApproveEnterprise: boolean;
  }) => Promise<any>;
}

const OrgDataContext = createContext<OrgDataContextType | undefined>(undefined);

export const OrgDataProvider: React.FC<{ 
  children: ReactNode;
  currentOrg?: OrganizationProfile;
  onSelectOrg?: (org: OrganizationProfile) => void;
}> = ({ children, currentOrg: propOrg, onSelectOrg: propOnSelectOrg }) => {
  // Start with loaded state by default (or check localStorage) so existing views are populated immediately
  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('forge_org_loaded');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  // Current Organization management with persistence
  const [localOrg, setLocalOrg] = useState<OrganizationProfile>(() => {
    try {
      const savedId = localStorage.getItem('forge_selected_org_id');
      if (savedId) {
        const match = ORGANIZATIONS.find(o => o.id === savedId);
        if (match) return match;
      }
    } catch {}
    return ORGANIZATIONS[0];
  });

  const activeOrg = propOrg || localOrg;

  const setCurrentOrg = (org: OrganizationProfile) => {
    setLocalOrg(org);
    try {
      localStorage.setItem('forge_selected_org_id', org.id);
    } catch {}
    if (propOnSelectOrg) {
      propOnSelectOrg(org);
    }
  };

  const selectOrganizationById = (id: string) => {
    const match = ORGANIZATIONS.find(o => o.id === id);
    if (match) {
      setCurrentOrg(match);
    }
  };

  // Persistent Approvals & Governance State
  const [approvedPlaybooks, setApprovedPlaybooks] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem('forge_playbook_approvals');
      if (saved) return JSON.parse(saved);
    } catch {}
    // If Candidate V2 was previously approved in localStorage
    const v2Approved = localStorage.getItem('forge_v2_approved') === 'true';
    if (v2Approved) {
      return {
        'org-apexcloud': {
          status: 'approved',
          version: '2.0.0-rc1',
          approver: localStorage.getItem('forge_v2_reviewer') || 'Sarah Jenkins (VP of Operations)',
          approvedAt: localStorage.getItem('forge_v2_approved_at') || '2026-08-01 11:00 UTC',
          notes: 'Approved following empirical verification in FORGE LAB (94% adversarial defense rate).'
        }
      };
    }
    return {};
  });

  const [resolvedIncidents, setResolvedIncidents] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem('forge_resolved_incidents');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [approvedPolicies, setApprovedPolicies] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem('forge_approved_policies');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const isCandidateV2Approved = useMemo(() => {
    try {
      if (localStorage.getItem('forge_v2_approved') === 'true') return true;
    } catch {}
    return approvedPlaybooks[activeOrg.id]?.status === 'approved';
  }, [approvedPlaybooks, activeOrg.id]);

  const recordPlaybookApproval = (orgId: string, version: string, approver: string, notes?: string) => {
    const update = {
      ...approvedPlaybooks,
      [orgId]: {
        status: 'approved',
        version,
        approver,
        approvedAt: new Date().toUTCString(),
        notes: notes || 'Ratified and promoted to organizational memory.'
      }
    };
    setApprovedPlaybooks(update);
    try {
      localStorage.setItem('forge_playbook_approvals', JSON.stringify(update));
      localStorage.setItem('forge_v2_approved', 'true');
      localStorage.setItem('forge_v2_approved_at', new Date().toISOString());
      localStorage.setItem('forge_v2_reviewer', approver);
    } catch {}

    addAuditLedgerRecord({
      incident_id: "CAND-V2",
      action: "Candidate Playbook V2 Promoted to Production",
      actor: approver,
      policy: activeOrg.activePolicyId,
      reference: "PB-OPS-V2-SYBIL-HARDENED",
      status: "Cryptographically Verified",
      amount: "$33,433 Fraud Mitigated"
    });
  };

  const recordIncidentResolution = (incidentId: string, voucher: any) => {
    const update = {
      ...resolvedIncidents,
      [incidentId]: voucher
    };
    setResolvedIncidents(update);
    try {
      localStorage.setItem('forge_resolved_incidents', JSON.stringify(update));
    } catch {}

    const inc = localIncidents.find((i: any) => (i.id || '').toLowerCase() === incidentId.toLowerCase());
    if (inc) {
      inc.status = 'Resolved';
      inc.updated_at = 'Just now';
      saveStoredIncidents();
    }

    addAuditLedgerRecord({
      incident_id: incidentId,
      action: "Settlement Voucher Approved & Disbursed",
      actor: voucher.approver || 'Ananya R. (Operations Lead)',
      policy: voucher.governing_policy || activeOrg.activePolicyId,
      reference: voucher.voucher_reference,
      status: "Verified",
      amount: `$${(voucher.approved_amount || activeOrg.defaultClaim).toLocaleString()}`
    });
  };

  const recordPolicyAmendment = (policyId: string, updates: Partial<OrgPolicy>) => {
    const update = {
      ...approvedPolicies,
      [policyId]: {
        ...updates,
        amendedAt: new Date().toUTCString()
      }
    };
    setApprovedPolicies(update);
    try {
      localStorage.setItem('forge_approved_policies', JSON.stringify(update));
    } catch {}

    addAuditLedgerRecord({
      incident_id: policyId,
      action: "Policy Threshold & Rule Amended",
      actor: "Operations Lead",
      policy: policyId,
      reference: `AMEND-${Date.now().toString().slice(-6)}`,
      status: "Verified",
      amount: updates.maxRefundAuto ? `Limit: $${updates.maxRefundAuto}` : "Rule Amended"
    });
  };

  // Dynamic Scale Summary based on active Organization
  const datasetSummary = useMemo<DatasetSummary>(() => {
    if (!isLoaded) {
      return { events: 0, decisions: 0, customerCases: 0, policies: 0, people: 0, workflows: 0, systems: 0, evidenceLinks: 0 };
    }
    const scaleFactor = activeOrg.mrr / 45000;
    return {
      events: Math.round(5000 * Math.max(0.8, Math.min(2.5, scaleFactor))),
      decisions: Math.round(500 * Math.max(0.7, Math.min(2.0, scaleFactor))),
      customerCases: Math.round(120 * Math.max(0.7, Math.min(2.0, scaleFactor))),
      policies: activeOrg.id === 'org-quantumsec' ? 45 : (activeOrg.id === 'org-fintech-prime' ? 32 : 23),
      people: activeOrg.id === 'org-quantumsec' ? 40 : 20,
      workflows: activeOrg.id === 'org-fintech-prime' ? 14 : 8,
      systems: activeOrg.id === 'org-quantumsec' ? 20 : 12,
      evidenceLinks: Math.round(850 * Math.max(0.8, Math.min(2.3, scaleFactor)))
    };
  }, [isLoaded, activeOrg]);

  const [people] = useState<OrgPerson[]>(SEED_PEOPLE);
  const [policies] = useState<OrgPolicy[]>(SEED_POLICIES);
  const [decisions] = useState<OrgDecision[]>(SEED_DECISIONS);
  const [cases] = useState<OrgCase[]>(SEED_CASES);
  const [events] = useState<OrgEvent[]>(SEED_EVENTS);
  const [workflows] = useState<OrgWorkflow[]>(SEED_WORKFLOWS);

  // Dynamic Systems tailored to selected Organization
  const systems = useMemo<string[]>(() => {
    if (activeOrg.id === 'org-fintech-prime') {
      return [
        'SWIFT Clearing Gateway', 'High-Frequency Matching Engine', 'Stripe Banking API',
        'PCI-DSS Compliance Ledger', 'Datadog Shard APM', 'Slack War Rooms (#payments-wire)',
        'Snowflake Clearing Warehouse', 'Okta Dual-Key Auth'
      ];
    }
    if (activeOrg.id === 'org-healthsync') {
      return [
        'HL7 FHIR Webhook Broker', 'Epic & Cerner EHR Integrator', 'HIPAA Audit Vault',
        'PagerDuty Critical Telemetry', 'AWS GovCloud Bio-Cluster', 'Stripe Health Payouts',
        'Zendesk Priority Health Queue'
      ];
    }
    if (activeOrg.id === 'org-quantumsec') {
      return [
        'GovCloud Air-Gap Enclave', 'DoD IL5 Cryptographic Matrix', 'Air-Gapped Sovereign Node',
        'Hardware Security Module (HSM)', 'Datadog Sovereign Telemetry', 'ITAR Access Control'
      ];
    }
    if (activeOrg.id === 'org-omniretail') {
      return [
        'Shopify Plus Checkout Webhook', 'Magento Order Shard', 'Stripe Multi-Currency Gateway',
        'Klaviyo Flash Retention Engine', 'Datadog Checkout Telemetry', 'Zendesk Retail Support'
      ];
    }
    return SEED_SYSTEMS;
  }, [activeOrg.id]);

  // Dynamic Digital Twin Graph Nodes & Edges centered around active Organization
  const twinNodes = useMemo<TwinGraphNode[]>(() => {
    const nodes: TwinGraphNode[] = [
      // 1. Root Organization Node
      {
        id: 'root_org',
        label: `${activeOrg.name} (${activeOrg.tier})`,
        type: 'system',
        x: 520,
        y: 10,
        details: `${activeOrg.name} — Domain: ${activeOrg.domain}. Compliance: ${activeOrg.compliance}. MRR: $${activeOrg.mrr.toLocaleString()}. SLA: ${activeOrg.slaHours}h.`,
        provenance: 'Organizational Master Ledger',
        meta: { mrr: `$${activeOrg.mrr.toLocaleString()}`, sla: `${activeOrg.slaHours}h`, compliance: activeOrg.compliance, status: 'Active Production' }
      },
      // 2. Organization Governing Policy
      {
        id: 'pol_active',
        label: `${activeOrg.activePolicyId}: ${activeOrg.activePlaybook.slice(0, 32)}...`,
        type: 'policy',
        x: 380,
        y: 90,
        details: `Governing operational threshold: Auto-refund up to $${activeOrg.defaultClaim}. Target SLA: ${activeOrg.slaHours} hours.`,
        provenance: `${activeOrg.name} Governance Registry`,
        meta: { policyId: activeOrg.activePolicyId, sla: `${activeOrg.slaHours}h`, threshold: `$${activeOrg.defaultClaim}` }
      },
      // 3. Organization Active Decision
      {
        id: 'dec_active',
        label: `DEC-${activeOrg.id.toUpperCase().slice(4, 9)}: Active Claim ($${activeOrg.defaultClaim.toLocaleString()})`,
        type: 'decision',
        x: 380,
        y: 230,
        details: activeOrg.defaultSituation,
        provenance: `${activeOrg.mossNamespace} (Decision DNA)`,
        meta: { claim: `$${activeOrg.defaultClaim.toLocaleString()}`, confidence: 0.96 }
      },
      // 4. Candidate V2 Playbook Node (shows Ratified if approved)
      {
        id: 'cand_v2',
        label: isCandidateV2Approved ? 'Candidate Playbook V2 (RATIFIED & ACTIVE)' : 'Candidate Playbook V2 (IN REVIEW)',
        type: 'policy',
        x: 680,
        y: 90,
        details: isCandidateV2Approved 
          ? 'Synthesized compound exception EXC-FRAUD-SYBIL active in production. Subnet cluster entropy filter >= 0.45.'
          : 'Under review: Candidate policy patch awaiting executive human sign-off.',
        provenance: 'Executive Ratification Ledger',
        meta: { status: isCandidateV2Approved ? 'APPROVED' : 'PENDING', defenseRate: '94%' }
      },
      // 5. Workflows
      {
        id: 'wf_01',
        label: 'WF-DISC-001 (Observed Reality Path)',
        type: 'workflow',
        x: 680,
        y: 230,
        details: 'Empirical execution flow discovered across operational trace events.',
        provenance: 'Process Mining Engine (Alpha Miner)',
        meta: { conformance: '94%', avgDuration: `${activeOrg.slaHours * 30}m` }
      },
      // 6. People & Key Responders
      {
        id: 'usr_01',
        label: 'Ananya R. (Operations Lead)',
        type: 'person',
        x: 120,
        y: 120,
        details: `Lead operator governing ${activeOrg.name} incident resolution and authority dispatch.`,
        provenance: 'Slack war room logs + HR Org Matrix',
        meta: { role: 'Operations Lead', assignedTenant: activeOrg.name }
      },
      {
        id: 'usr_02',
        label: 'Sarah Jenkins (VP Finance/Ops)',
        type: 'person',
        x: 120,
        y: 280,
        details: 'Executive authority reviewing policy amendments, threshold breaches, and Candidate V2.',
        provenance: 'Executive Authorization Cockpit',
        meta: { role: 'VP Operations', signoffLimit: '$10,000+' }
      },
      // 7. System Connectors
      {
        id: 'sys_01',
        label: systems[0] || 'Stripe Billing System',
        type: 'system',
        x: 920,
        y: 130,
        details: `Core transaction settlement and voucher dispatch gateway for ${activeOrg.name}.`,
        provenance: 'Live Webhook Telemetry',
        meta: { uptime: '99.99%', integration: 'Webhook + REST' }
      },
      {
        id: 'sys_02',
        label: systems[1] || 'Datadog Shard APM',
        type: 'system',
        x: 920,
        y: 260,
        details: `Telemetry monitor streaming latency, error rates, and SLA adherence.`,
        provenance: 'Datadog APM API',
        meta: { status: 'Operational', latency: '1.2ms' }
      },
      // 8. Outcomes
      {
        id: 'out_01',
        label: `OUT-01: Zero Churn & Certified SLA Adherence`,
        type: 'outcome',
        x: 920,
        y: 420,
        details: `${activeOrg.name} contract SLA maintained; CSAT 4.9/5.0 recorded.`,
        provenance: 'Salesforce CRM Churn Analytics',
        meta: { mrrSaved: `$${activeOrg.mrr.toLocaleString()}/mo`, csat: '4.9/5.0' }
      },
      // 9. Evidence
      {
        id: 'evi_01',
        label: `EVID-001: P99 Telemetry Verification`,
        type: 'evidence',
        x: 380,
        y: 380,
        details: `Metric telemetry confirm outage duration and SLA breach boundary.`,
        provenance: 'Datadog APM Shard',
        meta: { p99: '2,840ms', verified: true }
      }
    ];

    // If an incident is resolved, add the Voucher Node
    const hasResolved = Object.keys(resolvedIncidents).length > 0;
    if (hasResolved) {
      nodes.push({
        id: 'vch_resolved',
        label: 'Certified Settlement Voucher (RESOLVED)',
        type: 'outcome',
        x: 680,
        y: 380,
        details: `Voucher issued and audited in compliance with ${activeOrg.activePolicyId}. Dual-key signoff verified.`,
        provenance: 'Cryptographic Settlement Rail',
        meta: { status: 'Verified', amount: `$${activeOrg.defaultClaim.toLocaleString()}` }
      });
    }

    return nodes;
  }, [activeOrg, isCandidateV2Approved, resolvedIncidents, systems]);

  const twinEdges = useMemo<TwinGraphEdge[]>(() => {
    const edges: TwinGraphEdge[] = [
      { source: 'root_org', target: 'pol_active', label: 'governed_by', color: activeOrg.accentColor },
      { source: 'root_org', target: 'cand_v2', label: 'evaluated_in', color: '#10b981' },
      { source: 'pol_active', target: 'dec_active', label: 'authorizes', color: '#fbbf24' },
      { source: 'usr_01', target: 'dec_active', label: 'executed_by', color: '#38bdf8' },
      { source: 'usr_02', target: 'cand_v2', label: 'ratifies', color: '#a855f7' },
      { source: 'dec_active', target: 'wf_01', label: 'routed_through', color: '#06b6d4' },
      { source: 'dec_active', target: 'sys_01', label: 'dispatches_via', color: '#818cf8' },
      { source: 'sys_02', target: 'dec_active', label: 'telemetry_feed', color: '#64748b' },
      { source: 'evi_01', target: 'dec_active', label: 'grounded_in', color: '#10b981' },
      { source: 'wf_01', target: 'out_01', label: 'results_in', color: '#34d399' }
    ];

    if (Object.keys(resolvedIncidents).length > 0) {
      edges.push({ source: 'dec_active', target: 'vch_resolved', label: 'produces_voucher', color: '#10b981' });
    }

    return edges;
  }, [activeOrg, resolvedIncidents]);

  // Ingestion Pipeline State
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'completed' | 'error'>(
    isLoaded ? 'completed' : 'idle'
  );

  const initialSteps: IngestionPipelineStep[] = useMemo(() => [
    { id: '1', label: 'Files received & validated', description: 'Checking checksums, structure, and UTF-8 encoding', status: isLoaded ? 'completed' : 'pending' },
    { id: '2', label: 'Schema detected & mapped', description: 'AI inference identifying timestamps, actors, and keys', status: isLoaded ? 'completed' : 'pending' },
    { id: '3', label: `Events extracted (${datasetSummary.events.toLocaleString()} records)`, description: `Parsing system interactions across ${systems.slice(0, 3).join(', ')}`, status: isLoaded ? 'completed' : 'pending' },
    { id: '4', label: `Decisions identified (${datasetSummary.decisions} decisions)`, description: 'Compiling atomic units of judgment and authority limits', status: isLoaded ? 'completed' : 'pending' },
    { id: '5', label: `Policies indexed (${datasetSummary.policies} active rules)`, description: 'Extracting SLA standards and threshold criteria', status: isLoaded ? 'completed' : 'pending' },
    { id: '6', label: `Customer cases linked (${datasetSummary.customerCases} cases)`, description: 'Associating ticket outcomes with financial records', status: isLoaded ? 'completed' : 'pending' },
    { id: '7', label: `Evidence relationships created (${datasetSummary.evidenceLinks} links)`, description: 'Synthesizing causal connections and provenance paths', status: isLoaded ? 'completed' : 'pending' },
    { id: '8', label: 'Organizational Digital Twin model updated', description: 'Real-time graph compiled into memory buffer', status: isLoaded ? 'completed' : 'pending' }
  ], [isLoaded, datasetSummary, systems]);

  const [pipelineSteps, setPipelineSteps] = useState<IngestionPipelineStep[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(isLoaded ? 8 : 0);

  // Files staged for the currently active organization
  const defaultUploadedFiles = useMemo(() => {
    const slug = activeOrg.id.replace('org-', '');
    return [
      { name: `${slug}_events_telemetry.csv`, size: 2649221, type: 'CSV', classification: 'Event Logs' },
      { name: `${slug}_decisions_ledger.json`, size: 323560, type: 'JSON', classification: 'Decision Records' },
      { name: `${slug}_support_cases.xlsx`, size: 28955, type: 'XLSX', classification: 'Customer Cases' },
      { name: `${slug}_sop_policies.docx`, size: 12067, type: 'DOCX', classification: 'Policies / SOPs' }
    ];
  }, [activeOrg.id]);

  const [customUploadedFiles, setCustomUploadedFiles] = useState<{ name: string; size: number; type: string; classification: string }[]>([]);

  const uploadedFiles = useMemo(() => {
    return [...defaultUploadedFiles, ...customUploadedFiles];
  }, [defaultUploadedFiles, customUploadedFiles]);

  const [schemaFields, setSchemaFields] = useState<SchemaMappingField[]>([
    { sourceField: 'timestamp', detectedType: 'ISO 8601 DateTime', targetEntity: 'Event Time', sampleValue: '2026-09-24T14:02:11Z', status: 'matched' },
    { sourceField: 'employee', detectedType: 'String (Actor ID)', targetEntity: 'Actor', sampleValue: 'Sarah Chen (emp_01)', status: 'matched' },
    { sourceField: 'department', detectedType: 'String (Org Unit)', targetEntity: 'Organization Unit', sampleValue: 'Customer Engineering', status: 'matched' },
    { sourceField: 'action', detectedType: 'String (Enum)', targetEntity: 'Event Type', sampleValue: 'DIRECT_CREDIT_ISSUED', status: 'matched' },
    { sourceField: 'case_id', detectedType: 'String (UUID/Key)', targetEntity: 'Case ID', sampleValue: 'CASE-1042', status: 'matched' },
    { sourceField: 'decision', detectedType: 'String (Action Key)', targetEntity: 'Decision', sampleValue: 'DEC-0012: Direct Credit', status: 'matched' },
    { sourceField: 'policy_id', detectedType: 'String (Policy Code)', targetEntity: 'Policy', sampleValue: 'POL-OPS-012', status: 'matched' },
    { sourceField: 'system', detectedType: 'String (System Identifier)', targetEntity: 'System', sampleValue: 'Stripe Billing Gateway', status: 'matched' }
  ]);

  const [unsupportedFields, setUnsupportedFields] = useState<string[]>([
    '_raw_telemetry_blob',
    'legacy_oracle_cursor_hex',
    'deprecated_session_cookie'
  ]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync isLoaded to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('forge_org_loaded', isLoaded ? 'true' : 'false');
    } catch {}
  }, [isLoaded]);

  // Generate deterministic demo organization with animated pipeline progression
  const generateDemoOrganization = async () => {
    setErrorMessage(null);
    setPipelineStatus('running');
    setCurrentStepIndex(0);

    const stepsCopy = initialSteps.map(s => ({ ...s, status: 'pending' as const }));
    setPipelineSteps(stepsCopy);

    for (let i = 0; i < stepsCopy.length; i++) {
      setCurrentStepIndex(i);
      setPipelineSteps(prev => prev.map((step, idx) => {
        if (idx < i) return { ...step, status: 'completed' as const };
        if (idx === i) return { ...step, status: 'running' as const };
        return { ...step, status: 'pending' as const };
      }));

      // Realistic pipeline step delay (300ms per step)
      await new Promise(res => setTimeout(res, 350));
    }

    setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'completed' as const })));
    setCurrentStepIndex(stepsCopy.length);
    setPipelineStatus('completed');
    setIsLoaded(true);
  };

  // Upload files handler with validation and error handling
  const uploadFiles = async (fileList: FileList | File[]): Promise<boolean> => {
    setErrorMessage(null);
    const filesArray = Array.from(fileList);

    if (filesArray.length === 0) {
      setErrorMessage('No files selected. Please select at least one valid organizational evidence file.');
      return false;
    }

    const allowedExtensions = ['csv', 'json', 'xlsx', 'pdf', 'docx', 'sql'];
    const invalidFiles = filesArray.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return !ext || !allowedExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      setErrorMessage(`Unsupported format in file(s): ${invalidFiles.map(f => f.name).join(', ')}. Supported formats are CSV, JSON, XLSX, PDF, DOCX, SQL.`);
      return false;
    }

    // Check for empty files
    const emptyFiles = filesArray.filter(file => file.size === 0);
    if (emptyFiles.length > 0) {
      setErrorMessage(`File ${emptyFiles[0].name} is empty (0 bytes). Please upload files containing data.`);
      return false;
    }

    // Auto classify files
    const classified = filesArray.map(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let classification = 'Other Evidence';
      const lower = file.name.toLowerCase();

      if (lower.includes('event') || lower.includes('log') || lower.includes('telemetry')) {
        classification = 'Event Logs';
      } else if (lower.includes('decision') || lower.includes('ledger') || lower.includes('approval')) {
        classification = 'Decision Records';
      } else if (lower.includes('case') || lower.includes('ticket') || lower.includes('incident')) {
        classification = 'Customer Cases';
      } else if (lower.includes('policy') || lower.includes('sop') || lower.includes('handbook') || lower.includes('rule')) {
        classification = 'Policies / SOPs';
      } else if (lower.includes('workflow') || lower.includes('process') || lower.includes('bpmn')) {
        classification = 'Workflow Data';
      } else if (lower.includes('sys') || lower.includes('infra') || lower.includes('server')) {
        classification = 'System Logs';
      }

      return {
        name: file.name,
        size: file.size,
        type: ext ? ext.toUpperCase() : 'UNKNOWN',
        classification
      };
    });

    setCustomUploadedFiles(prev => [...prev, ...classified]);

    // Update schema mappings based on files
    const sampleField = filesArray[0].name.toLowerCase().includes('json') ? 'event_payload' : 'row_data';
    setSchemaFields([
      { sourceField: 'timestamp', detectedType: 'ISO 8601 DateTime', targetEntity: 'Event Time', sampleValue: '2026-09-24T14:02:11Z', status: 'matched' },
      { sourceField: 'employee', detectedType: 'String (Actor ID)', targetEntity: 'Actor', sampleValue: 'Sarah Chen (emp_01)', status: 'matched' },
      { sourceField: 'department', detectedType: 'String (Org Unit)', targetEntity: 'Organization Unit', sampleValue: 'Customer Engineering', status: 'matched' },
      { sourceField: 'action', detectedType: 'String (Enum)', targetEntity: 'Event Type', sampleValue: 'DIRECT_CREDIT_ISSUED', status: 'matched' },
      { sourceField: 'case_id', detectedType: 'String (UUID/Key)', targetEntity: 'Case ID', sampleValue: 'CASE-1042', status: 'matched' },
      { sourceField: 'decision', detectedType: 'String (Action Key)', targetEntity: 'Decision', sampleValue: 'DEC-0012: Direct Credit', status: 'matched' },
      { sourceField: 'policy_id', detectedType: 'String (Policy Code)', targetEntity: 'Policy', sampleValue: 'POL-OPS-012', status: 'matched' },
      { sourceField: 'system', detectedType: 'String (System Identifier)', targetEntity: 'System', sampleValue: 'Stripe Billing Gateway', status: 'matched' }
    ]);

    setUnsupportedFields([sampleField, '_unmapped_hash_key', '_vendor_meta']);
    return true;
  };

  const updateSchemaMapping = (sourceField: string, targetEntity: string) => {
    setSchemaFields(prev => prev.map(field => 
      field.sourceField === sourceField ? { ...field, targetEntity } : field
    ));
  };

  const confirmAndBuildModel = async () => {
    await generateDemoOrganization();
  };

  const resetOrganization = () => {
    setIsLoaded(false);
    setPipelineStatus('idle');
    setCurrentStepIndex(0);
    setPipelineSteps(initialSteps.map(s => ({ ...s, status: 'pending' as const })));
    setCustomUploadedFiles([]);
  };

  // Moss Question-Answering over the ingested organization
  const askMoss = async (question: string): Promise<MossAnswer> => {
    // Artificial retrieval delay 120ms (simulating sub-10ms in-memory Moss L1 query)
    await new Promise(r => setTimeout(r, 120));

    const lower = question.toLowerCase();

    if (lower.includes('high-value') || lower.includes('refund') || lower.includes('longer') || lower.includes('slow')) {
      return {
        question,
        answer: `For ${activeOrg.name} (${activeOrg.domain}), high-value refund cases take significantly longer (avg 48.2 hours vs ${activeOrg.slaHours * 30} minutes) because Documented Policy ${activeOrg.activePolicyId} mandates an escalation queue for claims exceeding $${activeOrg.defaultClaim}. In 87% of urgent enterprise disruption cases, staff circumvent this queue via war-room bypass, whereas non-escalated cases sit idle awaiting manager review.`,
        groundedFacts: [
          `Documented Policy ${activeOrg.activePolicyId} requires Director sign-off for amounts > $${activeOrg.defaultClaim}`,
          `Target SLA for ${activeOrg.tier} is ${activeOrg.slaHours} hours`,
          `87% of enterprise outage traces diverge via operational bypass consensus`,
          `Average CSAT is 4.9/5.0 for bypassed cases vs 2.1/5.0 for queue-delayed cases`,
          `Compliance framework: ${activeOrg.compliance}`
        ],
        evidenceCards: [
          { id: 'EVID-001', source: `War Room Consensus Log (${activeOrg.mossNamespace})`, snippet: `Authorized fast-track credit discretion up to $${activeOrg.defaultClaim * 2} during Sev-1 outages to prevent churn.`, relevanceScore: 0.98 },
          { id: 'EVID-002', source: `${activeOrg.activePolicyId} Standard`, snippet: `All refund or credit requests exceeding $${activeOrg.defaultClaim} require Tier-3 Manager review prior to execution.`, relevanceScore: 0.94 },
          { id: 'EVID-003', source: 'Service Management Telemetry', snippet: `Average ticket dwell time in review queue: 41.8 hours across sample cases in Q3.`, relevanceScore: 0.91 }
        ],
        latencyMs: 1.2
      };
    }

    if (lower.includes('sybil') || lower.includes('bot') || lower.includes('attack') || lower.includes('fraud')) {
      const v2StatusText = isCandidateV2Approved 
        ? "Candidate V2 has been APPROVED & RATIFIED into active production memory."
        : "Candidate V2 is currently PENDING executive sign-off in the Governance Cockpit.";
      return {
        question,
        answer: `The 100-bot Sybil burst exploit exploited a blind spot in Playbook V1's static threshold ($500 limit). Coordinated bots requested $485-$499.50 within a 45-second burst. Candidate V2 mitigates this with the compound exception EXC-FRAUD-SYBIL, requiring subnet cluster entropy >= 0.45, intercepting 94% of malicious requests with 0% false positives on verified VIPs. ${v2StatusText}`,
        groundedFacts: [
          "Static single-predicate threshold failed to consider request velocity or IP subnet entropy",
          "100 distributed bots issued claims between $485.00 and $499.50",
          "Candidate V2 synthesized rule: IF amount < 500 AND subnet_cluster_entropy >= 0.45",
          `Production Status: ${isCandidateV2Approved ? 'RATIFIED & ENFORCED' : 'AWAITING APPROVAL'}`,
          `Target Organization: ${activeOrg.name}`
        ],
        evidenceCards: [
          { id: 'EVID-007', source: 'Red Team Benchmark Matrix (Synthetic)', snippet: '100 synthetic bots launched from 198.51.100.0/24 subnet during simulated latency spike.', relevanceScore: 0.99 },
          { id: 'EVID-008', source: 'Candidate V2 Playbook Spec', snippet: 'Rule RULE-V2-01: subnet_cluster_entropy < 0.45 triggers HALT_AND_REDIRECT_TO_FRAUD.', relevanceScore: 0.96 }
        ],
        latencyMs: 0.9
      };
    }

    // Default grounded answer
    return {
      question,
      answer: `Analysis of ${datasetSummary.events.toLocaleString()} ingested events for ${activeOrg.name} across ${systems.length} connected systems indicates that decision authority is bifurcated: formal procedures mandate ${activeOrg.slaHours * 24}h turnaround queues, but operational engineers rely on tacit precedents to maintain the ${activeOrg.slaHours}h contract SLA.`,
      groundedFacts: [
        `${datasetSummary.events.toLocaleString()} total trace events analyzed across ${systems.slice(0, 4).join(', ')}`,
        `${datasetSummary.decisions} decisions compiled with 94% average provenance grounding`,
        `${datasetSummary.policies} active corporate policies evaluated against observed behavior`,
        `Compliance certification: ${activeOrg.compliance}`,
        `Candidate V2 status: ${isCandidateV2Approved ? 'RATIFIED & ACTIVE' : 'PENDING'}`
      ],
      evidenceCards: [
        { id: 'EVID-GEN-01', source: `${activeOrg.name} Organizational Memory Store`, snippet: `Reconstructed ${datasetSummary.customerCases} customer incident traces with ${activeOrg.compliance} compliance backing.`, relevanceScore: 0.89 },
        { id: 'EVID-GEN-02', source: `${systems[0]} Telemetry`, snippet: `Verified financial settlement events totaling $${(activeOrg.mrr * 1.5).toLocaleString()} in approved customer vouchers.`, relevanceScore: 0.85 }
      ],
      latencyMs: 1.4
    };
  };

  // Fork Reality counterfactual simulation
  const runForkRealitySimulation = async (params: {
    thresholdAmount: number;
    requireManagerApproval: boolean;
    autoApproveEnterprise: boolean;
  }) => {
    await new Promise(r => setTimeout(r, 600));

    const isThresholdHigh = params.thresholdAmount >= 1500;
    const isApprovalRequired = params.requireManagerApproval;

    return {
      scenario_name: `${activeOrg.name} Rule Change: Threshold $${params.thresholdAmount} | Manager Req: ${isApprovalRequired}`,
      disclaimer: "SIMULATED SCENARIO ONLY — Based on 1,000 Monte Carlo discrete event simulations over ingested traces. Does not guarantee causal determinism in live production.",
      current_reality: {
        auto_approve_threshold: activeOrg.defaultClaim,
        avg_cycle_time_hours: activeOrg.slaHours * 2.5,
        auto_approved_count: Math.round(datasetSummary.decisions * 0.75),
        manager_bottleneck_hours: activeOrg.slaHours * 12,
        estimated_annual_cost: `$${(activeOrg.mrr * 0.4).toFixed(1)}M`,
        fraud_risk_score: "12.4% (Baseline)",
        csat_score: "3.8 / 5.0"
      },
      forked_reality: {
        auto_approve_threshold: params.thresholdAmount,
        avg_cycle_time_hours: isApprovalRequired ? activeOrg.slaHours * 4.0 : (isThresholdHigh ? 0.8 : activeOrg.slaHours),
        auto_approved_count: isThresholdHigh ? Math.round(datasetSummary.decisions * 0.9) : Math.round(datasetSummary.decisions * 0.6),
        manager_bottleneck_hours: isApprovalRequired ? activeOrg.slaHours * 18 : activeOrg.slaHours * 0.5,
        estimated_annual_cost: isThresholdHigh ? `$${(activeOrg.mrr * 0.55).toFixed(1)}M` : `$${(activeOrg.mrr * 0.3).toFixed(1)}M`,
        fraud_risk_score: isThresholdHigh ? "18.2% (Elevated without V2 filter)" : "4.1% (Low)",
        csat_score: isApprovalRequired ? "2.9 / 5.0 (Delays)" : "4.8 / 5.0 (Accelerated)"
      },
      impact_summary: {
        workflow: isApprovalRequired ? "Severe queue bottleneck; ticket queues backlog by +65%" : "Fast-path execution; 84% reduction in touchpoints",
        decision_path: isThresholdHigh ? "Direct staff auto-approval for claims under $" + params.thresholdAmount : "Standard escalation ladder",
        processing_time: isApprovalRequired ? "+54% slower resolution" : "-78% faster cycle time",
        bottlenecks: isApprovalRequired ? "Manager review queue becomes primary critical-path blocker" : "Manager queue eliminated for 85% of cases",
        risk: isThresholdHigh ? "Elevated exposure to split-claim and Sybil burst fraud" : "Minimal fraud exposure",
        resource_load: isApprovalRequired ? "Managers spend 18+ hrs/week reviewing routine credits" : "Saves estimated 340 management hours annually"
      }
    };
  };

  const value = {
    isLoaded,
    currentOrg: activeOrg,
    setCurrentOrg,
    selectOrganizationById,
    datasetSummary,
    people,
    policies,
    decisions,
    cases,
    events,
    workflows,
    systems,
    twinNodes,
    twinEdges,
    approvedPlaybooks,
    approvedPolicies,
    resolvedIncidents,
    isCandidateV2Approved,
    recordPlaybookApproval,
    recordIncidentResolution,
    recordPolicyAmendment,
    pipelineStatus,
    pipelineSteps,
    currentStepIndex,
    uploadedFiles,
    schemaFields,
    unsupportedFields,
    errorMessage,
    generateDemoOrganization,
    uploadFiles,
    updateSchemaMapping,
    confirmAndBuildModel,
    resetOrganization,
    askMoss,
    runForkRealitySimulation
  };

  return <OrgDataContext.Provider value={value}>{children}</OrgDataContext.Provider>;
};

export const useOrgData = (): OrgDataContextType => {
  const context = useContext(OrgDataContext);
  if (!context) {
    throw new Error('useOrgData must be used within an OrgDataProvider');
  }
  return context;
};
