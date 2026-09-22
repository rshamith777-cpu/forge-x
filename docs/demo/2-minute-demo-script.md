# FORGE X — 2-Minute Competition Demo Script

> **Competition Track:** YC Fall 2026 × Moss Zero Latency Builder Sprint  
> **Tagline:** *From how people work → to how machines can reason.*  
> **Core Promise:** *Documentation tells you how a company says it works. FORGE learns how it actually works.*

---

## 0:00 – 0:15: Documented vs Actual Organization
* **Click**: `OBSERVE` → `Process Archaeology` (`/archaeology`).
* **Say**:
  > *"Every company has two operating systems: the one documented in formal SOPs, and the one employees actually use to get work done."*
* **Show**:
  * Point to the side-by-side comparison.
  * On the left: The formal documented SOP requiring a rigid 48-hour Director review queue.
  * On the right: The empirical reality discovered from 5,000 real event traces across Slack, Stripe, and Jira.

---

## 0:15 – 0:30: Discovered Workflow & Undocumented Exceptions
* **Stay on**: `Process Archaeology`.
* **Say**:
  > *"In 87% of traces during production outages, staff engineers completely bypass the manager queue using a fast-track Slack war-room shortcut, resolving client issues in under 65 minutes with a 4.9 CSAT rating.*
  > *FORGE doesn't just retrieve static documents. It reconstructs how decisions actually happen."*
* **Show**:
  * Highlight the cyan `refund_issued_direct` shortcut node and the detected policy contradiction.

---

## 0:30 – 0:45: The Decision Genome & "Why Did We Do That?"
* **Click**: `UNDERSTAND` → `Decision Genomes` (`/genomes`).
* **Say**:
  > *"We compile this institutional judgment into machine-readable Decision Genomes. Here is `GENOME-APEX-BILLING-001`. It captures observable signals, constraints, mined exceptions, and the tacit assumption: that enterprise churn risk outweighs short-term refund OPEX.*
  > *And look at the 'Why Did We Do That?' panel below: every single step traces backward into real verifiable evidence without post-hoc hallucination."*
* **Show**:
  * Point to the Decision DNA card (Situation, Signals, Tacit Assumptions, Exceptions, 94% Confidence).
  * Point to the 7-step backward provenance trace at the bottom.

---

## 0:45 – 1:00: Red Team Hero: "WE BROKE OUR OWN AI"
* **Click**: `RED TEAM` → `We Broke Our Own AI` (`/red-team`).
* **Say**:
  > *"Then we try to break the organization.*
  > *In Round 1, our initial Playbook V1 had a static rule: auto-approve refunds under $500. So our Red Team attacked it with a burst of 100 synthetic bot identities claiming $499 each during an outage.*
  > *The result? Playbook V1 crumbled at 33% adversarial robustness, approving 67 fraudulent payouts and leaking over $33,000."*
* **Show**:
  * Point to the red **33% ADVERSARIAL ROBUSTNESS** scorecard and the 67 breached attack cases.

---

## 1:00 – 1:15: FORGE Learns & Self-Hardens to V2
* **Stay on**: `Red Team` Cockpit.
* **Say**:
  > *"The system doesn't hide failures. It converts them into organizational memory.*
  > *FORGE analyzed the failure pattern, recognized the arrival velocity burst, synthesized a new compound exception `EXC-FRAUD-SYBIL`, and mutated the policy into V2.*
  > *When we rerun the exact same 100-bot attack against V2: robustness jumps to 94%, with 0% false positives on legitimate enterprise VIPs."*
* **Show**:
  * Point to the green **94% ADVERSARIAL ROBUSTNESS** scorecard.
  * Show the 6-step learning loop: `Failure → Evidence → Exception → Policy Mutation → Regression → V2`.

---

## 1:15 – 1:35: Hero Feature — Fork Reality & Causal Chains
* **Click**: `SIMULATE` → `Fork Reality` (`/fork-reality`).
* **Action**:
  * Drag the **Auto-Refund Threshold** slider from **$500 → $1,500**.
  * Click **Run Simulation**.
* **Say**:
  > *"Now the executive asks: 'What happens if we increase auto-approvals from $500 to $1,500?'*
  > *Instead of gambling with production customers, we Fork Reality across 1,000 Monte Carlo iterations.*
  > *FORGE doesn't just display isolated numbers — look at this Causal Chain diagram: changing one threshold increases automatic approvals by 64%, saves 340 staff hours, and accelerates cycle time from 18.4 hours to 0.8 hours.*
  > *Downstream, it expands fraud exposure by 12.4%, which our V2 velocity filter neutralizes.*
  > *Look at the Pareto Frontier below: operators can inspect the exact trade-offs before publishing."*
* **Show**:
  * Point to the 6-node Causal Chain diagram.
  * Point to the interactive Pareto Frontier multi-objective cards.

---

## 1:35 – 1:50: Organizational Time Machine
* **Click**: `SIMULATE` → `Time Machine` (`/time-machine`).
* **Action**:
  * Click the **10:30 AM** milestone checkpoint button.
* **Say**:
  > *"To prevent hindsight bias, our Organizational Time Machine reconstructs past knowledge with strict zero future leakage.*
  > *At 10:30 AM, 1,600 subsequent events and outcomes are completely masked. On the right, the 'What We Did Not Know' panel flags emerging unknown unknowns — showing leadership where to proactively stress-test before incidents strike."*
* **Show**:
  * Highlight the green `Hindsight Barrier Active` badge and the `What We Did NOT Know` blindspot cards.

---

## 1:50 – 2:00: Live Incident Execution with Moss & Closing
* **Click**: `EXECUTE` → `Live Incident Sandbox` (`/live-sandbox`).
* **Action**:
  * Click **Execute Governed Playbook in Sandbox**.
* **Say**:
  > *"Finally, live execution. An enterprise ticket arrives during an incident.*
  > *Moss semantic retrieval queries policies and precedents in under 10 milliseconds (measured at 0.18ms!), matches the hardened V2 genome, issues the instant credit, and updates organizational memory.*
  > *FORGE X doesn't automate a static workflow. It learns the intelligence behind the workflow."*
* **Show**:
  * Highlight `Moss Retrieval: 0.18 ms` (sub-10ms passed) and `Execution Status: COMPLETED`.

---

## 2:01: Judges' Q&A Anchor Points
* **Retrieval Honesty**: In `FORGE LAB` (`/forge-lab`), show that local fallback (BM25 in-process) is truthfully separated from Moss Cloud, with zero fabricated benchmarks.
* **Empirical Integrity**: All benchmark accuracy scores are labeled as tested against the seeded synthetic enterprise environment.
* **Deterministic Reproducibility**: Simulation runs use pinned seeds (seed 777/42) for 100% reproducible bitwise results.
