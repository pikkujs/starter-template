---
type: Overview
title: Knowledge base
description: What this app is, in the Fabric profile of the Open Knowledge Format (OKF).
tags: [meta, okf]
---
# Knowledge base

This folder is the record of **what this app is and why** — short markdown notes, not code.
The planner writes it, the build agent reads it before it writes a line, and both update it
as decisions are made. Nothing gets built until there is a slice note here to build.

## Record ONLY what pikku can't tell you

Never duplicate anything the platform already gives you for free. Database tables and
columns, function signatures, routes, wirings, permissions, and roles are all discoverable
with `pikku meta` and the database tools — do **not** copy them here. They drift the moment
the code changes, and a stale copy is worse than none.

Knowledge is the context introspection can't surface:

- **Slices** — the buildable pieces, each carrying the scenario that makes it real
- **Entities** — what the domain's own things are made of, and how they end
- **Decisions and their reasons** — *why* an approach was chosen, trade-offs accepted
- **Constraints** — external facts (a partner API's quirk, a compliance rule) agreed with the user

## Format — OKF v0.1, Fabric profile

Each note is a markdown file whose **path is its identity**, with YAML frontmatter and a
markdown body. Frontmatter: `type` is required; `title`, `description`, `tags`, `resource`
and `timestamp` are optional. Fabric adds two scalars — `status` (`proposed` → `dispatched`
→ `built`) and `entities` (max 3) — on slice notes. Cross-link notes with plain markdown
links: that is what makes this a graph instead of a pile of files.

`index.md` and `log.md` are reserved. Every directory gets an `index.md` linking to its
notes, written in the same turn as the note.

## Layout — sections, not loose files

```
knowledge/
  index.md                     # this note: what the project is; links to each section
  log.md                       # what changed and when
  slices/
    index.md
    01-the-daily-entry.md      # type: slice — one buildable piece, with its scenario
  entities/
    index.md
    entry.md                   # type: entity — what it's made of, how it ends
  decisions/
    index.md
    revocation-ends-a-grant.md # type: decision — one note per silent decision
  open-questions.md            # type: note — asked, not answered
  someday.md                   # type: note — suspected, never built
```

The sections are load-bearing, not a style: a build starts only when `slices/`, `entities/`
or `decisions/` holds a note. Flat `product.md` / `glossary.md` files at the root are **not**
a knowledge base — they leave the project unbuildable.

A slice note carries its scenario as a fenced ```gherkin block written in the **third
person** (`Given 'owner' …`, never `Given I …`), because the scenario runs AS someone. A
quoted word in a step MEANS a persona, wherever it sits in the sentence — so quote only
declared personas and write domain values bare.

There is no `personas/`: the people live in `pikku.config.json`, put there by
`fabric persona`, because they are the same personas pikku materialises scenario actors
from. There is no `scenarios/` or `permissions/` either — a slice note carries its own
scenario and the rule it enforces.

Keep notes concise and current. Do not store secrets or credentials here.

Spec: https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf
