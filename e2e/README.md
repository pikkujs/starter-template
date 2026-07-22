# e2e — end-to-end tests (Cucumber + Playwright)

Two tiers:

## `@smoke` — the build gate (mutationless, runs against the live server)

Fast, read-only checks that run against the **already-running** app (the sandbox
dev server, or a local `yarn dev`). They never mutate domain data — they sign in
(an idempotent test-user sign-up) and navigate, nothing more — so they are safe
to run against the normal server on every build.

- `features/auth.feature` — sign in through the real login form.
- `features/pages.feature` — signed in, every static route must render with no
  HTTP error, no failed/5xx app API call, no uncaught exception, and no console
  error. New routes are picked up automatically from the generated route tree.

Run: `yarn workspace @project/e2e test` (the build agent calls this via the
`fabric-app-smoke` tool).

## `@e2e` — deeper behaviour tests (mutating, isolated server + DB)

Create/edit/delete flows and permission checks. Because they mutate state they
must be **deterministic**, so they run like the seminarhof harness: a separate
pikku dev server with its own golden/isolated DB per scenario, against the same
frontend (`E2E_MANAGE_SERVERS=1 E2E_ISOLATED_DB=1`). Add these as the app grows —
do NOT tag them `@smoke` (they are not part of the fast build gate).

## Extend

Add a `features/<domain>.feature` plus `steps/<domain>.steps.ts` per area. Reuse
the generic steps in `steps/common.steps.ts` and the `AppWorld` primitives
(`gotoApp`, `signIn`, `expectText`). Keep `common.steps.ts` and `world.ts`
generic. Tag a scenario `@smoke` only if it is mutationless and must pass on
every build.
