import { pikkuConfig } from '#pikku/setup'

// The config is built before any service exists, so the port and host cannot
// come from the `variables` service here.
export const createConfig = pikkuConfig(async () => ({
  // oxlint-disable-next-line node/no-process-env
  port: parseInt(process.env.API_PORT || '4003', 10),
  // oxlint-disable-next-line node/no-process-env
  hostname: process.env.HOST || '0.0.0.0',
}))
