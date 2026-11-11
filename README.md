# starter-template

The Tailwind v4 + shadcn/ui Pikku Studio Cloud starter, self-contained: backend (`packages/functions`, with its `pikku.config.json`, `db`, `emails`; plus `knowledge`), `apps/app` (TanStack Start) and `packages/theme` (`themes/<id>.json`, `active.json`,
generated `theme.css`). `bunfig.toml` pins bun's hoisted linker; see AGENTS.md for first run.

## The loop

```bash
# edit packages/theme/themes/<id>.json and active.json; theme.css is generated from them
npx shadcn@latest add dialog                       # from apps/app; lands in packages/blocks/src/ui
bun run lint                                        # @shadcn/lint + react/jsx-no-literals
```

UI is `packages/blocks/src/ui/*` (shadcn, `@project/blocks`, yours to edit) styled by tokens in `theme.css`. Colours the theme has no
field for go in a stylesheet you add and import from `src/styles/globals.css`. Components with stories are visible in the studio Library view;
bespoke app components stay in `apps/app/src/components`.
