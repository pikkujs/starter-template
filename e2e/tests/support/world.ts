import { setWorldConstructor } from '@cucumber/cucumber'
import { BrowserWorld } from '@pikku/cucumber/browser'

/**
 * AppWorld — the app's cucumber world, built on @pikku/cucumber/browser.
 *
 * The package owns the browser lifecycle, the actor grammar ("the user",
 * "the admin", they) and the generic step vocabulary. Extend this class for
 * app-specific needs: override createClients() to expose the generated
 * PikkuRPC/PikkuFetch on actors, override resetAppData() to call the app's
 * reset RPC, or add helpers for per-domain *.steps.ts files.
 *
 * The suite runs against the chromium in this image — Playwright finds it via
 * PLAYWRIGHT_CHROMIUM_PATH (set in the sandbox Dockerfile). Do NOT add a
 * `connectBrowser` override to reach a hosted browser: BrowserWorld picks its
 * path from whether that method EXISTS on the class and checks before ever
 * calling it, so declaring it can never opt back into a local launch — which is
 * exactly how every smoke run once got routed off-box and hard-failed the whole
 * suite. A build whose smoke never ran is a build nobody looked at.
 */
export class AppWorld extends BrowserWorld {}

setWorldConstructor(AppWorld)
