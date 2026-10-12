# Requirement → rule → implementation → evidence → value

Paths under the future student's `app/` are proposed responsibilities, not files provided in this package. Every implemented row needs actual source/test links and a full revision before a student calls it complete.

| Requirement / source | Acceptance criterion / rules | Implementation responsibility | Verification / operation | Package status |
| --- | --- | --- | --- | --- |
| REQ-01: explain a parking charge; image pages 1–4 | Exact duration/ceil hours, pinned tariff, rational half-up fen; BR02/03 | [FeeCalculator](reference/lib/fee_calculator.rb); future QuoteStay service | [Independent fixtures/tests](reference/test/fee_calculator_test.rb); fee disputes per attempted task | Pure arithmetic seed supplied; quote persistence not implemented |
| REQ-02: consistent entry/exit records; pages 1–3 | One active stay, valid times, separate physical exit; BR01/02/08 | Proposed RecordEntry/RecordExit + DB constraints | Concurrent-entry, clock, stale-version tests; unmatched observations | Specified; app/tests pending |
| REQ-03: correct payment/recipient; pages 1–2 | Exact verified event; pending/reconciliation; BR04/05/07 | Proposed PaymentService, adapter, worker | Duplicate/wrong merchant/late-event tests; oldest pending age | Specified; simulator/application pending |
| REQ-04: scoped access; added engineering control | Every operation authorized before lookup/replay; BR06 | Proposed authorization policy and scoped queries | Cross-user/lot tests; denied requests and privacy incidents | Specified; implementation pending |
| REQ-05: understandable recovery; source efficiency goal | Driver can explain quote and pending status, obtain staff help | Proposed accessible quote/status/receipt UI | Browser E2E + consented representative-user tasks | Specified; UI/user study pending |
| REQ-06: operate and evolve; page 4 reflection | Reproduce, observe, recover, preserve historical tariffs | Proposed CI, runbook, migration and ADRs | A6 frozen fault experiment, rollback, debt/change record | Seed CI template supplied; full-app gates and field operation pending |
| REQ-07: problem has net value; page 1 goals | Better correct-resolution outcomes than agreed baseline | Human study design and value worksheet | Matched tasks, costs, negative feedback, continue/revise/stop | Hypothesis only; no field claim |

## Change-impact example

A new peak policy changes BR03, TariffVersion, quote display, independent money examples and revenue assumptions. It does not justify relaxing BR04. A new identity model changes BR06, object lookup, idempotency scope, token management and privacy tests. Make those affected links visible before asking Codex to edit code.

For each stage maintain: source ID, assumption status, requirement ID, criterion, code revision, test ID, raw-output path, operational measure, accountable reviewer and unresolved limitation. A broken link or a merely proposed test means the chain is incomplete.
