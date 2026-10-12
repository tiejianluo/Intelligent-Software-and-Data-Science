# Deployment and rollback runbook

## Before publishing

1. Freeze source revision, lockfile and independent fixtures. Run `npm ci`, `npm run check`, browser tests and `npm run build`. Retain failure output and the successful rerun. Inspect desktop/mobile UI and the timeout path.
2. Confirm that only synthetic data is in fixtures and evidence; the build has no credentials, external calls or production configuration.
3. Read the current `tjluo-ucas/ase` branch/tree and repository instructions. Do not overwrite unrelated course pages or local work.
4. Copy the nine `dist/` files (eight assets plus manifest) to `en/capstone/`. Add a bounded landing-page section and English navigation link. Review exact paths and their content before publication.
5. Commit against the current parent and update the release branch **without force**. If the branch advances, rebuild the tree on the new parent and recheck affected content; never overwrite concurrent updates.

## Verify

The existing GitHub Pages legacy build publishes `master` from `/`. Check its build result and deployed commit. Fetch `/ase/en/capstone/release.json`, verify every deployed asset hash, and run browser acceptance against `DEMO_URL=https://tjluo-ucas.github.io/ase/en/capstone/`. Browser tests use isolated contexts and synthetic local data; they do not alter other visitors’ sessions.

Check that the course overview links to the demo and that core pages still return successfully. A successful repository commit does not itself prove the site deployed. Save the actual source/site commit IDs, build status, live URL and verification result in a release record.

## Roll back

Restore `en/index.md`, `_includes/header.html` and the demo assets from the preceding known-good site revision using a new reviewed commit. Re-run the existing Pages build and verify the public URL. Preserve the namespaced local storage key; export/migrate data if a new schema is incompatible. For an urgent faulty release, remove the course entry link or restore the last known-good asset set while retaining the evidence package.

There are no provider accounts, gates or external payment orders to roll back in this demo. A later real backend needs its own additive migration, backup/restore and provider-reconciliation runbooks.
