# Parking Evidence: an ISE capstone through six assignments

**An English instructor demonstration for Intelligent Software Engineering, Fall 2026.**

Build a service that helps a parking attendant reconstruct a parking stay, explain its fee, and distinguish a confirmed payment from an uncertain one. Use the same problem throughout **ISE-A1–ISE-A6**. Do not add six unrelated mini-projects or a seventh assignment.

This case is extracted from four handwritten parking-system pages supplied by the instructor. It preserves their entry/exit, tariff, payment, and Rails ideas while making missing decisions explicit. Read [the source extraction](SCENARIO.md) before accepting any requirement.

## What is provided, and what students still do

| Provided here | Must be established by the student team |
| --- | --- |
| Source-based scenario, worked hypotheses, domain design, architecture, six assignment guides, task contracts, evaluation protocols | Two independent types of field evidence; operator-approved policy; real user feedback |
| A runnable Ruby fee calculator with independent example tests and mutation checks | A Rails/PostgreSQL web application, authenticated interfaces, payment simulator, database concurrency tests, browser tests |
| A ready-to-install CI template for the supplied seed and local links | Application security scans, integration/E2E gates, workload measurements, deployment and rollback evidence |
| Blank evidence templates and honest execution record | Actual before/after results, field value, individual contributions and assessment submissions |

**This is a worked teaching guide with a tested seed, not a deployed parking product or a completed student submission.** No field interviews, payment-provider integration, user study, production benchmark, or financial savings are claimed. All DEMO examples and numerical thresholds are classroom proposals unless stated otherwise. The implementation backlog is intentionally visible.

## Start here

1. Read [SCENARIO.md](SCENARIO.md), then [the six-stage map](COURSE_MAP.md).
2. Use one repository and one evolving evidence ledger. Work through the chapters in order.
3. Before asking Codex, write your own decomposition, oracle, and anticipated failure. Use [the agent contract](AGENT_CONTRACT.md).
4. Reproduce the supplied seed from this directory:

```bash
ruby --version
ruby reference/test/fee_calculator_test.rb
ruby reference/test/mutation_check.rb
python3 tools/check_links.py
```

The seed has no external Ruby gems or Python packages. See [REPRODUCING.md](REPRODUCING.md) for the exact tested environment, limits, and commands for the proposed Rails application.

## Six tasks, one accumulating product

| Task | Read | Product increment | Evidence gate |
| --- | --- | --- | --- |
| A1 | [Problem and stakeholders](chapters/A1-problem.md) | A bounded fee-dispute and payment-status problem | Evidence distinguishes need from feature requests |
| A2 | [Domain and specification](chapters/A2-domain.md) | Tariff, stay, quote and payment contracts | Independent examples expose invalid states |
| A3 | [Repository and architecture](chapters/A3-repository.md) | Reproduced seed, architecture and ADR | Another person can follow a real call path |
| A4 | [Vertical slice](chapters/A4-slice.md) | Entry → quote → simulated payment → receipt | UI, authorization, persistence and recovery work together |
| A5 | [Counterexample study](chapters/A5-security.md) | A bounded robustness or security improvement | Frozen before/after procedure can disprove the claim |
| A6 | [Reliability and value](chapters/A6-operations.md) | Observable release, recovery and value decision | Raw operational evidence supports a limited conclusion |

Use [TRACEABILITY.md](TRACEABILITY.md) to connect problem → rule → code → test → operational measure. Use [templates](templates/README.md) for evidence, experiments, AI disclosure, debt, and final submission. Release, cross-team reproduction, final reflection, and transfer are integrated into A6 and the normal project presentation; they do not create extra graded assignments.

## Teaching method and authority

The case applies the course's PEGS framing and evidence-based engineering approach. Students construct a small solution and actively try to falsify its claims. Assistance fades from worked examples to independent experiments and an unfamiliar transfer task. The human team accepts requirements, reviews risks, and evaluates whether the result helps users. Source: [ISE course overview](https://tjluo-ucas.github.io/ase/en/) and [syllabus](https://tjluo-ucas.github.io/ase/en/syllabus/), consulted 12 October 2026.

The six local task specifications are preserved in [sources](sources/README.md). Their submission and assessment requirements remain authoritative; this capstone supplies a common case and an implementation path. Individual assignment evidence must identify each student's own contribution. Worked examples are not observations and cannot be submitted as personal fieldwork.
