// Local dev runner: the API (pikku) and the frontend (vite) together.
//
// Two things this handles that a plain `bun run` cannot:
//  - `.env` is parsed HERE and passed explicitly to both children. The pikku CLI
//    has a node shebang, so bun's implicit .env loading never reaches it, and
//    Better Auth then fails sign-up with an opaque "Requested secret not found".
//  - BETTER_AUTH_SECRET is generated on first run. A committed one would be the
//    same secret in every scaffold; a missing one is a 500 on the first sign-up.
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// The pikku CLI opens the local SQLite database through `node:sqlite`, which only
// exists unflagged from Node 24. On an older Node the CLI is picked over bun by its
// `#!/usr/bin/env node` shebang and dies with an opaque
// `ERR_UNKNOWN_BUILTIN_MODULE: No such built-in module: node:sqlite` — so say why here.
const nodeMajor = Number(process.versions.node.split('.')[0])
if (nodeMajor < 24) {
  console.error(
    `dev: Node ${process.versions.node} is too old — this project needs Node 24+.\n` +
      `     The pikku CLI runs under node (its shebang wins over bun) and opens the\n` +
      `     database with node:sqlite, which older Node does not ship. Without it you\n` +
      `     get "ERR_UNKNOWN_BUILTIN_MODULE: No such built-in module: node:sqlite".`,
  )
  process.exit(1)
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, '.env')

if (!existsSync(envPath)) {
  writeFileSync(
    envPath,
    [
      '# Local development only — this file is gitignored and never deployed.',
      '# Deployed stages get their own secrets injected by the platform.',
      `BETTER_AUTH_SECRET=${randomBytes(32).toString('base64')}`,
      '',
    ].join('\n'),
  )
  console.log('dev: generated .env with a fresh BETTER_AUTH_SECRET')
}

const env = { ...process.env }
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
  if (!match) continue
  const value = match[2].trim().replace(/^["']|["']$/g, '')
  env[match[1]] ??= value
}

const children = [
  spawn('bunx', ['pikku', 'dev'], { cwd: root, env, stdio: 'inherit' }),
  spawn('bun', ['run', '--filter', '@project/app', 'dev'], { cwd: root, env, stdio: 'inherit' }),
]

// One child dying takes the whole dev session with it — a half-running stack
// (frontend up, API down) looks like an app bug and wastes debugging time.
let shuttingDown = false
const shutdown = (code) => {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) child.kill('SIGTERM')
  process.exit(code)
}

for (const child of children) {
  child.on('exit', (code) => shutdown(code ?? 0))
  child.on('error', (err) => {
    console.error(`dev: failed to start a process: ${err.message}`)
    shutdown(1)
  })
}
process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
