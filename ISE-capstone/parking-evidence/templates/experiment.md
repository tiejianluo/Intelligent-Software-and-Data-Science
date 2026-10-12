# Frozen experiment protocol

Complete and commit before changing the system. Label every later amendment.

- Claim and requirement IDs:
- Baseline full revision / environment lock / fixture hash:
- Threat or fault model; explicitly excluded cases:
- Independent oracle and who derived it:
- Controls (including legitimate behavior):
- Workload, concurrency, seed, warm-up, duration, repetitions:
- Inputs / database reset / fault injection schedule:
- Metrics, denominators, clocks, timeout/unfinished-case treatment:
- Acceptance threshold and reason:
- Stopping rule and containment:
- Allowed tools, targets and data:
- Exact baseline command and expected artifact locations:
- Proposed bounded intervention (after baseline evidence):
- Exact rerun command using unchanged corpus:
- Real raw results, exit codes and negative runs:
- Side effects, alternative explanations and residual risks:
- Reviewer, release decision and rollback:

## Before/after result table (fill only after execution)

| Measure | Baseline + artifact | Intervention + artifact | Interpretation / uncertainty |
| --- | --- | --- | --- |
| Correctness | Not measured | Not measured | Pending |
| Legitimate controls | Not measured | Not measured | Pending |
| Error/recovery | Not measured | Not measured | Pending |
| Performance/resources | Not measured | Not measured | Pending |
