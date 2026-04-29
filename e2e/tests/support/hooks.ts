import { Before, After, BeforeAll, setDefaultTimeout, type ITestCaseHookParameter } from '@cucumber/cucumber'
import type { StarterWorld } from './world.js'
import { config } from './config.js'

setDefaultTimeout(60_000)

async function waitForServer(url: string, label: string, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  let lastErr: unknown = null
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: 'manual' })
      if (res.status < 500) return
    } catch (err) {
      lastErr = err
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`${label} not reachable at ${url} within ${timeoutMs / 1000}s${lastErr ? ` (${lastErr})` : ''}`)
}

BeforeAll(async function () {
  await Promise.all([
    waitForServer(config.apiUrl, 'backend'),
    waitForServer(config.appUrl, 'app'),
  ])
})

Before(async function (this: StarterWorld) {
  await this.openBrowser()
})

After(async function (this: StarterWorld, { result, pickle }: ITestCaseHookParameter) {
  if (result?.status === 'FAILED') {
    try {
      const safe = pickle.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
      const path = `tests/reports/failure-${safe}-${Date.now()}.png`
      await this.page.screenshot({ path, fullPage: true })
      console.log(`Screenshot saved to ${path}`)
    } catch {
      // ignore
    }
  }
  await this.closeBrowser()
})
