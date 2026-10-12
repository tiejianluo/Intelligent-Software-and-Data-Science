# A1 — Find a problem worth solving

**Assignment:** Problem and Stakeholder Evidence Brief. **Handoff:** a scoped hypothesis and evidence ledger for A2. Read the [unchanged A1 specification](../sources/ISE-A1_Problem_and_Stakeholder_Evidence_Brief_English.md).

## 1. Student attempt: observe before proposing features

Read [the image extraction](../SCENARIO.md). Draw the current path: arrival → recorded entry → parking → fee query → payment → exit → reconciliation. Mark where a person hands information to another person or system. Write three things you know from the images and three things you do not know. A description of automation does not establish that automation is needed.

Use at least **two independent source types**. Four pages of one proposal count as one source type. A feasible field plan combines an authorized observation/time study with an interview plus inspection of an operator-approved tariff or redacted ledger. Do not collect plates, faces, bank details or unrelated driver histories. Obtain consent before recording participants. If site access is unavailable, use a clearly identified public operational document and an independent published study, explain the weaker local validity, and keep local user-value claims unverified.

Ask attendants to demonstrate the last ambiguous fee/payment case, drivers to explain a fee receipt, and operators to explain who resolves mismatches. Ask for counterevidence: when is the current workflow already adequate? Avoid asking only whether an “intelligent parking app” sounds useful.

## 2. Worked PEGS brief — proposed, not field-validated

| Frame | Case content |
| --- | --- |
| Project | Three students; one semester; synthetic/sandbox prototype; operator sponsor accepts tariffs; budget and access must be documented. |
| Environment | Physical arrivals and exits, camera/network faults, authorized tariff policy, third-party payment settlement, human dispute handling. Records can disagree with reality. |
| Goals | Reduce time to reach a correct, explainable fee/payment decision; preserve monetary correctness and privacy; avoid extra workload. |
| System | Record a stay, produce an auditable quote, show confirmed/pending/failed payment, allow staff reconciliation; never infer payment from a browser claim. |

**Worked problem statement:** “For an attendant resolving a disputed or uncertain stay at one lot, provide a timestamped fee breakdown and authoritative payment state, so that resolution can be faster without increasing incorrect charges or unauthorized disclosures. We will compare this with the existing workflow and a clearer manual ledger before deciding to continue.”

That statement names a candidate user task and a testable direction; it intentionally contains no invented baseline.

## 3. Stakeholders, constraints, and responsibility

| Role | Need / pain to investigate | Decision responsibility |
| --- | --- | --- |
| Driver | Understand the amount and whether retrying could pay twice | Accept/dispute quote; cannot edit tariff or settlement |
| Attendant | Resolve missing entry and pending payment without guessing | Confirm observations; route exceptions; no arbitrary settled-payment rewrite |
| Operator | Reconcile collected money, staffing and complaints | Approve business policy and limited pilot |
| Finance reviewer | Match amount, merchant, order and provider transaction | Investigate mismatch/refund outside first-release scope |
| Maintainer/data steward | Diagnose faults and minimize exposure | Access policy, retention, incidents and rollback |
| Camera/payment provider | Deliver fallible external observations | External contract; unavailable behavior must be modeled |

A driver with no smartphone needs an attendant-assisted path. An inaccessible screen or slow manual override could erase the value of a faster calculator.

## 4. Baseline, alternative, and stop rules

Collect timestamped, pseudonymous task attempts. Define start as “fee/payment question becomes available” and end as “correct resolution confirmed by the independent reviewer.” Record unsuccessful tasks separately; do not discard them from the denominator. Measure median/p95 elapsed time, incorrect-fee cases, unresolved payments, repeat work, and staff review minutes.

Proposed value target for planning: a 20% reduction in median correct-resolution time, no increase in incorrect decisions, and no privacy failures. This threshold is a hypothesis for operator approval, not a course standard or achieved result. Small samples cannot establish rare-event safety.

Compare three alternatives: (1) clearer tariff signage and a standard paper exception form; (2) searchable ledger plus deterministic fee rules; (3) ledger plus camera/AI features. Prefer (2) only if evidence shows that manual lookup/reconciliation dominates the problem and the expected benefit exceeds operation/support costs. Use (1) if confusion comes mainly from unclear posted policy. Defer (3) until recognition quality and incremental benefit are measured.

Stop or rescope if no independent evidence supports the pain, the operator will not approve a tariff contract, no safe source data can be obtained, or the non-software intervention plausibly solves the problem at lower cost.

## 5. Scenario set and evidence ledger

- **Normal S01:** DEMO vehicle enters at 09:00, asks for a quote at 10:01, sees two billed hours and a breakdown, completes a simulated payment and obtains a receipt.
- **Boundary S02:** a missing entry or exit before entry routes to an attendant; no guessed duration or charge is created.
- **Boundary S03:** payment times out after provider success; the driver sees pending status and can refresh without creating a second charge.
- **Abuse S04:** a driver changes the stay ID or submits `paid=true`; the server denies access or ignores the untrusted settlement claim.

Create `evidence/A1/ledger.csv` from [the template](../templates/evidence-ledger.csv). The initial entries should say IMAGE-01 = proposal supplied, FIELD-01 = observation pending, FIELD-02 = interview pending, POLICY-01 = operator policy pending. For each later observation preserve provenance, date, permission, what it supports, what it contradicts, and its limits. Store raw sensitive notes in an approved restricted location; commit only minimized summaries and provenance references.

## 6. Copyable Codex task

```text
Read AGENT_CONTRACT.md, SCENARIO.md and my evidence/A1 ledger and student-attempt note.
Task: draft an A1 problem brief, PEGS table, stakeholder/workflow map, scenario
catalog, and comparison with a non-software alternative using only supplied evidence.
Keep observations, image claims, assumptions and proposed targets separate.
Write only evidence/A1 and docs/problem; do not implement the product or contact users.
Do not invent interviews, measurements, source quotations or willingness to pay.
Acceptance: two independent source TYPES are identified; absent evidence is marked
pending; each value metric has a definition, collection method, owner and stop rule.
Return a short diff summary, unsupported claims, counterevidence and questions that
require operator knowledge. I will verify sources and decide whether to proceed.
```

## 7. Exit gate, explain-back, and submission

Deliver the evidence ledger, problem/value statement, stakeholder/workflow map, normal/boundary/abuse scenarios and AI/source-verification log. A peer should be able to trace each factual sentence to a source; mark any unsupported numerical statement as a proposed threshold or remove it.

Explain without Codex why plate recognition is deferred and why a faster UI could fail to improve exit queues. Transfer: if a printed tariff board solves most disputes, revise the system scope rather than defend the original feature list. Submit your own 150–300 word summary and stable revision; hand A2 the unresolved policy decisions.
