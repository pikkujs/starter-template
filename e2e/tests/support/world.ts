import { World, setWorldConstructor } from '@cucumber/cucumber'
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test'
import { config } from './config.js'

export class StarterWorld extends World {
  browser!: Browser
  context!: BrowserContext
  page!: Page
  /** Raw HTML from the most recent server response (used for SSR assertions). */
  lastRawHtml: string | null = null

  async openBrowser() {
    this.browser = await chromium.launch({ headless: process.env.HEADED !== '1' })
    this.context = await this.browser.newContext()
    this.page = await this.context.newPage()
    this.page.setDefaultTimeout(config.timeout)
  }

  async closeBrowser() {
    await this.context?.close()
    await this.browser?.close()
  }

  /** Fetch the home page HTML directly (no JS execution) so we can inspect SSR output. */
  async fetchRawHtml(): Promise<string> {
    const res = await fetch(config.appUrl, { redirect: 'manual' })
    if (res.status >= 500) {
      throw new Error(`${config.appUrl} returned ${res.status}`)
    }
    this.lastRawHtml = await res.text()
    return this.lastRawHtml
  }

  async visitHome() {
    await this.page.goto(config.appUrl, { waitUntil: 'domcontentloaded' })
  }

  async getTestId(testid: string): Promise<string> {
    const locator = this.page.getByTestId(testid)
    await locator.first().waitFor({ state: 'visible', timeout: config.timeout })
    return (await locator.first().textContent())?.trim() ?? ''
  }
}

setWorldConstructor(StarterWorld)
