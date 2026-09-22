# Architectural Decision Records (ADRs): FORGE X

## ADR-001: Monorepo Architecture & Tech Stack Selection
* **Status**: Accepted
* **Context**: FORGE X requires high-performance deterministic simulation, process mining graph algorithms, sub-10ms context retrieval, structured AI agent pipelines, and an executive-grade interactive visual interface.
* **Decision**: 
  - **Backend**: Python 3.11+ with FastAPI, Pydantic v2 for strict schema enforcement, and asyncio. Python provides the richest ecosystem for process mining algorithms (heuristics miner, inductive miner), graph structures (NetworkX), and AI/LLM structured generation.
  - **Frontend**: Next.js 14+ / React 18+ with TypeScript, TailwindCSS for custom styling, Lucide icons, Framer Motion for sleek micro-interactions, and `@xyflow/react` (React Flow) / SVG-canvas for high-performance interactive causal & workflow graphs.
  - **Database & State**: SQLite (with WAL mode) / PostgreSQL relational schema with JSONB columns for flexible Decision Genome schemas and event audit logs.
  - **Retrieval Engine**: Moss retrieval fabric with sub-10ms latency interface, backed by an async deterministic local fallback driver with semantic cosine similarity and inverted index filtering.

## ADR-002: Deterministic Process Mining vs Pure LLM Extraction
* **Status**: Accepted
* **Context**: Extracting workflows purely by prompting an LLM on raw logs is non-deterministic, hallucinates transitions, suffers token context exhaustion on 5,000+ events, and is economically non-viable.
* **Decision**: Implement a two-tier hybrid architecture:
  1. **Deterministic Process Archaeology Engine**: Implements trace extraction, directly-follows frequency graph (DFG), bottleneck detection, cycle identification, and transition matrix calculation deterministically in Python.
  2. **Semantic Decision Analyst Layer**: Uses LLMs strictly for semantic abstraction, identifying tacit reasoning, unearthing hidden assumptions, and naming decision nodes.

## ADR-003: Moss Retrieval Fabric Abstraction
* **Status**: Accepted
* **Context**: Moss is the fundamental low-latency retrieval layer (sub-10ms in-process/edge retrieval). In environments without external cloud credentials or during automated offline testing, the system must remain 100% operational with identical interfaces and measured real-time telemetry.
* **Decision**:
  - Define `RetrievalService` protocol with methods: `index_documents()`, `query_similar_situations()`, `retrieve_policies()`, `retrieve_exceptions()`, and `measure_retrieval_latency()`.
  - Implement `MossRetrievalEngine` that wraps `MossClient` when configured.
  - Implement `LocalDeterministicRetrievalEngine` that runs in-process BM25 + dense TF-IDF / vector cosine scoring with exact metadata filtering.
  - Latency meters will benchmark real execution time down to microsecond/millisecond precision without fabricating numbers.

## ADR-004: Decision Genome Domain Specification
* **Status**: Accepted
* **Context**: Decisions cannot be treated as arbitrary JSON dumps or simple rules. They require formal lifecycle tracking, confidence scores, evidence provenance, and policy bindings.
* **Decision**: Define `DecisionGenome` as a first-class immutable Pydantic entity with versioning (e.g. `v1.0.0`), explicit condition vectors, hidden assumptions, Pareto-evaluated candidate actions, and bidirectional links to evidence IDs (`Event.id`).

## ADR-005: Event-Driven Counterfactual Simulation ("Fork Reality")
* **Status**: Accepted
* **Context**: Organizations cannot risk deploying unvalidated agentic playbooks directly to production.
* **Decision**:
  - Implement a lightweight, reproducible discrete-event simulation engine in Python (`packages/simulation/engine.py`).
  - Support parallel scenario execution across multiple reality branches: Baseline (Current Policy), Modified Policy, Conservative, Adversarial, and Worst-Case.
  - Compute multi-dimensional outcome metrics: Success Rate, Cycle Time, Cost, Human Workload, Escalation Rate, and Residual Risk.
  - Output Pareto frontier curves comparing trade-offs.

## ADR-006: Non-Conversational Multi-Agent Design
* **Status**: Accepted
* **Context**: Natural-language multi-agent chat introduces high latency, chaotic state transitions, high token consumption, and irreproducible loops.
* **Decision**: Agents communicate exclusively through strongly-typed state transitions and Pydantic envelopes. Each agent is a specialized function or pipeline step (e.g., `ProcessArchaeologist.mine() -> ProcessGraph`, `AdversarialAgent.synthesize_attacks() -> List[AttackScenario]`).
