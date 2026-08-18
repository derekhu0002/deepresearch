# deepresearch

An evidence-backed **deep research** project that produces structured industry insights and models agentic research systems into an intent-architecture knowledge graph.

All work in this repository is driven by a canonical **intent architecture graph** (`design/KG/SystemArchitecture.json`, ArchiMate-style, maintained through the ARGO toolchain). Every work package is anchored to an architecture element, carries an executable **GIVEN–WHEN–THEN** acceptance test, and is registered back into the graph with its delivery commit after completion.

## Purpose

1. **Produce evidence-backed industry insights.** Each insight deliverable must ground every conclusion in a cited source (URL + verbatim excerpt) and expose a verifiable, externally observable structure.
2. **Model how agentic research systems work.** The repository models [gpt-researcher](https://github.com/assafelovic/gpt-researcher) — both its single-agent pipeline (`gpt_researcher/`) and its multi-agent collaboration pipeline (`multi_agents/`, LangGraph) — into the intent architecture graph so that future work packages can reuse these methods as skills.
3. **Demonstrate a disciplined, intent-first working method.** Business intent, constraints, principles, work packages, and acceptance semantics live in the graph, not in ad-hoc code; changes are validated by re-running graph validation and acceptance tests.

## Method

The project combines two research methodologies, both encoded as architecture elements in the graph:

### 1. McKinsey 5-step structured strategic analysis

Defined by graph element **1314** (`麦肯锡结构化战略分析新5步法`, "McKinsey 5-step structured strategic analysis"). Used for single-agent insight work packages:

- **SMART problem definition** — the question itself is challenged and constrained to be Specific, Measurable, Achievable, Relevant, Time-bound.
- **≥3-layer MECE decision tree** — the problem is decomposed with a stated, mutually-exclusive-and-collectively-exhaustive rationale.
- **Falsifiable hypotheses** — each hypothesis declares both a hypothesis statement and a falsification condition.
- **Three-state verdicts** — each hypothesis resolves to exactly one of `supported` / `refuted` / `undetermined`.
- **Source discipline** — every conclusion carries a URL and the verbatim source excerpt; counter-examples are searched first (red-team style), not just supporting evidence.

### 2. Multi-agent collaboration research method

Defined by graph element **1449** (`多智能体协作系统研究方法`, "multi-agent collaboration research method"), derived from gpt-researcher's `multi_agents` (LangGraph). Used for multi-agent insight work packages, with a role-based team:

| Role | Responsibility |
| --- | --- |
| `ChiefEditorAgent` | Orchestrates the team and executes the end-to-end workflow (LangGraph StateGraph) |
| `EditorAgent` | Plans the chapter outline (≥3 chapters) and parallelizes chapter research |
| `ResearchAgent` | Performs initial/deep research and collects cited evidence |
| `WriterAgent` | Writes chapter content |
| `ReviewerAgent` / `ReviserAgent` | Review and revise drafts in a loop until accepted |
| `FactCheckerAgent` | Verifies facts and detects hallucination |
| `HumanAgent` | Human-in-the-loop review of the research plan |
| `VisualizerAgent` | Generates Mermaid diagrams |
| `PublisherAgent` | Publishes the final Markdown deliverable |

### 3. Acceptance-test-driven delivery

Every work package owns an **executable acceptance test** written in plain Node.js (no dependencies), formulated from the **acceptor's external viewpoint** in GIVEN–WHEN–THEN form. A change is considered done only when:

- the affected architecture elements and their acceptance tests have been identified (and updated first if needed),
- the graph passes `validateSystemArchitecture`,
- all affected acceptance tests pass.

## Repository layout

```text
deepresearch/
├── design/
│   └── KG/                      # Intent architecture knowledge graph (canonical source of truth)
│       ├── SystemArchitecture.json
│       ├── gpt-researcher_Agent_探索方法.json
│       ├── 麦肯锡结构化战略分析新5步法.json
│       └── test-failure-records.json
├── docs/
│   └── insights/                # Insight deliverables (Markdown, evidence-backed)
├── tests/
│   └── acceptance/              # Executable GIVEN-WHEN-THEN acceptance tests (Node.js)
├── .argo/                       # ARGO harness workspace (runtime artifacts under temp/)
├── .github/                     # Work-package-local skills & instruction rules (cleaned after use)
├── deepresearch.feap            # Enterprise Architect package export
└── package.json                 # neo4j-driver dependency for the ARGO harness
```

## Progress

| Work package | Graph element | Deliverable | Delivery commit | Status |
| --- | --- | --- | --- | --- |
| Insight into the state & trends of agentic engineering | `1327` | `docs/insights/agentic-engineering-现状和趋势.md` | `50ea6d2` | delivered |
| Insight into financial-investment automation tools | `1448` | `docs/insights/金融投资自动化工具-洞察.md` | `39125aa` | delivered |
| Full modeling of gpt-researcher Agent behavior | `2001` | `design/KG/SystemArchitecture.json` | `75b3fdb` | delivered |
| gpt-researcher Agent exploration method (root grouping) | `2010` | `scripts/extract-gpt-researcher-subgraph.js`, `design/KG/gpt-researcher-subgraph.json` | `e82ef00` | delivered |

**Delivered insights so far:**

- **Agentic engineering** (`1327`) — 10 hypotheses across a 3-layer MECE decision tree (capability stack × current-state/trend), yielding consensus on the workflow-vs-agent distinction, platform-ization of orchestration, MCP/A2A protocol standardization, evaluation/observability/guardrails as first-class concerns, and a refuted counter-hypothesis ("complex frameworks first").
- **Financial-investment automation** (`1448`) — a 5-chapter multi-agent report covering the "automation stage × implementation paradigm" matrix, from quant platforms (QuantConnect/LEAN), trading bots (Freqtrade/Hummingbot), and broker APIs (Alpaca) to financial LLMs (FinGPT) and multi-agent equity research (FinRobot), with the "deterministic computation + LLM narration" separation as the key risk-control trend.
- **gpt-researcher modeling** (`2001`) — the single-agent pipeline (orchestrator + research skills) and the multi-agent pipeline (orchestrator + 9 collaborating agents) modeled into the graph, including data objects and end-to-end workflows with triggering edges.

## Running the acceptance tests

The acceptance tests use only Node.js built-ins and locate the repository root automatically.

```bash
node tests/acceptance/test-agentic-engineering-insight.js
node tests/acceptance/test-financial-investment-automation-insight.js
node tests/acceptance/test-gpt-researcher-agent-model.js
```

Each test exits `0` on pass and `1` on failure.

## Working conventions

- **Intent first.** Locate (or create) the relevant architecture element and view in the graph before touching the repository. If logic is incomplete, resolve it from the graph or ask a human — do not guess in the code.
- **Acceptance tests first.** Identify affected acceptance tests, update them if necessary, then implement; re-run all affected tests afterward.
- **Skills & rules are scoped to work packages.** Needed skills are created under `.github/skills/` and rules under `.github/*.instructions.md` at the start of a work package, refreshed into the graph, then removed from the repository once done.
- **Commit & register.** After delivery, commit and record the `commit id + file paths` on the corresponding graph element (`deliveryCommit` / `deliveryStatus`).
- **Graph writes go through the ARGO MCP** — never edit `design/KG/SystemArchitecture.json` by hand; always re-run `validateSystemArchitecture` and the acceptance tests after a graph change.
