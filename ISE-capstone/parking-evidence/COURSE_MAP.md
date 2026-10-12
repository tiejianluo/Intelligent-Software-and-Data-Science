# One capstone, six assignment gates

Read the [original local task specifications](sources/README.md) alongside each chapter. These six assignments are the complete assignment spine; the mapping below does not change assessment weights or add assignment deadlines. The course site supplies the broader teaching framework and project context: [overview](https://tjluo-ucas.github.io/ase/en/) and [assignments](https://tjluo-ucas.github.io/ase/en/assignments/).

## Competencies covered

| Requested capability | Main task | Concrete evidence in this case |
| --- | --- | --- |
| Identify a real problem worth solving | A1 | Sourced parking workflow, alternative intervention, stop decision |
| Analyze users, context, constraints, pain and value | A1; revisit A6 | Driver/attendant/operator map, measured baseline, value protocol |
| Model domain knowledge and business rules | A2 | Stay/quote/payment state models, data dictionary, invariant counterexamples |
| Architecture responsibilities and evolution | A3; revisit A6 | Component view, ADR, risk register, tariff migration |
| Readable, testable, refactorable code | A3–A5 | Pure fee kernel, small Rails services, behavior-preserving change |
| Interfaces, interactions and exception handling | A4 | Quote/receipt flow, structured API errors, timeout/retry states |
| Testing, security, performance and CI | A4–A6 | Layered tests, hostile callbacks, fault experiment, release gates |
| Agent context, task, permissions and acceptance | Every task | Bounded task contract, reviewed diff, independent verification log |
| Evaluate value with feedback and operations | A1 baseline; A4 usability; A6 | Consented task comparison, business measures, limitations |
| Reflect on requirements, architecture and debt | Every task; synthesize A6 | Assumption changes, ADR revisions, debt retirement, transfer defence |

## Learning progression

- **A1–A2: worked reproduction.** Inspect the source, distinguish claims from assumptions, work one fee example by hand, then challenge the supplied model.
- **A3–A4: guided variation.** Reproduce an unfamiliar seed and implement one bounded web slice. Rotate analyst, implementer and independent reviewer roles.
- **A5: independent inquiry.** Choose a claim and freeze a falsification experiment before proposing a fix. A supplied example is a method demonstration, not evidence of your run.
- **A6: independent evaluation and transfer.** Explain a release decision from collected evidence; individually adapt the reasoning to an equipment-rental or library-loan workflow.

In every task, save a student attempt → an agent candidate → an independent check → a brief explain-back → a changed-context application. For example, remembering `ceil` is weaker evidence than explaining why a stay of 3,601 seconds has a different fee from 3,600 seconds and predicting how a grace period changes both rules and tests.

## Accumulating handoffs

| Stage | Input from preceding stage | Required handoff |
| --- | --- | --- |
| A1 | Four pages and access to a workflow | Evidence IDs, problem/values, stakeholders, scenarios, AI log |
| A2 | A1 claim and assumption ledger | Glossary, flow/state models, dictionary, ≥3 invariants, checks, walkthrough |
| A3 | A2 contracts and a pinned repository | Clean run, architecture/call path, ≥3 risks, ADR with two alternatives |
| A4 | A3 baseline and architecture | Requirement-linked contract, reviewed diff, unit/integration/E2E results, user-task evidence, rollback |
| A5 | A4 release candidate | Frozen threat/fault protocol, raw baseline, one intervention, rerun, residual risks |
| A6 | A5 candidate and A1 value hypothesis | Workload/config, telemetry, failure/recovery comparison, runbook, value conclusion and reflection |

## Submission and review

For each task, submit a **150–300 word summary**, stable repository URL, and actual commit or tag through the matching platform task. Include the problem, your contribution, artifact, reproduction command, observed result, limitation, and AI disclosure. Use the unchanged local five-point rubric: 1.25 for problem/method, 1.50 for artifact/reproducibility, 1.25 for counterexample/limits, and 1.00 for communication/reflection/verification.

The copied source files preserve their release/deadline dates. Platform timestamps remain authoritative; this guide grants no extension. A team can share infrastructure, but each student's submission must identify their own analysis, code/review, experiments, and explain-back. No fabricated users, measurements, sources, or test runs are acceptable.
