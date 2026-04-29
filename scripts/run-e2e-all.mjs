#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Same e2e suite, run once per app. Assumes each dev server is already up.
// Override any URL/source by exporting the corresponding env var before running.
//
// Add new entries here when the template grows new frontend scaffolds.
// The `id` MUST match the directory name under `apps/` so the discovery
// step below can match it.
const apps = [
  {
    id: 'react-vite-mantine',
    url: process.env.VITE_MANTINE_URL ?? 'http://localhost:5173',
    source: 'client:react-vite',
    ssr: false,
  },
  {
    id: 'nextjs-tailwind',
    url: process.env.NEXTJS_TAILWIND_URL ?? 'http://localhost:3000',
    source: 'ssr:nextjs',
    ssr: true,
  },
]

const appsDir = new URL('../apps/', import.meta.url).pathname
const present = new Set(
  readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(appsDir, d.name, 'package.json')))
    .map((d) => d.name),
)

// Surface unknown app dirs loudly so the runner doesn't silently skip a new
// scaffold someone forgot to register here.
const known = new Set(apps.map((a) => a.id))
const unknown = [...present].filter((id) => !known.has(id))
if (unknown.length) {
  console.error(`apps/ contains directories not registered in run-e2e-all.mjs: ${unknown.join(', ')}`)
  console.error('Add them to the `apps` array (id, url, source, ssr) and re-run.')
  process.exit(1)
}

const targets = apps.filter((a) => present.has(a.id))
if (targets.length === 0) {
  console.log('No apps found in apps/ — nothing to test.')
  process.exit(0)
}

const failures = []
for (const app of targets) {
  console.log(`\n──────── e2e: ${app.id} (${app.url}) ────────`)
  const env = {
    ...process.env,
    APP_URL: app.url,
    APP_SOURCE: app.source,
    APP_SSR: app.ssr ? '1' : '0',
  }
  const code = await new Promise((resolve) => {
    const p = spawn('yarn', ['workspace', '@project/e2e', 'test'], { env, stdio: 'inherit' })
    p.on('close', resolve)
  })
  if (code !== 0) failures.push(app.id)
}

if (failures.length) {
  console.error(`\nFAILED: ${failures.join(', ')}`)
  process.exit(1)
}
console.log(`\nAll ${targets.length} apps passed.`)
