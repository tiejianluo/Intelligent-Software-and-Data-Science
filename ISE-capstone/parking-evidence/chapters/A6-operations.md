# A6 — Observe failures, recover, and decide whether the product has value

**Assignment:** Reliability and Observability Evidence Lab. **Handoff:** a reproducible release decision, value assessment, and evolution plan. Read [A6 requirements](../sources/ISE-A6_Reliability_and_Observability_Evidence_Lab_English.md). This chapter also closes the capstone; its release and reflection activities are part of the existing project, not new graded assignments.

## 1. Preregister a workload and reliability claim

Worked scenario: the provider accepts a payment but its response and callback are delayed. A driver retries status checks; a reconciliation worker must recover without initiating a second order. Use only the A4 simulator and synthetic stays.

Freeze a workload/config file with runtime/OS/CPU/RAM/database versions, application commit, simulator version, seed 20260928, tariff/fixture hashes, warm-up and measurement windows, client count, request mix, request timeouts and resource sampling interval. Reset to the same database state before every comparison. Proposed lab design: 60-second warm-up, five-minute measurement, 10 concurrent clients, a fixed 70% quote/read, 20% entry/exit and 10% payment workflow mix; run three baseline and three intervention repetitions. Payment workflows must include eventual outcomes in their counts. The mix is illustrative and must be justified against A1 observations.

The source's assumed 1,000 cars/day does not determine peak arrival rate, request count, burst concurrency or payment callbacks. If using a closed-loop client workload, report that it underrepresents arrivals while clients wait; do not claim real-lot capacity from it.

Proposed gates: local quote p95 ≤250 ms; unexpected request error rate <1%; no wrong fee, unauthorized disclosure or duplicate settlement in the corpus; accepted payments reconcile within 60 seconds after provider connectivity is restored. Stop on monetary/privacy failure, uncontrolled queue growth, or resource exhaustion. Define how timed-out requests and unfinished payments count before running; never improve reported latency by discarding failures.

## 2. Instrument the critical path

Emit structured events with UTC timestamp, request/correlation ID, pseudonymous stay/payment reference, operation, result code, duration_ms, tariff version, code revision and provider outcome class. Exclude plate text, session tokens, signatures, secrets and full provider bodies. Do not place per-stay IDs in metric labels; keep high-cardinality references in restricted logs.

| Signal | Definition | Owner / action |
| --- | --- | --- |
| Quote latency | p50/p95/p99 of completed local quote requests; report timeout count separately | Maintainer checks database/CPU before changing fee logic |
| Unexpected error rate | 5xx + network timeouts / all attempted requests; report expected 4xx separately | Maintainer investigates correlated failures |
| Oldest pending payment | Server now minus oldest unresolved attempt creation | Finance/operations reviews beyond 60 s; warns of uncertain payment |
| Settlement mismatch | Events with wrong amount/currency/merchant/order | Operator investigates immediately; no automatic settlement |
| Recovery time | First durable correct terminal state minus fault-clear time | Maintainer validates reconciliation behavior |
| Resource usage | CPU, resident memory, DB connections and worker backlog at fixed intervals | Maintainer distinguishes saturation from external delay |

An alert needs a denominator/window and a named role, not just a red dashboard. Example: page the on-duty operator if any accepted order remains unresolved 60 seconds after connectivity recovery. Suppress duplicate pages for the same incident; never suppress the evidence. Field thresholds require site-specific agreement.

## 3. Baseline → fault → one improvement → rerun

1. Capture no-fault latency/error/resource baseline and all request outcomes.
2. Configure the simulator to accept selected orders but delay response/callback for 30 seconds. Record injection start/end and affected order IDs. Preserve provider-side accepted state.
3. Observe detection time, pending backlog, number of distinct provider orders per stay, recovery after fault clear, and staff actions. A process restart after provider acceptance is an optional separate experiment, not a hidden workload change.
4. Choose one evidence-supported improvement, such as a bounded reconciliation job querying the existing provider order. Keep the same order key, bounded exponential backoff and maximum attempts; exhausted retries go to an owned review queue. Do not add a second charge.
5. Repeat the same fault schedule and workload on the intervention revision; retain all repetitions, including worse results. Compare absolute values and distributions, not just a favorable percentage.

If the baseline already recovers correctly, investigate alert latency or operator interpretation rather than invent a defect. If prerequisites are not implemented, report **not executed** and the exact blocker. Populate [the run manifest](../templates/run-manifest.json) and preserve raw CSV/JSONL, logs, configuration and command/exit records.

## 4. Runbook, deployment, and rollback

**Detect:** correlate pending/mismatch alert with simulator/provider status and local state. **Own:** attendant handles the waiting driver, operator/finance owns money reconciliation, maintainer owns service recovery. **Contain:** disable new initiation if correctness is uncertain; keep status/receipt access where safe. **Recover:** query authoritative status by existing order ID; apply an audited verified transition or escalate. A person does not turn “pending” into “paid” merely to silence an alert. **Verify:** compare amount/currency/merchant/order, count one settlement, test receipt and pending queue. **Learn:** retain timeline and revise rule/test/runbook.

Before a limited pilot, produce a release record with revision, environment/config fingerprints, migration plan, passed gate links, known limitations, owner and rollback trigger. Rehearse a backup restore and compatible code rollback using synthetic data; record recovery time and reconciliation outcome. Prefer additive schema changes. Rollback must preserve pending attempts, receipt history and newer tariff versions. A restored DB can lag provider truth: reconcile before normal operation resumes.

This repository package does not authorize or perform a real deployment, charge, camera connection or gate action. A real pilot needs the operator's agreed scope and existing release authority. A local sandbox release rehearsal is sufficient to demonstrate the method when field access is absent; it cannot establish field value.

## 5. Evaluate value, not only server performance

Return to A1's hypothesis. With consent and suitable access, compare the current workflow, a clarified manual ledger, and the deterministic application on matched tasks: explain fee, resolve missing entry, interpret delayed payment. Counterbalance task order; keep equivalent task difficulty and record prior experience. Have an independent reviewer judge correctness against the frozen tariff and provider ledger, blind to method where feasible.

Collect all attempted tasks: successful correct resolution, elapsed time including human review, incorrect charges/interpretations, unresolved cases, help requests, staff minutes, participant willingness to use again, and adverse outcomes. Report sample size and per-condition distributions; small samples support limited usability findings, not rare-event safety claims or a causal claim about annual revenue. Investigate why users abandon or mistrust the service.

Decision rule proposed in A1: continue only if correct-resolution time improves by the agreed target, errors/privacy do not worsen, staff burden and costs are acceptable, and the operator sees a useful workflow. If no field study occurs, conclude “technical feasibility demonstrated under synthetic conditions; operational value unvalidated.” Do not substitute a load test for a user-value study.

Fill the economics template with observed volumes and review minutes; show sensitivity to traffic, adoption, fee collection, support cost and provider cost. Keep the image's 1,000/day and 365 days labeled as source assumptions. A fee increase that raises revenue while worsening disputes can fail the user-value goal.

## 6. Requirement change, debt and transfer

Worked change request: “Add a 15-minute grace period and a daily cap.” First ask whether grace means free short stays or subtracting 15 minutes for every stay, and whether “daily” means each local calendar day or each 24 hours. Do not let Codex choose silently.

Trace the accepted choice through tariff v2 schema/policy, pure calculator, quote breakdown, property/boundary fixtures, DST/timezone cases where relevant, migration, old-stay compatibility, performance experiment and operator explanation. Keep v1 reproducible for old stays/receipts. Compare an explicit policy strategy with piling conditionals into controllers in ADR-002, and state a rollback path.

Example debt register entries: manual event capture (retire only after recognition errors measured); sandbox-only payments (retire after provider contract and reconciliation tests); one lot (extend only after role/data isolation tests); post-payment overstay handled by staff (revisit from observed disputes). Each needs owner, impact, evidence-based trigger, cost and acceptance test. A limitation is not automatically urgent debt.

Individual transfer defence: apply the same evidence/rule/idempotency reasoning to an equipment rental return with a damage deposit. In ten minutes, identify three changed rules and an invariant that cannot be copied unchanged. Explain your most consequential rejected AI suggestion and one result that weakened your original claim.

## 7. Copyable Codex task and final evidence bundle

```text
Read A1 value measures, A5 residual risks, my frozen A6 workload/fault protocol and
release constraints. Instrument only the specified critical path without sensitive
payloads. Run baseline, fault and one justified intervention with identical fixtures.
Save actual command/exit records, raw latency/error/resource/recovery results and all
repetitions. Do not invent deployments, users, faster timings or financial savings.
Create a runbook, rollback rehearsal record, value-analysis worksheet, ADR change
impact and debt register. Mark any unexecuted item explicitly and preserve limitations.
Acceptance: another team can repeat the experiment, trace an alert to its human owner,
verify exactly one settlement, and distinguish technical evidence from field value.
No production access, real payments or external messages are authorized by this task.
```

Submit A6's workload/config, structured telemetry, raw baseline/rerun, alert/runbook and recovery evidence. The final project index links A1–A6, rules, ADRs, source/tests, CI run, release/rollback, actual user evidence or its absence, economics, AI log, contribution history and reflection. End with an explicit continue/revise/stop decision supported by results. Use [the submission checklist](../templates/final-review.md) to verify completeness, not to claim unperformed work.
