import { pikkuFetch } from '@project/sdk/pikku/pikku-fetch.gen'
import { pikkuRPC } from '@project/sdk/pikku/pikku-rpc.gen'

const serverUrl =
  typeof window === 'undefined'
    ? process.env.PIKKU_API_URL ?? 'http://localhost:4003'
    : process.env.NEXT_PUBLIC_API_URL ?? '/api/pikku'

pikkuFetch.setServerUrl(serverUrl)
pikkuRPC.setServerUrl(serverUrl)

export { pikkuFetch, pikkuRPC }
export const pikku = { fetch: pikkuFetch, rpc: pikkuRPC }
