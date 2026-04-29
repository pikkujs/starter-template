import { pikkuFetch } from '@project/sdk/pikku/pikku-fetch.gen'
import { pikkuRPC } from '@project/sdk/pikku/pikku-rpc.gen'

// In dev, requests go through Vite's /api/pikku proxy (configured in vite.config.ts)
// so the browser stays same-origin. For static export, override at build time via VITE_API_URL.
const serverUrl = import.meta.env.VITE_API_URL ?? '/api/pikku'

pikkuFetch.setServerUrl(serverUrl)
pikkuRPC.setServerUrl(serverUrl)

export { pikkuFetch, pikkuRPC }
export const pikku = { fetch: pikkuFetch, rpc: pikkuRPC }
