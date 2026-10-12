# A5 — Try to falsify a quality or security claim

**Assignment:** Quality and Security Counterexample Study. **Handoff:** one bounded improvement evaluated under the same protocol. Read [A5 requirements](../sources/ISE-A5_Quality_and_Security_Counterexample_Study_English.md).

## 1. Freeze the claim before proposing a fix

Worked claim: “Only an authentic provider event for the expected merchant, order, currency and amount can settle the corresponding authorized stay, and retries cannot settle it twice.” This is stronger than “the payment tests pass.” Use the A4 application, a fixed database snapshot, simulator version, exact dependency lock and a full commit hash.

Save [an experiment protocol](../templates/experiment.md) before modifying the application: claim, environment, input corpus hash, independent oracle, fault/attack model, threshold, stopping rule, command, baseline revision, owner and allowed scope. Version control proves when the protocol was frozen.

Acceptable teaching gate: every unauthorized or mismatched case is rejected without settlement; every legitimate case still settles exactly once; there are no cross-lot disclosures. These are finite-suite results, not proof against all attacks. Stop immediately if testing touches real accounts/data or if a test causes uncontained side effects. All experiments use local/sandbox fixtures.

## 2. Threat model

Assets: money amounts, settlement state, vehicle/stay privacy, merchant identity and audit integrity. Actors: ordinary driver, another lot's user, staff with limited role, unauthenticated sender, or a faulty provider/network. Trust boundaries: browser→server, controller→authorized use case, server→database, provider→callback, operator→tariff management, repository→CI.

Do not define the threat model as “the AI might be wrong.” Name the exact input, privilege and possible effect.

| Case | Test input | Required result |
| --- | --- | --- |
| SEC01 | Browser sets `paid=true`, amount=1, or merchant override | Settlement/amount/merchant cannot be set by client |
| SEC02 | Driver B substitutes A's stay or payment ID | Uniform denial with no object data or mutation |
| SEC03 | Staff from lot B requests lot A's record | Denied by server scoping, including idempotency replay |
| SEC04 | Valid event structure with invalid signature | No settlement; redacted verification failure recorded |
| SEC05 | Correct signature, wrong merchant/currency/order/amount | Review outcome; no settlement |
| SEC06 | Same event delivered 20 times concurrently | One accepted settlement; duplicates harmless and accounted for |
| SEC07 | Failure event arrives after success | SUCCEEDED remains; audit records ignored stale event |
| SEC08 | Old object version or changed payload with same key | Conflict; previously accepted state/result preserved |
| SEC09 | Stolen scoped view token after expiry | Denied; tokens absent from logs and URLs where possible |
| SEC10 | Payment in time, callback late; payment itself late | First reconciles; second goes to review per H05 |

Test signatures on raw bytes before parsing/normalizing; add request-size limits and constant-time signature comparison where supported. Do not log signing material or full callback bodies. If the deployment uses cookies, include a CSRF case for browser mutations; a provider callback uses its verified provider protocol instead of a browser session.

## 3. Before/after design and honest negative results

A useful candidate defect is a callback that checks amount but not merchant or currency. **Do not assert that the A4 implementation has this bug.** First run the frozen suite. If a real baseline failure appears, retain the failing fixture/output, make one narrow validation improvement, and run the identical corpus. Also run legitimate callbacks to detect overblocking. Record changed code, new result and side effects.

If the baseline already rejects every case, report that finding. You may use an isolated deliberate mutant that omits one check to test the test suite's sensitivity, but label it a seeded fault rather than a discovered vulnerability. Keep the mutant out of the deliverable application and never deploy it.

The supplied [mutation harness](../reference/test/mutation_check.rb) illustrates this method only for **fee arithmetic**: changing hour-ceiling to floor and final half-up rounding to floor must make independent tests fail. It is not a security test of the absent Rails app. Students need a separate authorization/payment experiment in A5.

Before/after table to fill from actual files:

| Case | Baseline revision / output | Intervention revision / output | Interpretation |
| --- | --- | --- | --- |
| Chosen failing case | pending | pending | Do not prefill “fixed” |
| Legitimate control | pending | pending | Detects overblocking |
| Duplicate/concurrent control | pending | pending | Detects regression |
| Unchanged known limitation | pending | pending | Bounds the claim |

## 4. Quality, security and CI gate

Extend the application CI with unit, database/concurrency, request and browser tests; static/framework security checks; dependency vulnerability scanning; secret scanning; and the frozen negative-case corpus. Lock tool versions, make nonzero exits fail CI, and give any suppression an owner, narrow rationale and expiry. A scan with no findings is not evidence of correct authorization.

For a behavior-preserving refactor, preserve the independent corpus, move one responsibility at a time, and compare readability/change surface with review evidence. Do not mix a tariff-policy change with a refactoring claim. Keep scan artifacts access-controlled if they disclose sensitive paths or configuration.

## 5. Copyable Codex task

```text
Read my frozen A5 protocol, A2 rules and the A4 baseline revision.
Run the exact baseline corpus before editing. Keep failures and legitimate controls.
Task: propose at most one bounded change addressing an observed counterexample.
If no baseline failure occurs, report that; do not fabricate one or weaken tests.
An isolated seeded mutant is allowed only if clearly labeled and never deployed.
Allowed tools: local test database, deterministic provider simulator, approved scans.
No external attack targets, real credentials, real payments or production access.
Acceptance: identical before/after corpus and oracle; raw outputs/exit codes; a small
reviewable diff; controls still pass; residual risk and rollback are explicit.
I independently verify the most important failing and passing case and explain why.
```

## 6. Residual risk and explain-back

A correctly signed event can still be wrong if the provider account is misconfigured; stolen staff credentials are outside a callback-signature test; a finite race test does not exhaust all schedules. Record these boundaries with owner and next experiment. Roll back by disabling initiation and preserving/reconciling existing attempts, not by accepting unverified events.

Explain why high coverage can coexist with a missing merchant check and why an oracle implemented with the same faulty condition can conceal a bug. Transfer: if a new provider uses different identifiers and ordering, identify which contracts and cases must change. Submit the model, frozen protocol, raw results, comparison, failures/rejected candidates and recovery/residual-risk record.
