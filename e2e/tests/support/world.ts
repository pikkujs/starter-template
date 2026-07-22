import { existsSync } from 'node:fs'
import { setWorldConstructor } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { BrowserWorld, type BrowserConnection } from '@pikku/cucumber/browser'

const STEEL_SESSION_TIMEOUT_MS = 15 * 60_000
const STEEL_INACTIVITY_TIMEOUT_MS = 4 * 60_000

/** Same path the orchestrator's own browser uses (lib/cdp-browser.ts). */
const CHROMIUM_PATH = process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium'

/**
 * AppWorld — the app's cucumber world, built on @pikku/cucumber/browser.
 *
 * The package owns the browser lifecycle, the actor grammar ("the user",
 * "the admin", they) and the generic step vocabulary. Extend this class for
 * app-specific needs: override createClients() to expose the generated
 * PikkuRPC/PikkuFetch on actors, override resetAppData() to call the app's
 * reset RPC, or add helpers for per-domain *.steps.ts files.
 */
export class AppWorld extends BrowserWorld {}

/**
 * Steel-backed variant. Only used when there is no chromium on this machine.
 *
 * BrowserWorld picks its path from whether `connectBrowser` EXISTS on the class,
 * and it checks that before ever calling it — so a subclass that declares the
 * method can never opt back into a local launch. That is why this is a separate
 * class rather than a branch inside one: the sandbox ships its own chromium, and
 * an unconditional override sent every smoke run to Steel and hard-failed the
 * whole suite when STEEL_API_KEY was unset. A build whose smoke never ran is a
 * build nobody looked at.
 */
export class SteelAppWorld extends BrowserWorld {
  /** Run the suite against a fresh isolated Steel Cloud browser session. */
  protected async connectBrowser(): Promise<BrowserConnection> {
    const apiKey = process.env.STEEL_API_KEY
    if (!apiKey) throw new Error('[e2e] STEEL_API_KEY unset — needs a Steel Cloud browser')
    const baseUrl = process.env.STEEL_BASE_URL || 'https://api.steel.dev'
    const res = await fetch(new URL('/v1/sessions', baseUrl), {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'steel-api-key': apiKey },
      body: JSON.stringify({
        timeout: STEEL_SESSION_TIMEOUT_MS,
        inactivityTimeout: STEEL_INACTIVITY_TIMEOUT_MS,
      }),
    })
    if (!res.ok) {
      throw new Error(`[e2e] Steel session create returned ${res.status}: ${await res.text().catch(() => '')}`)
    }
    const session = (await res.json()) as { id?: string; websocketUrl?: string }
    if (!session.id || !session.websocketUrl) {
      throw new Error('[e2e] Steel session create response had no id/websocketUrl')
    }
    const { id } = session
    // Steel's connect endpoint authenticates the ws handshake by the apiKey query
    // param; the returned websocketUrl carries only the sessionId.
    const ws = new URL(session.websocketUrl)
    ws.searchParams.set('apiKey', apiKey)
    const browser = await chromium.connectOverCDP(ws.toString())
    const release = async () => {
      await fetch(new URL(`/v1/sessions/${id}/release`, baseUrl), {
        method: 'POST',
        headers: { 'steel-api-key': apiKey },
      }).catch((e) => process.stderr.write(`[e2e] Steel release ${id} failed: ${e}\n`))
    }
    return { browser, release }
  }
}

// Local chromium first, Steel only as the fallback.
setWorldConstructor(existsSync(CHROMIUM_PATH) ? AppWorld : SteelAppWorld)
