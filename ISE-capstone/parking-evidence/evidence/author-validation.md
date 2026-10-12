# Author validation

Recorded in the 12 October 2026 course-authoring session. These are actual local checks of the supplied teaching seed and documents, not a student application or field study.

Environment: `macOS-26.6.2-arm64-arm-64bit`. The command output below records exact runtimes.

## `ruby --version`

Exit code: 0.

```text
ruby 3.3.4 (2024-07-09 revision be1089c8ec) [arm64-darwin21]
```

## `python3 --version`

Exit code: 0.

```text
Python 3.9.6
```

## `ruby reference/test/fee_calculator_test.rb`

Exit code: 0.

```text
PASS zero
PASS one_second
PASS hour_minus_one
PASS exact_hour
PASS hour_plus_one
PASS peak
PASS half_fen_rounds_up
PASS below_half_fen
PASS free_tariff_arithmetic
PASS cross_day_no_cap
PASS reject duration -1
PASS reject duration 1.5
PASS reject duration nil
PASS reject duration "60"
PASS reject rate -1
PASS reject rate 10.0
PASS reject rate nil
PASS reject coefficient 0
PASS reject coefficient -1
PASS reject coefficient 1.5
PASS reject coefficient nil
PASS same instant with different offsets
PASS source-style one hour
PASS reject reversed time
PASS reject unqualified or invalid timestamp 2026-09-28T09:00:00
PASS reject unqualified or invalid timestamp 2026-09-28T09:00:00.5Z
PASS reject unqualified or invalid timestamp not-a-time
PASS reject unqualified or invalid timestamp 2026-02-30T09:00:00Z
PASS reject unqualified or invalid timestamp 2026-09-28T24:00:00Z
PASS reject unqualified or invalid timestamp 2026-09-28T09:60:00Z
PASS reject unqualified or invalid timestamp 
31 checks; 0 failures
```

## `ruby reference/test/mutation_check.rb`

Exit code: 0.

```text
KILLED floor_started_hours: independent fixture one_second failed as intended
KILLED truncate_half_fen: independent fixture half_fen_rounds_up failed as intended
2/2 arithmetic mutants killed; no application-security claim
```

## `python3 tools/check_links.py`

Exit code: 0.

```text
Checked 58 local file links across 28 Markdown files; 0 missing targets
```

## Source integrity and limits

All six copied assignment specifications were compared byte-for-byte with the instructor-supplied local originals and matched. Image SHA-256 values are retained in the source manifest; the English extraction was visually checked against all four pages.

The mutation checks killed two deliberately seeded arithmetic faults by observing the expected independent fixture failures; syntax/import failures do not count. Raw command records are in [author-runs.json](author-runs.json).

Not executed: Rails application, database/concurrency tests, payment integration, browser E2E, dependency/security scans of an app, load/fault experiments, GitHub Actions, field-user study, live deployment and financial-value evaluation. The CI file is a ready-to-install template. All such work is specified for students in A3–A6.
