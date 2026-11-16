import { pikkuConfig } from '#pikku/setup'

export const createConfig = pikkuConfig(async () => ({
  port: parseInt(process.env.API_PORT || '4003', 10),
  hostname: process.env.HOST || '0.0.0.0',
  // The dev database `pikku dev` and `pikku db` use.
  sqliteDb: '.pikku-runtime/dev.db',
}))
