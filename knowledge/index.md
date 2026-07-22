---
type: Overview
title: Knowledge base
description: The builder agent's long-term memory, in the Open Knowledge Format (OKF).
tags: [meta, okf]
---
# Knowledge base

This folder is the builder agent's long-term memory of **this company and product** — short
markdown notes, not code. The agent reads these at the start of every session and updates
them as it learns durable facts.

## Record ONLY what pikku can't tell you

Never duplicate anything the platform already gives you for free. Database tables and
columns, function signatures, routes, wirings, permissions, and roles are all discoverable
with `pikku meta` and the database tools — do **not** copy them here. They drift the moment
the code changes, and a stale copy is worse than none.

Knowledge is the context introspection can't surface:

- **Domain concepts** — what the business's own terms mean
- **Decisions and their reasons** — *why* an approach was chosen, trade-offs accepted
- **Preferences** — style, scope, and things to avoid
- **Constraints** — external facts (a partner API's quirk, a compliance rule) agreed with the user

## Format — Open Knowledge Format (OKF v0.1)

Each note is a markdown file whose **path is its identity**, with YAML frontmatter and a
markdown body. Frontmatter fields (only `type` is required):

- `type` (required) — e.g. `Concept`, `Decision`, `Glossary`, `Preference`, `Overview`
- `title` — a short human label
- `description` — a one-line summary
- `tags` — a list for grouping and search, e.g. `[security, billing]`
- `resource` — a URL the note documents (a dashboard, doc, external service)
- `timestamp` — ISO-8601 of the last meaningful change

Reserved filenames: `index.md` (this section overview) and `log.md` (a chronological
history of changes). Cross-link notes with normal markdown links — they form a graph.

Suggested notes (create as needed):

- `product.md` — what the product is, who it's for, the core problem it solves
- `glossary.md` — the company's own terms and what they mean
- `decisions.md` — choices made together and why
- `preferences.md` — style, scope, and things to avoid

Keep notes concise and current. Do not store secrets or credentials here.

Spec: https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf
