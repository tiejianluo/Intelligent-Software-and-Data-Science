# Parking Evidence — implemented A1–A6 capstone demo

[Open the teaching lab](https://tjluo-ucas.github.io/ase/en/capstone/) · [Read the six-stage guide](../README.md)

A functional, English-language browser demo of the parking scenario: entry → immutable quote → pending payment → simulated provider confirmation/reconciliation → receipt → physical exit. The same application lets students inspect the engineering work through six assignment stages.

The deployed application is a **static teaching simulation**, using synthetic tokens and local browser storage. GitHub Pages cannot host the proposed Rails/PostgreSQL backend. No real payment, user authentication, gate control or field value is claimed. ADR-003 below records this explicit adaptation of the original guide.

## Reproduce

Use Node 22 or later and the committed `package-lock.json`:

```bash
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
npm run build
npm start
```

Open `http://127.0.0.1:4178/ase/en/capstone/`. On a machine with Google Chrome already installed, use `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` instead of downloading Chromium. The release browser tests used Chrome on desktop and mobile Chromium emulation; they are not tests on an actual iPhone/Safari device.

The runtime has no external packages, network calls or hosted services. Playwright is the sole direct development dependency. Build copies eight allowlisted static assets into `dist/` and records their SHA-256 values in `dist/release.json`. Serve over HTTPS or localhost: module scripts and Web Locks are required. Opening `index.html` directly from the filesystem is unsupported.

[Actual validation](evidence/validation.md) records commands, results and failures. The [CI template](ci-workflow.yml) can be installed at the repository root as `.github/workflows/ise-parking-demo.yml`; workflow installation requires a suitably scoped publishing credential. The npm gate is implemented and run locally; no remote CI run is claimed merely because the template exists.

## A 10-minute demonstration

1. **A1 — Problem:** distinguish the image proposal, a value hypothesis and missing field evidence. Save a local learning note. Compare software with a clearer manual ledger.
2. **A2 — Domain:** predict the cost at 3,600 and 3,601 seconds, then run the exact-fee workbench. Try 1 fen/hour at coefficient 1.5. Explain quote, payment and stay state separately.
3. **A3 — Architecture:** trace a `QUOTE` command from the UI through the storage adapter and domain engine. Inspect the actual source and tests. Explain the trust boundary that a future server must supply.
4. **A4 — Slice:** use the seeded DEMO-101 stay, create a CNY 20.00 quote, start payment, simulate success, inspect the receipt, and record physical exit. Reset and repeat with “Accept, then time out”; advance two minutes to expose the pending alert; reload, then reconcile the same order. Switch to Driver Bob to demonstrate visibility rules.
5. **A5 — Counterexamples:** run the 12 isolated cases. Compare a deliberately seeded amount-validation fault with guarded behavior on the same legitimate/mismatched event corpus. These tests never mutate the live workflow.
6. **A6 — Operations:** run the frozen recovery experiment. Compare unresolved baseline with one-order reconciliation. Inspect 200 actual local quote-call timings while keeping simulated recovery seconds distinct. Export raw results, audit and notes; explain why field value remains unvalidated.

Every stage includes a Codex task prompt, allowed tool/data boundaries, acceptance expectations and an explain-back question. Students must still obtain consented independent problem/value evidence and explain their own engineering decisions.

## Implemented components and acceptance trace

| Stage / requirement | Implementation | Verification |
| --- | --- | --- |
| A1 source/assumption separation | `curriculum.js`, evidence ledger, local notes | Browser text rendering and persistence; no invented observations |
| A2 exact fees, pinned tariff, state rules | `domain.js`: `calculateFee`, `QUOTE`, `TARIFF`, `EXIT` | Hand-derived fee fixtures, version/expiry/state tests |
| A3 explicit responsibilities | UI → store → domain; separate experiment adapter | Reproduction, source inspection, build manifest, ADR-003 |
| A4 complete value slice | Entry/quote/payment/receipt/exit forms and audit | Desktop/mobile browser workflow, reload, timeout and concurrent-tab tests |
| A5 counterexamples and fault sensitivity | `experiments.js`, simulator provider events | Frozen 12-case corpus, wrong amount/merchant/currency/order, seeded baseline/control |
| A6 observability/recovery/evolution | Pending-age alert, audit, reconciliation, isolated experiment, raw export | One order/settlement after recovery; 200 timed local calls; export assertions |

Implementation tests live in `tests/domain.test.mjs` and `tests/browser.spec.mjs`. Role checks are executed in the domain, not inferred from hidden buttons; nevertheless all principals are browser-controlled and therefore remain simulated roles.

## Business policy

- Single DEMO lot, 12 synthetic spaces, drivers Alice/Bob; manual observation.
- Integer seconds, integer fen; started-hour billing. Rational coefficient 1 or 3/2; round once, half-up. Zero duration costs zero.
- Tariff is pinned at entry; new immutable versions affect only later stays.
- Five-minute quote window, inclusive at the expiry instant; quote creation increments the stay version.
- Pending attempts block replacement quotes. Same scoped key/payload replays the original result; changed payload conflicts. Another authorized request for an unresolved stay reuses the pending order.
- Nonzero settlement checks provider role/verification flag, merchant, currency, order, amount and authenticated-time simulation. A successful payment cannot be downgraded by a later failure. Mismatches stay unresolved and flagged for review.
- A timely simulated payment can be delivered late. A truly late success requires operator review. First simulator outcome per order is retained, including across reloads.
- Zero-fee settlement is a separate attendant/operator action, version-checked, audited and idempotent; it creates no provider order.
- Physical exit is separate from settlement. Post-payment overstay remains a staff-handled limitation, as in the original guide.
- Simulated dates advance only through the lab controls. Real browser timings and actual export timestamps are explicitly labeled separately.

## ADR-003 — adapt the teaching deployment to GitHub Pages

**Status:** accepted for this demo. **Context:** the requested destination is the existing static course site; a Rails process and PostgreSQL instance cannot run on Pages.

**Option A:** deploy an independent Rails/PostgreSQL service and use the course site as a frontend/link. This would support trusted identities, real persistence and provider integrations, but needs separate infrastructure, configuration, secrets and operating responsibility.

**Option B, selected:** deploy a dependency-free JavaScript teaching simulation at `/ase/en/capstone/`. Preserve domain contracts, error behavior, auditability, test independence and a clear migration path. Use Web Locks to serialize local tabs and localStorage to atomically replace the snapshot. No service worker or shared-origin credential is installed.

**Consequences:** students can use the demo immediately and reproduce the same engine offline over localhost. The browser cannot supply a trusted identity/payment authority or durability across devices. A local simulation benchmark does not establish server performance, and role tests do not establish production security. No privileged secrets are shipped in JavaScript.

**Evolution path:** preserve pure policies and fixtures; put application use cases behind authenticated Rails endpoints; replace the storage adapter with PostgreSQL constraints/transactions; replace the simulator with an officially validated sandbox provider; add integration/concurrency/security tests at those boundaries. Retain source IDs, independent oracles and all negative results. The original Rails chapters remain the target for this further production-style exercise.

**Rollback:** restore the previous static asset set and landing-page/navigation changes as a new commit. Browser snapshot schema is versioned (`ise.parking.evidence.v1`); preserve it during compatible code rollbacks. For a breaking schema, use a new key plus an explicit migration/export path. Do not clear student evidence automatically.

## Fault protocol and value boundaries

The A5 baseline is a **seeded fault** that replaces the callback amount with the expected amount before validation. It is deliberately vulnerable only inside an isolated experiment. Inputs are 2,000 fen (legitimate control) and 2,001 fen (must not settle). Production candidate always checks the original event. All results are computed at runtime; no success banner is hardcoded as a test outcome.

The A6 protocol uses the same synthetic payment/order: provider accepts at t=0, connectivity returns at t=30, reconciliation runs at t=45. The baseline remains pending at the observation cutoff. The intervention settles once at t=45: **15 simulated seconds** after fault clear. The accompanying 200 sequential `QUOTE` calls use `performance.now()` and export every actual duration. No CPU, memory, server, network, user-study or revenue result is fabricated.

A1 field evidence and A6 value evaluation remain unfinished human research activities. Input-based time comparisons are arithmetic worksheets, not verified research findings. Notes and role-play must not be submitted as interviews or observed operations.

## Security, privacy and operational limits

All data is local to the visiting browser profile and shared by this app’s tabs on the same origin. Only synthetic DEMO tokens should be entered. Exports contain all synthetic state, learner notes, simulator outcomes, raw lab results and environment information; inspect them before sharing. Reset is explicit and affects only this app’s key. No telemetry is sent by the application; the hosting provider still controls normal HTTP access logs.

The application escapes learner text and sets a restrictive meta CSP. The Pages origin hosts other course applications, so localStorage is **not isolated from same-origin scripts**. There are no secrets or real records to protect in the demo. A trusted deployment needs an isolated origin, server-side sessions and authorization, verified raw provider signatures, secure secret management, real storage transactions, rate limits and an operational retention policy.

## Publication

Source of truth: this `demo/` directory in `tiejianluo/Intelligent-Software-and-Data-Science`. Static build destination: `tjluo-ucas/ase/en/capstone/`. The course overview and English navigation link to it. Only allowlisted build assets are published to Pages; development dependencies, tests and evidence JSON are kept in the source repository. `release.json` supports post-deployment byte/hash verification. See [deployment runbook](DEPLOYMENT.md).
