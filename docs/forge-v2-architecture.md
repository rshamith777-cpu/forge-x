# FORGE X V1 to V2 Architecture Map

## 1. Current Architecture (V1 Baseline)
**Backend (FastAPI - `apps/api`)**
- Core Gateway: `apps/api/main.py` handles REST & WebSocket.
- State: In-memory datastore (events, decisions, policies, cases).
- Retrieval: `packages/retrieval/moss_adapter.py` (MossRetrievalEngine).
- Event Bus: `packages/events/bus.py` (AsyncEventBus) for non-blocking triggers.
- Memory: `packages/memory/organizational_memory.py`.
- Decision: `packages/decision_engine/engine.py` constructs genomes.
- Evaluation: `packages/evaluation/async_evaluator.py`.

**Frontend (React 19 + Vite - `apps/web`)**
- Layout: Glassmorphism tokens, `index.css`, Inter typography.
- Core Views: `CommandCenterView`, `RedTeamView`, `LiveSandboxView`, `ForkRealityView`, `GenomesView`, `TimeMachineView`.

## 2. V2 Extensions
**Backend Enhancements:**
- `DecisionGenome`: Add reliability score, drift, contradictions, failure modes.
- `Reliability Engine`: Deterministic calculation weighting (evidence, policy, precedent, contradiction).
- `Contradiction Engine`: Detect conflicting policies.
- `Decision Drift`: Monitor historical trends.
- APIs: Extend `/api/decisions`, `/api/redteam`, `/api/fork-reality`.

**Frontend Enhancements:**
- Typography: Introduce `DM Serif Text` for display.
- Demo Director: Deterministic autopilot (120 seconds).
- Flight Recorder: Timeline visualization of decision pipeline.
- Failure Lab: Enhance `RedTeamView` with taxonomy.
- Governance UI: Approval states for Candidate Playbook V2.

## 3. Dependency Graph
`DemoDirector` -> `LiveSandboxView` -> `Moss Monitor` -> `RedTeamView` -> `ForkRealityView` -> `GenomesView` (Governance)

*Baseline Lock Complete.* No existing routes, colors, or backend architectures are removed. Extensions are strictly additive.
