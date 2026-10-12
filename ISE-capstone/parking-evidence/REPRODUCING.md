# Reproduction and implementation boundaries

## Supplied seed: no dependency installation

From `ISE-capstone/parking-evidence`:

```bash
git rev-parse HEAD
ruby --version
python3 --version
ruby reference/test/fee_calculator_test.rb
ruby reference/test/mutation_check.rb
python3 tools/check_links.py
```

The tested authoring environment and actual outputs are in [evidence/author-validation.md](evidence/author-validation.md). `.ruby-version` records that Ruby version. This small seed uses Ruby standard-library JSON/Time/Tempfile/Open3 and a tiny local assertion runner; it has no Gemfile or external test framework. The link checker uses only Python's standard library. No web server is started and no database is migrated by these commands. Fixed fixtures replace random sampling. Test fixtures' expected values were written independently of the calculator.

The [CI template](ci/seed-workflow.yml) runs these same checks. To enable it, install it at the repository root as `.github/workflows/ise-capstone.yml` using a credential authorized to manage workflows. It is deliberately stored as a template here and has **not run on GitHub**. The current publication credential does not advertise the workflow scope; this package does not change that account permission. Local checks were run as recorded below. A successful seed CI would not certify a Rails application, an external provider, or parking operations. CI runtime choices reproduce this seed; students verify support/security status before selecting production dependencies.

## Student application: build during A3–A4

These are a **planned execution contract**, not commands already run here. Create `app/` and commit the actual files/commands after inspecting the generated application. Choose currently supported Ruby/Rails/database versions from official documentation at setup time, then pin full runtime versions, dependencies and container digests. Do not put `latest` in an environment lock.

A proposed Rails generation command is `rails new app --database=postgresql`; verify it against the installed version and record generated configuration. Preserve the pure fee policy in a small domain module, configure a deterministic provider simulator, and use the framework's maintained authentication/CSRF facilities. Do not publish sample passwords or live credentials. Document how local test users are created.

The resulting app should expose the following verified commands or document their actual equivalents:

```bash
cd app
bundle install
bin/rails db:prepare
bin/rails test
bin/rails test:system
bin/rails server
```

A script such as `bin/ci` must run non-interactively and fail on any failed required check. Before calling the build reproducible, freeze `Gemfile.lock`, `.ruby-version`, database service/digest, browser/test-driver lock, locale/timezone, data version, environment-variable names, simulator config and seed. Run setup in a clean disposable database and retain logs; never point `db:prepare` at an unapproved deployment.

## Full application CI acceptance contract

| Gate | Required evidence | When it blocks |
| --- | --- | --- |
| Build/static | Locked install; syntax/type/lint/framework security checks | Any unexpected failure |
| Unit | Independent fee/time/state oracles | Wrong fee, invalid state or arithmetic mutant survives |
| Integration | Real PostgreSQL transactions, constraints, authorization, stale-version and idempotency checks | Any incorrect or unauthorized effect |
| Browser | Complete normal and timeout/retry flows using deterministic provider | User cannot finish/understand required workflow |
| Security | Frozen A5 negative suite, dependency and secret scan | Undocumented actionable finding or unsafe effect |
| Performance | Fixed-host/workload A6 baseline and comparable candidate | Agreed threshold or regression limit violated |
| Recovery | Pending reconciliation and compatible rollback rehearsal | Duplicate settlement, unowned failure or lost history |

Run lightweight deterministic gates on every change. Run reproducible workload/fault gates in a stable environment before release; a noisy shared runner's timing is not comparable to a laptop baseline. Store actual workflow/run URLs and artifacts in student evidence. Add protected-branch required checks through the repository's normal administration process; writing YAML alone does not configure branch protection.

## Evidence status

The files `templates/*` are blank capture formats. The six chapters contain expected behavior and planned experiments. Only the author-validation record reports commands executed for this package. No student application, field measurements or operational deployment is bundled or implied.
