import { When, Then } from '@cucumber/cucumber'
import { strict as assert } from 'node:assert'
import type { StarterWorld } from '../support/world.js'
import { config } from '../support/config.js'

When('I open the home page', async function (this: StarterWorld) {
  await this.visitHome()
})

When('I fetch the raw home page HTML', async function (this: StarterWorld) {
  await this.fetchRawHtml()
})

Then('the testid {string} should equal {string}', async function (
  this: StarterWorld,
  testid: string,
  expected: string,
) {
  const actual = await this.getTestId(testid)
  assert.equal(actual, expected, `testid="${testid}" expected "${expected}", got "${actual}"`)
})

Then('the testid {string} should be a non-empty backend value', async function (
  this: StarterWorld,
  testid: string,
) {
  const actual = await this.getTestId(testid)
  assert.ok(actual.length > 0, `testid="${testid}" was empty`)
  assert.notEqual(actual, '…', `testid="${testid}" still showing the loading placeholder`)
  assert.ok(!actual.startsWith('error:'), `testid="${testid}" returned an error: ${actual}`)
})

Then('the testid {string} should match the configured source', async function (
  this: StarterWorld,
  testid: string,
) {
  if (!config.expectedSource) {
    return // no APP_SOURCE configured — skip strict comparison
  }
  const actual = await this.getTestId(testid)
  assert.equal(
    actual,
    config.expectedSource,
    `testid="${testid}" expected "${config.expectedSource}", got "${actual}"`,
  )
})

Then('the raw HTML should contain {string}', function (this: StarterWorld, fragment: string) {
  if (!config.ssr) {
    return // app declared as non-SSR — initial HTML won't contain the rendered text
  }
  assert.ok(this.lastRawHtml, 'no raw HTML captured — fetch the home page first')
  assert.ok(
    this.lastRawHtml!.includes(fragment),
    `raw HTML missing "${fragment}" — SSR did not embed it. First 500 chars:\n${this.lastRawHtml!.slice(0, 500)}`,
  )
})
