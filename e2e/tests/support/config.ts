export const config = {
  /** Frontend under test. */
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
  /** Backend Pikku server (only used by hooks to ping it before starting). */
  apiUrl: process.env.PIKKU_API_URL ?? 'http://localhost:4003',
  /** Expected value of the `hello-source` testid. Skip the assertion if unset. */
  expectedSource: process.env.APP_SOURCE ?? null,
  /** Whether the app is server-rendered. Controls whether the SSR assertion runs. */
  ssr: process.env.APP_SSR === '1',
  /** Playwright timeout (ms). */
  timeout: 30_000,
}
