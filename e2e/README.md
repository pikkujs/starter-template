# @project/e2e

Cucumber + Playwright smoke test for any starter-template frontend.

The suite contains a **single** scenario: load the app's home page, verify the Hello World testids render, and (for SSR apps) confirm the message is in the initial HTML. To cover all the bundled apps, run the same suite once per app — pointing `APP_URL` at the right dev server each time.

Tests target apps via `data-testid` only — no CSS classes, no library-specific selectors — so the same assertions work whether the app is built on Mantine or Tailwind.

## Run against one app

```sh
APP_URL=http://localhost:3001 \
APP_SOURCE=ssr:nextjs \
APP_SSR=1 \
yarn workspace @project/e2e test
```

## Env vars

| Var | Purpose | Default |
| --- | --- | --- |
| `APP_URL` | Frontend dev-server URL | `http://localhost:3000` |
| `PIKKU_API_URL` | Backend URL (used for the readiness ping) | `http://localhost:4003` |
| `APP_SOURCE` | Expected value of the `hello-source` testid (e.g. `ssr:nextjs`, `ssr:tanstack-start`, `client:react-vite`). Skipped if unset | — |
| `APP_SSR` | `1` to assert Hello World is in the initial HTML; otherwise skipped | `0` |
| `HEADED` | `1` to run Playwright with a visible browser | `0` |

## Run against every bundled app

From the repo root:

```sh
yarn test:e2e:all
```

That script iterates the apps (each on a known port) and runs the suite once per app with the right env wiring.

## Shared testids

| testid | meaning |
| --- | --- |
| `hello-message` | Hello World heading text |
| `hello-timestamp` | Timestamp returned by the backend `/hello` endpoint |
| `hello-source` | Render-path marker (`ssr:nextjs`, `ssr:tanstack-start`, `client:react-vite`) |
