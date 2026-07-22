# Building in this project

A reusable **component kit** is available via `fabric scaffold --name component-kit` — lay it
down ONCE into `apps/app/src/components/`, then import each from `@/components/<Name>`.
**Compose these instead of hand-rolling UI** — it is faster, consistent, and already themed.

## Available components

Layout:
- `PageHeader` — page title + optional description + right-aligned `actions` slot. Use one per page.
- `Panel` — bordered section with an optional titled header (`title`, `description`, `actions`). The workhorse container.
- `StatCard` — a single metric tile (`label`, `value`, optional `icon`, `color`).
- `StatGrid` — responsive row of `StatCard`s; pass `stats={[{label, value, icon}]}`.

Data (feed these the output of an RPC you implement):
- `DataTable` — generic typed table. Props: `columns` (`{key, header, render?, align?}`), `rows`, `rowKey`, optional `loading`/`empty`/`onRowClick`. Implement a `listX` RPC and pass its rows.
- `BarChart` — dependency-free horizontal bars from `data={[{label, value, color?}]}`. Good for status/count breakdowns from a stats RPC.

State (already used by the app):
- `EmptyState`, `PageLoader`, `NotFoundState`, `ServerErrorState`, `UserCard`.

## How to build a feature page

1. Implement the backend RPCs (`pikku-rpc` / `pikku-kysely` skills): a `listX` and any mutations, with zod input/output and `auth: true`. Scope rows to the signed-in user (`where('userId','=',session.userId)`).
2. Fetch with `usePikkuQuery('listX', {})` and mutate with `usePikkuMutation('createX')` (from `@project/functions-sdk/pikku/api.gen`).
3. Build the page by composing the kit from `@/components/<Name>`: `PageHeader` + `Panel` + `DataTable`/`StatGrid`/`BarChart`. Pass i18n strings (`m.key()`) into the component props.

These are props-only components — they never fetch data themselves. You own the page that wires RPC data into them.
