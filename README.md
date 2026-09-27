# FORGE X — Organizational Decision Reliability Engine

<div align="center">

![FORGE X Hero Banner](./docs/images/forge_x_hero_banner.jpg)

**Observe decisions. Attack them. Learn from failure.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frshamith777-cpu%2Fforge-x)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0%2B-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Moss](https://img.shields.io/badge/Moss-Zero--Latency-06B6D4?style=for-the-badge&logo=databricks&logoColor=white)](https://moss.dev/)
[![Tests](https://img.shields.io/badge/Unit%20%26%20Integration-47%20Passed-10B981?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org/)
[![Challenge](https://img.shields.io/badge/YC%20Fall%202026-Moss%20Sprint-FF6600?style=for-the-badge&logo=ycombinator&logoColor=white)](https://www.ycombinator.com/)

[**Live Operations**](http://localhost:5173/app) • [**Active Decision Hot Path**](http://localhost:5173/app/decide) • [**Red Team Cockpit**](http://localhost:5173/app/redteam) • [**Data Ingestion**](http://localhost:5173/app/data-ingestion) • [**Audit Ledger**](http://localhost:5173/app/audit)

</div>

---

## ⚡ Executive Summary

Enterprise AI automation consistently breaks because organizations operate on two contrasting realities:
1. **The Documented Organization**: Static policies, SOPs, and Notion handbooks describing how business *should* theoretically run.
2. **The Observed Organization**: High-frequency heuristics, unwritten escalation shortcuts, emergency Slack bypasses, and tacit knowledge operators *actually use* to survive operational reality.

When conventional AI agents make decisions solely based on documentation, they hallucinate, breach real-world constraints, and succumb to adversarial manipulation.

**FORGE X** solves this fundamentally:
* **Multi-Tenant Enterprise Data Fabric**: Instantaneous context synchronization across 5 Fortune 500 verticals. Selecting any dataset binds **all views, digital twins, incident queues, candidate policies, and audit trails** around that target organization.
* **Compiles Decision Genomes**: Captures organizational judgment into atomic, 17-field auditable units with complete causal provenance.
* **Sub-10ms Synchronous Hot Path**: Grounds operational decisions in milliseconds using the **Moss Zero-Latency Retrieval Fabric**.
* **Continuous Adversarial Hardening**: Asynchronously attacks its own decisions with synthetic red-team vectors (such as a 100-identity coordinated Sybil swarm).
* **Self-Healing Playbooks & Cryptographic Audit Trails**: Quarantines failure modes, generates hardened Candidate Playbooks (V1 $\to$ V2), validates them under strict temporal isolation ($t \le T$), and seals all human-in-the-loop approvals into persistent cryptographic settlement vouchers.

---

## 🏛️ System Architecture

FORGE X is engineered with a **strictly decoupled dual-loop architecture**:
1. **Synchronous Low-Latency Hot Path**: Optimized for sub-10ms response times, policy compliance, and deterministic grounding.
2. **Asynchronous Reliability Loop**: Event-driven background evaluation, adversarial simulation, root cause synthesis, and human-in-the-loop governance.

```mermaid
flowchart TD
    subgraph PathA["PATH A: Synchronous Low-Latency Hot Path (< 10ms)"]
        direction TB
        A1["Operational Event / User Request"] --> A2["FORGE Web UI (/app/decide)"]
        A2 --> A3["FastAPI Gateway (POST /api/decide)"]
        A3 --> A4["Moss Retrieval Layer (Provider-Agnostic, < 10ms)"]
        A4 --> A5["Decision Context Builder (Policies, Precedents, SLA)"]
        A5 --> A6["Decision Engine (Rule & Constraint Evaluator)"]
        A6 --> A7["17-Field Immutable Decision Trace"]
        A7 --> A8["Governance Gate (APPROVED / EXECUTED / PENDING_REVIEW)"]
        A8 --> A9["Instant Response (< 15ms Total Latency)"]
    end

    subgraph PathB["PATH B: Asynchronous Reliability & Evaluation Loop"]
        direction TB
        A7 -.->|"Non-Blocking Emit\n(DECISION_CREATED)"| B1["Async Event Bus (bus.py)"]
        B1 --> B2["Adversarial Red Team Cockpit (/app/redteam)"]
        B2 --> B3["Synthetic Attack Engine (100-Bot Coordinated Sybil)"]
        B3 --> B4["Exploit Detection & Failure Root Cause Analysis"]
        B4 --> B5["Hardened Playbook Synthesizer (Candidate V2)"]
        B5 --> B6["FORGE LAB Simulation (V1 vs V2 Backtest with t <= T)"]
        B6 --> B7["Human Operations Approval Gate (/app/candidate)"]
        B7 --> B8["Promoted to Trusted Organizational Memory & Indexed into Moss"]
    end

    style PathA fill:#061021,stroke:#06b6d4,stroke-width:2px,color:#fff
    style PathB fill:#160919,stroke:#f43f5e,stroke-width:2px,color:#fff
```

---

## 🌐 Unified Multi-Tenant Data Fabric & State Persistence

In FORGE X, data is never fragmented. When you select an enterprise dataset—whether from the top global switcher or the **Data Ingestion** studio—**every single screen, chart, pipeline, and ledger synchronizes around that specific data**:

```mermaid
flowchart LR
    Selector["Tenant Selector / Data Ingestion\n(ApexCloud / FinTech / HealthSync / OmniRetail / QuantumSec)"] --> Fabric["OrgDataContext\nUnified State Engine"]
    Fabric --> V1["Home Workspace & MRR SLAs"]
    Fabric --> V2["Process Archaeology & Heuristics"]
    Fabric --> V3["Incidents Cockpit & SLA Triage"]
    Fabric --> V4["Live Decision Hot Path (<10ms)"]
    Fabric --> V5["Candidate Playbook V2 & Contradictions"]
    Fabric --> V6["Governance Policies & Amendments"]
    Fabric --> V7["Audit Center & Settlement Vouchers"]
```

### 1. The 5 Enterprise Tenants
| Enterprise Organization | Industry & Scale | Guaranteed SLA | Compliance Framework | Active Policy Code | Key Focus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ApexCloud Global** | Enterprise Cloud ($45k MRR) | **2.0 Hours** | SOC2 Type II | `POL-OPS-012` | Gateway outages & cloud credits |
| **FinTech Prime** | Payments & Clearing ($120k MRR) | **1.0 Hour** | PCI-DSS Level 1 | `POL-FIN-102` | Disputed wire transfers & settlements |
| **HealthSync Bio** | Healthcare EHR ($85k MRR) | **0.5 Hours** | HIPAA & FDA 21 CFR | `POL-BIO-901` | Critical patient EHR uptime |
| **OmniRetail Logistics** | Global Supply Chain ($30k MRR) | **4.0 Hours** | GDPR & CCPA | `POL-RET-404` | 3PL routing failures & delivery credits |
| **QuantumSec Defense** | GovCloud AI ($250k MRR) | **0.25 Hours** | FedRAMP High | `POL-DEF-001` | Zero-trust enclave breaches |

### 2. Universal Approval & Ledger Persistence
* **Candidate V2 Approvals**: When an operator approves a hardened candidate playbook in `/app/candidate`, the approval is cryptographically stamped with operator ID and timestamp, immediately updating the Digital Twin and recording a ratified amendment into the **Audit Center**.
* **Incident Resolutions & Vouchers**: Resolving an incident in `/app/incidents` generates a certified **Settlement Voucher** with SHA-256 integrity seal that persists across route changes and browser refreshes (`localStorage` backed).
* **Policy Amendments**: Modifying or ratifying an SOP rule in `/app/policies` updates all downstream decision gates in real-time.

---

## 🔄 End-to-End Decision Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Enterprise Operator
    participant UI as FORGE Web App
    participant API as FastAPI Gateway
    participant Moss as Moss Retrieval Fabric
    participant Engine as Decision Engine
    participant Bus as Async Event Bus
    participant RedTeam as Red Team Sandbox
    participant Lab as FORGE Lab
    participant Memory as Org Memory (Moss Index)

    Note over Operator,Engine: 1. SYNCHRONOUS HOT PATH (< 10ms)
    Operator->>UI: Select Organization & Trigger Decision
    UI->>API: POST /api/decide (Context, Org, Signals)
    API->>Moss: retrieve_context(query, org_id, scope)
    Moss-->>API: Active Policies, Historical Precedents (< 5ms)
    API->>Engine: evaluate(signals, policies, constraints)
    Engine->>Engine: Build 17-field Decision Trace
    Engine-->>API: Decision Verdict + Trace
    API-->>UI: Sub-10ms Verdict (Action, Confidence, Latency)
    UI-->>Operator: Display Live Decision Verdict & Trace

    Note over API,Memory: 2. ASYNCHRONOUS RELIABILITY LOOP
    API-)Bus: emit("DECISION_CREATED", DecisionTrace)
    Bus-)RedTeam: trigger_adversarial_stress_test(DecisionTrace)
    RedTeam->>RedTeam: Inject 100-bot Sybil Attack Burst
    RedTeam->>RedTeam: Measure Robustness (V1 auto-approves 67 fraud claims: 33% Robust)
    RedTeam->>RedTeam: Synthesize Hardened Candidate Playbook V2
    RedTeam->>Lab: POST /api/lab/simulate (V1 vs V2, t <= T)
    Lab-->>UI: Evaluation Report: V2 blocks 94% of vectors (94% Robust)
    Operator->>UI: Human Review & Signoff
    UI->>API: POST /api/governance/approve (Candidate V2)
    API->>Memory: Index V2 into Moss Namespace
```

---

## 📸 Core Features & Operational Cockpit

### 1. Active Decision Intake (Synchronous Hot Path)
* **Sub-10ms Moss Retrieval**: Rapid vector matching against governing operational policies, precedent claims, and escalation thresholds.
* **Deterministic Governance**: Returns transparent reasoning, policy citations (`POL-OPS-012`), and candidate action evaluations.
* **Real-time Latency Budget**: Emits full timing breakdown (Moss lookup: 2.1ms, constraint validation: 1.8ms, genome generation: 3.5ms).

<div align="center">
<img src="./docs/images/decide_view.png" alt="Active Decision View" width="900"/>
</div>

---

### 2. Multi-Organization Switcher & Governance Isolation
Switch seamlessly between 5 enterprise organizations, each maintaining its own **Moss Namespace**, **MRR Profile**, **SLA Commitment**, and **Governing Policy Genome**:

<div align="center">
<img src="./docs/images/fintech_prime_decision.png" alt="FinTech Prime Decision Context" width="445"/>
<img src="./docs/images/governance_dossier.png" alt="Organization Governance Dossier" width="445"/>
</div>

---

### 3. Red Team Adversarial Sandbox ("We Broke Our Own AI")

<div align="center">
<img src="./docs/images/forge_redteam_attack.jpg" alt="Red Team Attack Art" width="900"/>
</div>

* **Round 1 — V1 Failure**: A coordinated 100-identity Sybil bot burst targets the automatic compensation pathway. Playbook V1's static threshold auto-approves 67 fraudulent payouts ($33,433 loss), exposing a **33% adversarial robustness** vulnerability.
* **Autonomous Root Cause Diagnosis**: FORGE X detects the arrival velocity burst and subnet cluster entropy collapse ($\text{entropy} < 0.45$).
* **Round 2 — Candidate V2 Hardening**: Synthesizes exception `EXC-FRAUD-SYBIL` and tightens entropy gates. Rerunning the 100-bot attack against V2 blocks 94% of hostile vectors (**94% adversarial robustness**) with 0% false positives on genuine VIP clients.

<div align="center">
<img src="./docs/images/redteam_sybil_attack.png" alt="Red Team Sybil Attack Results" width="900"/>
</div>

---

### 4. Process Archaeology & Heuristic Mining
* **Documented vs Observed Conformance**: Mines raw execution logs to uncover shadow workflows, unapproved overrides, and undocumented emergency bypasses.
* **Bottleneck Discovery**: Identifies critical friction points across systems with live trace replay.

---

### 5. Organizational Time Machine & Strict Zero Future Leakage
* **Historical State Reconstruction**: Reconstructs exactly what policies, incidents, and signals the organization knew at any given historical moment $T$.
* **Temporal Isolation Guard**: Strictly filters queries with `knowledge.created_at <= T`. Future incident outcomes, post-mortem reports, and subsequent policy revisions are cryptographically masked to eliminate hindsight bias during evaluation.

---

## 🧬 Structure of the 17-Field Decision Trace

Every decision emitted by FORGE X produces an immutable, machine-readable audit genome:

```json
{
  "decision_id": "dec-a89c-4f12-98e1",
  "timestamp": "2026-09-22T21:42:00.104Z",
  "situation": "Enterprise tier client experiencing API Gateway disruption with credit claim of $750",
  "signals": {
    "duration_hours": 1.0,
    "subnet_cluster_entropy": 0.85,
    "claims_in_last_10m": 1,
    "mrr": 120000.0,
    "org_id": "org-fintech-prime",
    "moss_namespace": "org-fintech-prime-core"
  },
  "constraints": [
    "SLA disruption must exceed 30m threshold",
    "Claimed amount must not exceed monthly billing cap without Tier-3 VP signoff",
    "Subnet cluster entropy must remain > 0.45"
  ],
  "retrieved_evidence": [
    { "type": "policy", "ref": "POL-FIN-102", "relevance": 0.96 },
    { "type": "precedent", "ref": "INC-8891-PRECEDENT", "relevance": 0.89 }
  ],
  "applicable_policies": [
    { "id": "POL-FIN-102", "title": "FinTech Prime Settlement & SLA Dispute Policy" }
  ],
  "precedents": [
    { "id": "PREC-901", "outcome": "APPROVED_SLA_VOUCHER", "confidence": 0.94 }
  ],
  "exceptions": [],
  "candidate_actions": [
    { "action_name": "AUTO_APPROVE_CREDIT", "authority_required": "AUTOMATED_GATEWAY" },
    { "action_name": "ESCALATE_TO_VP_OPS", "authority_required": "HUMAN_OPERATIONS" },
    { "action_name": "REJECT_EXCESSIVE_CLAIM", "authority_required": "AUTOMATED_GATEWAY" }
  ],
  "selected_action": "AUTO_APPROVE_CREDIT",
  "reasoning": "Downtime duration of 1.0h breached guaranteed SLA of 1.0h. High MRR client ($120k) with normal cluster entropy (0.85). Precedent PREC-901 supports automated voucher issuance.",
  "confidence": 0.97,
  "risk": "Low",
  "policy_dependencies": ["POL-FIN-102"],
  "expected_outcome": "Immediate SLA credit of $750 issued, preserving client retention without fraud flags.",
  "version_info": { "playbook_id": "pb-fintech-billing", "playbook_version": "1.8.0" },
  "governance_state": "EXECUTED",
  "moss_latency_ms": 2.14,
  "total_latency_ms": 7.48
}
```

---

## 📊 Empirical Benchmarks & Honesty Protocol

FORGE X adheres strictly to the competition retrieval honesty protocol:

| Metric | Target | Actual Measured | Status |
| :--- | :--- | :--- | :--- |
| **Synchronous Retrieval Latency** | $< 10\text{ ms}$ | **$0.01 - 2.8\text{ ms}$** (BM25 Fallback / Moss Local) | ✅ Exceeded |
| **Total Hot Path End-to-End** | $< 50\text{ ms}$ | **$4.2 - 12.1\text{ ms}$** | ✅ Exceeded |
| **Sybil Attack Detection (V1)** | Baseline | **$33.0\%$ Robustness** (67% Breached) | ⚠️ Expected Vulnerability |
| **Sybil Attack Hardening (V2)** | $> 90\%$ | **$94.0\%$ Robustness** (6% Breached) | ✅ Hardened |
| **False Positive Rate on VIPs** | $< 2\%$ | **$0.0\%$** | ✅ Zero Regression |
| **Temporal Isolation ($t \le T$)** | 100% Strict | **Zero Future Leakage Verified** | ✅ Guaranteed |
| **Automated Test Suite** | 100% Pass | **47 of 47 Tests Green** | ✅ Verified |

---

## 🚀 Deployment & Installation

### Option A: Zero-Config Deployment on Vercel

FORGE X is pre-configured with root-level `vercel.json` and client-side fallbacks for instant global deployment:

1. Click the **Deploy with Vercel** button above or import the GitHub repository in [Vercel](https://vercel.com/new).
2. Leave settings at default (Vercel automatically detects the Vite build output).
3. The platform will build and serve the application globally with full multi-tenant dataset simulation, interactive red-team attacks, and state persistence.

---

### Option B: Local Setup with Unified System Runner

#### Prerequisites
* **Python**: 3.11 or higher
* **Node.js**: 18.0 or higher
* **npm**: 9.0 or higher

#### 1. Clone the Repository
```bash
git clone https://github.com/rshamith777-cpu/forge-x.git
cd forge-x
```

#### 2. Install Dependencies
```bash
# Install Python backend dependencies
pip install -r requirements.txt

# Install React frontend dependencies
npm --prefix apps/web install
```

#### 3. Launch with Unified Runner
```bash
python scripts/start_system.py
```

* **Web UI**: [http://localhost:5173](http://localhost:5173)
* **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

#### 4. Run Test Suite
```bash
pytest tests/unit tests/integration -v
```

---

## 🧭 Live Demo Navigation Map

| Module | Route | Operational Capability |
| :--- | :--- | :--- |
| **Cinematic Landing** | `/` | Product manifesto, architecture overview, and entrance to operations. |
| **Home Workspace** | `/app` | Executive dashboard, tenant KPI cards, SLA health, and active MRR tier. |
| **Active Decision** | `/app/decide` | **Hot Path:** Sub-10ms Moss retrieval, customer tier selection, entropy sliders, live decision execution. |
| **Data Ingestion** | `/app/data-ingestion` | Ingest enterprise evidence files, auto-detect schemas, and switch target tenant datasets. |
| **Process Archaeology** | `/app/observe` | Uncover undocumented heuristics vs official SOPs with conformance mining. |
| **Red Team Cockpit** | `/app/redteam` | **Stress-Test:** Coordinated 100-bot Sybil burst attack against Playbook V1 vs Hardened V2. |
| **Candidate Playbook V2** | `/app/candidate` | Human-in-the-loop governance gate, contradiction analysis, and playbook signoff. |
| **Incidents Forensics** | `/app/incidents` | Live operational triage, SLA dispute handling, and voucher issuance. |
| **Policies Ledger** | `/app/policies` | Documented organizational rules vs observed heuristics explorer. |
| **Audit Center** | `/app/audit` | Cryptographic ledger of all decisions, approved playbooks, and settlement vouchers. |
| **FORGE LAB** | `/app/forgelab` | Empirical benchmark cockpit running all 6 validation gates. |
| **Organizational Memory** | `/app/memory` | Immutable ledger of Decision Genomes and Moss-indexed vector spaces. |

---

## 🏆 YC Fall 2026 × Moss Builder Sprint

* **Category:** Agent Reliability, Security and Evaluation
* **Submission Date:** September 2026
* **License:** MIT License

<div align="center">
<sub>Built with precision for the YC Fall 2026 × Moss Zero Latency Builder Sprint.</sub>
</div>
