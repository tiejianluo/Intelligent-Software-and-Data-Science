# A4 — Deliver one complete, reviewable value loop

**Assignment:** End-to-End Vertical Slice and Automated Verification. **Handoff:** a demonstrable application plus evidence, not only generated files. Read [A4 requirements](../sources/ISE-A4_End-to-End_Vertical_Slice_and_Automated_Verification_English.md).

## 1. Slice and acceptance contract

**REQ-01:** An authorized attendant can open a stay, obtain an explained server-calculated quote, initiate a simulated payment, see its independently confirmed receipt, and record a separate exit. A driver sees only their own scoped stay. Failures preserve enough state to recover without duplicate charges.

Build this in the student's `app/` using the A3 stack lock. The supplied fee kernel is a reusable starting component, not an existing web app. First deliver the normal path with explicit pending state, then duplicate/stale/unauthorized/error paths. Each change should be small enough for a peer to explain from requirement to test.

## 2. Interface contract

All endpoints below are **proposed implementation requirements**. Authentication comes from a server-validated session/principal; never accept a client-provided role/lot as authority. Browser sessions use the framework's CSRF protection and secure cookie settings. Authorize before looking up/replaying idempotency results.

| Endpoint | Actor and trusted inputs | Successful result / errors |
| --- | --- | --- |
| `POST /stays` | Attendant; vehicle token; idempotency key | 201 open stay; duplicate active stay 409; invalid observation 422 |
| `POST /stays/:id/quotes` | Authorized owner/attendant; expected version; server clock supplies cutoff | 201 immutable quote and breakdown; stale 409; missing entry 422 |
| `POST /quotes/:id/payments` | Authorized owner/attendant; idempotency key | 202 pending order; expired 409; active attempt reused or conflict; client amount ignored |
| `GET /payments/:id` | Authorized owner/attendant | 200 pending/failed/succeeded, safe next action and reference |
| `POST /provider/events` | Verified provider adapter identity, not browser auth | 200 for accepted exact duplicate; bad signature 401; mismatch recorded for review without settlement |
| `GET /stays/:id/receipt` | Authorized owner/attendant | 200 confirmed receipt; pending 409; foreign/missing object uniform 404 |
| `POST /stays/:id/exit` | Attendant; expected version; server observation time | 200 closed stay; unsettled or stale 409; clock invalid 422 |

Use a stable response envelope, for example:

```json
{"error":{"code":"PAYMENT_PENDING","message":"Payment confirmation is pending.","retryable":true,"correlation_id":"DEMO-REQ-04"}}
```

Do not expose stack traces, secrets, another driver's plate, or raw provider payloads. For the same authorized idempotency key and request body, replay the original resource/result, even after the resource changes state; for a changed body, return `IDEMPOTENCY_CONFLICT`. The key is scoped by principal, lot and operation. Retry permission does not mean creating a new payment order.

## 3. Worked interaction and error recovery

1. Attendant records DEMO-ABC123 at 09:00, normal tariff v1. Screen shows a stay reference and recorded time; it does not claim camera verification.
2. At 10:01 the driver opens a scoped quote page: elapsed 61 minutes, billed 2 hours, rate CNY 10/hour, coefficient 1, total CNY 20.00, tariff v1, cutoff and five-minute expiry. These are synthetic values.
3. Pay disables duplicate clicks as a usability aid; the server still enforces idempotency. The page says “Waiting for confirmation” after order creation.
4. A simulated provider event with matching merchant/order/CNY/2,000 fen settles once. The receipt includes quote, tariff and provider reference, with no sensitive credentials.
5. Attendant separately records exit. During timeout, the page offers “Check payment status” and a staffed-help path, not an assertion of failure or a fresh charge.

Use visible text labels, keyboard focus order, readable currency/timestamps, sufficient contrast and an error summary that screen readers can reach. A status change must not depend on color alone. Test cancellation, refresh, slow network and a driver without a smartphone. A browser redirect to a “success” URL must still fetch authoritative server state.

## 4. Transaction and adapter design

This is a transaction sketch, not drop-in Rails code:

```text
create_payment(principal, quote_id, key):
  authorize object and operation
  transaction:
    lock stay and quote in a consistent order
    replay matching idempotency record, or reject changed payload
    require OPEN stay, current quote, valid expiry, no unresolved active attempt
    create PENDING attempt with stable provider_order_id and expected merchant/amount
    save idempotency result and audit atomically
  call provider OUTSIDE transaction using the same provider_order_id/idempotency key
  if timeout: keep PENDING; schedule bounded reconciliation
  return the saved attempt

accept_provider_event(verified_event):
  reject invalid signature before any state mutation
  transaction:
    deduplicate provider event ID; lock payment and stay
    check merchant, order, currency, amount, authenticated payment time and quote
    on mismatch: persist review outcome; never settle
    on exact success: set SUCCEEDED once, SETTLED once, append audit
    persist processed event atomically
  acknowledge only after durable commit
```

Implement the simulator with deterministic accepted, rejected, delayed, duplicate and wrong-amount events. It must expose authoritative order status for reconciliation. Use a test signing key and raw-body signature verification for the simulator; this protocol is not a claim of WeChat/Alipay compatibility. Real-provider adapters require their official contract and separate sandbox testing.

Do not implement financial idempotency as an in-memory hash. Use unique constraints and transaction retries with bounded limits. A crash after provider acceptance but before local response must resolve by querying the same order, not creating another one. For a stored zero-fee quote, an attendant-only `POST /quotes/:id/zero-settlement` service revalidates amount = 0, expiry and stay version under a lock, saves a zero-fee receipt and audit atomically, and changes OPEN to SETTLED without a provider order. Drivers cannot invoke it; nonzero quotes are rejected. Test duplicate/stale calls and attempts to pass a forged zero amount.

## 5. Tests and review evidence

| Layer | Required check | Independent oracle |
| --- | --- | --- |
| Unit | Hour boundary, rational rounding, pinned tariff | Manually calculated A2 fixture table |
| Integration | Concurrent duplicate entry; stale update; repeated key with altered body | Database row count, amount, version and audit state |
| Integration | Valid, invalid, late and repeated provider events | Frozen simulator events and expected state table |
| Authorization | Driver A cannot read/pay/close Driver B's stay; viewer cannot edit tariff | Explicit role/object matrix, not the UI's buttons |
| Browser E2E | Entry → quote → pending → confirmed receipt → staff exit | Browser state plus independently inspected database records |
| Recovery | Restart web process after pending attempt; reconciliation preserves one order | Persisted order key, provider status and one settlement |

Two ordinary sequential requests do not test concurrency: use separate database connections and a barrier so both contend. A JSON request test is not a browser E2E test. Include actual raw output and failures. The guide's CI covers only the seed; add the application gates in [REPRODUCING.md](../REPRODUCING.md).

Recruit representative users with consent for quote explanation, pending-payment recovery and missing-entry handling. Record task success, wrong interpretations, time including help, and friction. Peers can pilot the script, but peer role-play is not field-user evidence. If access is unavailable, mark representative-user testing pending.

## 6. Copyable Codex task

```text
Read the accepted A2 rules, ADR-001, role matrix, API contract and my own slice plan.
Task: implement REQ-01 in the locked Rails app with the deterministic payment simulator.
Allowed edits: app/, associated tests, migrations, docs/rollback and CI for this slice.
No real payments, physical devices, user contact, production data or deployment.
Use server authorization, exact money, immutable quote snapshots, durable scoped
idempotency and optimistic versions. Preserve PENDING on uncertain provider outcomes.
Add independent unit, PostgreSQL integration/concurrency and browser E2E tests.
Acceptance: all rows of the A4 test table have actual evidence; one reviewed diff links
REQ-01 to rules/tests; failure messages and a non-smartphone path are documented.
Report unresolved cases and actual commands, exit codes and artifacts. Do not certify
user value or claim a test ran because a test file exists.
```

## 7. Rollback and explain-back

Start with additive migrations; test old application compatibility before deploying. Disable new payment initiation first, drain/reconcile pending orders, then roll back compatible code. Do not remove settlement/audit rows. Restore a backup only under a documented recovery decision and reconcile with the provider afterward. Save a real local rollback/restart rehearsal record.

Explain why disabled buttons do not prevent duplicate charges, why a plate is not authorization, and why a delayed success must not trigger another payment. Submit the task contract, reviewed commit/diff, real tests, usability/error evidence and rollback guide.
