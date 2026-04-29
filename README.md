# Pikku Fabric Starter Template

Clone-once starter for a Pikku Fabric project. Ships an empty backend, an SDK package, a Postgres SQL bootstrap, and one empty frontend scaffold per supported stack.

## Quickstart

```sh
npx pikku create my-app
cd my-app
yarn install
pikku dev
```

`pikku create` runs an interactive picker — choose a frontend stack and a backend stack, and unselected scaffolds are removed from the checkout. Without the CLI you can clone this repo and delete the apps you don't want manually.

## Layout

- `packages/functions/` — Pikku backend (functions, wirings, middleware, permissions). `.deploy/` is gitignored.
- `packages/sdk/` — generated Pikku clients (don't hand-edit).
- `sql/` — Postgres initial schema + migrations (kept when the backend uses Postgres).
- `apps/` — frontend scaffolds; pick one and delete the rest.
- `pikku.config.json` — Pikku root config (codegen targets, scaffolding).

## Frontend scaffolds

| App | Stack | Rendering |
| --- | --- | --- |
| `apps/nextjs-tailwind` | Next.js 15 + Tailwind | SSR |
| `apps/react-vite-mantine` | React + Vite + Mantine | Static export |

Each app depends on `@project/sdk` for the generated Pikku client and ships pre-wired:

- `pikkuFetch` (typed HTTP) and `pikkuRPC` (typed RPC) singletons configured from env (`PIKKU_API_URL` / `NEXT_PUBLIC_API_URL` / `VITE_API_URL`).
- `<PikkuProvider>` mounted at the app root — components can call `usePikkuFetch()` / `usePikkuRPC()` straight away.
- Next.js apps include a catch-all proxy at `/api/pikku/[...path]` that forwards every request (any method, any body) to the backend, so the browser hits the same origin and CORS / cookies "just work".

## Commands

- `pikku dev` — run the backend with hot reload (functions package).
- `pikku all` — generate clients into `packages/sdk`.
- Per-app dev: `yarn workspace @project/app-<name> dev`.

## Deploy

This template runs locally via `pikku dev`. To deploy add a runtime addon:

- Cloudflare Workers — `@pikku/deploy-cloudflare`
- AWS Lambda — `@pikku/aws-lambda`
- Express / Fastify / uWebSockets — `@pikku/express` / `@pikku/fastify` / `@pikku/uws`

See [pikkujs.dev](https://pikkujs.dev) for full runtime docs.
