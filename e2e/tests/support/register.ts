import {
  Given,
  When,
  Then,
  Before,
  After,
  AfterAll,
  defineParameterType,
  setDefaultTimeout,
} from '@cucumber/cucumber'
import { registerBrowserSteps, registerBrowserHooks } from '@pikku/cucumber/browser'

// The shared browser vocabulary ({actor} grammar, form/click/see steps, the
// "every page loads without errors" sweep) and the browser lifecycle hooks.
// Per-domain business steps belong in ../steps/*.steps.ts.
registerBrowserSteps({ Given, When, Then, defineParameterType })
registerBrowserHooks({ Before, After, AfterAll, setDefaultTimeout })

// The page-load sweep visits every route in one step, so give scenarios plenty
// of room. Per-action waits are still bounded by the package's config.timeout.
setDefaultTimeout(Number(process.env.E2E_SCENARIO_TIMEOUT ?? 300_000))

// Don't start a scenario while the dev server is mid-restart (it 5xx's /api
// for a few seconds on boot / file change) — that race reads as a phantom
// failure. Server orchestration itself stays outside these tests.
Before(async function (this: import('./world.js').AppWorld) {
  const actor = await this.actor(undefined)
  await actor.waitForServerReady()
})
