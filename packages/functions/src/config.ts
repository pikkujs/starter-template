import { pikkuConfig } from '#pikku/setup'

// The config is built before any service exists, so the port and host cannot
// come from the `variables` service here.
/* oxlint-disable node/no-process-env */
export const createConfig = pikkuConfig(async () => ({
  port: parseInt(process.env.API_PORT || '4003', 10),
  hostname: process.env.HOST || '0.0.0.0',
}))
