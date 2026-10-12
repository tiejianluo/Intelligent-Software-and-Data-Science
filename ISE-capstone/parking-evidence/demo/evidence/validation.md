# Demo release validation

Recorded in the 12 October 2026 authoring session. This report concerns the implemented static teaching application, not the earlier Ruby seed or a real parking deployment.

## Actual release gates

| Command / check | Observed result | Raw evidence |
| --- | --- | --- |
| `npm run check` | JavaScript syntax checks and 38 domain tests passed | [domain-results.txt](domain-results.txt) |
| `DEMO_ROOT=dist PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` | 22 tests passed: 11 desktop + 11 mobile Chromium-emulation cases, against the exact built assets | [browser-built-results.json](browser-built-results.json) |
| `npm audit --json` | Zero reported vulnerabilities at scan time | [dependency-audit.json](dependency-audit.json) |
| `npm run build` | Eight static assets plus manifest generated; file hashes verified | [release-manifest.json](release-manifest.json) |
| Isolated counterexample/recovery experiments | 12/12 rule cases; seeded wrong-amount fault detected; one order/settlement after recovery; 200 raw local timings captured | [lab-runs.json](lab-runs.json) |
| Documentation link check | Local Markdown targets checked successfully | `python3 ../tools/check_links.py` |
| Visual inspection | Desktop overview/receipt and mobile overview reviewed; no horizontal overflow in all six stages at tested sizes | Local screenshots retained by the author; not a field usability study |

The browser report records the actual Node runtime and selected Chrome channel. Tests covered normal settlement and exit, timeout/alert/reload/reconciliation, mismatched amount, role scope, stale versions, concurrent tabs, raw evidence export, text-injection resistance, corrupt saved data, tariff evolution, and the value worksheet.

## Failures retained, then corrected

1. The sandbox initially blocked the local server (`listen EPERM`). Tests were rerun with authorized local browser/server access.
2. The installed Playwright package expected a bundled Chromium revision absent from the host. [The setup-failure report](browser-setup-failure.json) records the failed launches. The actual acceptance run used the already installed Chrome browser instead of claiming those tests had passed.
3. Expanded mobile testing exposed a draft-entry race: a late tariff-update render could replace typed vehicle/driver fields with defaults. [The failing regression report](browser-regression-before-fix.json) records 21 passes and one failure. Preserving the entry draft across re-renders fixed the issue. The unchanged expectations then passed in the full 22-case suite, including against the final built assets.
4. The npm audit initially could not resolve its registry inside the network sandbox. The authorized retry completed with the retained JSON result.

## Interpretation limits

The suite establishes behavior for this finite, synthetic browser model. It does not establish trusted server authentication, real provider signature security, PostgreSQL concurrency, device/gate integration, backend performance, field-user value or financial returns. Mobile testing is viewport/touch emulation in Chrome, not physical-device/Safari coverage.

A6 recovery duration is simulated; its local policy-call timings are actually measured and fully retained. Field observations remain uncollected. CI templates are provided, while the recorded release gates ran locally. The separate existing course GitHub Pages build is the publication mechanism; deployment must be verified independently of these tests.

## Verified public deployment

- Live demo: [Parking Evidence](https://tjluo-ucas.github.io/ase/en/capstone/).
- Source implementation commit: `352e913f18f69bad47d6e33cb9932ac319d174c4`.
- Course-site deployment commit: `0fc6d9f1dbfd88292b35637abf839d88f190c2b4`; its GitHub Pages build completed successfully.
- [Live HTTP/hash verification](deployment-live.json): the public release manifest matches the local build; all eight asset hashes match; course overview/navigation links are present.
- `DEMO_URL=https://tjluo-ucas.github.io/ase/en/capstone/ PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`: **22/22 passed on the public site**, in isolated desktop/mobile browser contexts with synthetic local state. [Raw live browser report](browser-live-results.json).

These live checks do not mutate shared user data or operate real payment systems. The evidence-record commit may follow the implementation commit; it changes documentation/results, not deployed code.
