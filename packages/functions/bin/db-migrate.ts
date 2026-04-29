import pg from 'pg'
import { migrate } from 'postgres-migrations'
import { existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.log('[db-migrate] DATABASE_URL not set — skipping migrations')
  process.exit(0)
}

// SQL directory lives at the project root: ../../sql relative to packages/functions/bin/
const sqlDir = resolve(__dirname, '../../../sql')
if (!existsSync(sqlDir)) {
  console.log(`[db-migrate] No sql/ directory found at ${sqlDir} — skipping migrations`)
  process.exit(0)
}

async function main() {
  // Create database if needed
  const url = new URL(databaseUrl!)
  const dbName = url.pathname.slice(1)
  const systemUrl = new URL(databaseUrl!)
  systemUrl.pathname = '/postgres'

  const systemClient = new pg.Client(systemUrl.toString())
  try {
    await systemClient.connect()
    console.log(`[db-migrate] Creating database "${dbName}"...`)
    await systemClient.query(`CREATE DATABASE "${dbName}"`)
  } catch (e: any) {
    if (e.code === '42P04') {
      console.log(`[db-migrate] Database "${dbName}" already exists`)
    } else {
      throw e
    }
  } finally {
    await systemClient.end()
  }

  // Run migrations
  const client = new pg.Client(databaseUrl)
  await client.connect()
  console.log(`[db-migrate] Running migrations from ${sqlDir}...`)
  await migrate({ client }, sqlDir, { logger: undefined })
  console.log('[db-migrate] Migrations complete')
  await client.end()
}

main().catch((e) => {
  console.error('[db-migrate] Migration failed:', e)
  process.exit(1)
})
