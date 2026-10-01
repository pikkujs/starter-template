import { createAuthMiddleware } from 'better-auth/api'
import { oAuthProxy } from 'better-auth/plugins'
import { defineSecret } from '@pikku/core/secret'
import { defineVariable } from '@pikku/core/variable'
import { z } from 'zod'
import type { SingletonServices } from '#pikku/function'

export const OAuthProxySecretSchema = z.string()
export const OAuthProxyUrlSchema = z.string()
export const OAuthProxyClientIdSchema = z.string()

defineSecret({
  name: 'oauthProxySecret',
  displayName: 'OAuth Proxy Secret',
  description: 'Key this stage shares with the Fabric OAuth proxy. Unset turns the proxy off.',
  secretId: 'OAUTH_PROXY_SECRET',
  schema: OAuthProxySecretSchema,
  optional: true,
})

defineVariable({
  name: 'oauthProxyUrl',
  displayName: 'OAuth Proxy URL',
  description: 'Origin of the Fabric OAuth proxy. Unset turns the proxy off.',
  variableId: 'OAUTH_PROXY_URL',
  schema: OAuthProxyUrlSchema,
  optional: true,
})

defineVariable({
  name: 'oauthProxyGoogleClientId',
  displayName: 'OAuth Proxy Google Client ID',
  description: 'Client id of the Fabric-owned Google app the proxy signs in with.',
  variableId: 'OAUTH_PROXY_GOOGLE_CLIENT_ID',
  schema: OAuthProxyClientIdSchema,
  optional: true,
})

defineVariable({
  name: 'oauthProxyGithubClientId',
  displayName: 'OAuth Proxy GitHub Client ID',
  description: 'Client id of the Fabric-owned GitHub app the proxy signs in with.',
  variableId: 'OAUTH_PROXY_GITHUB_CLIENT_ID',
  schema: OAuthProxyClientIdSchema,
  optional: true,
})

const PROXY_CLIENT_SECRET = 'oauth-proxy'

const stageStatePrefix = (stageId: string) => ({
  id: 'oauth-proxy-stage-prefix',
  hooks: {
    after: [
      {
        matcher: (context: { path?: string }) =>
          !!context.path?.startsWith('/sign-in/social') || context.path === '/link-social',
        handler: createAuthMiddleware(async (ctx) => {
          const returned = ctx.context.returned
          if (!returned || typeof returned !== 'object' || !('url' in returned)) return
          if (typeof returned.url !== 'string') return
          const url = new URL(returned.url)
          const state = url.searchParams.get('state')
          if (!state) return
          url.searchParams.set('state', `${stageId}.${state}`)
          ctx.context.returned = { ...returned, url: url.toString() }
        }),
      },
    ],
  },
})

export async function oauthProxyAuth({
  variables,
  secrets,
  stageId,
}: {
  variables: SingletonServices['variables']
  secrets: SingletonServices['secrets']
  stageId: string | undefined
}) {
  const productionURL = await variables.get('OAUTH_PROXY_URL')
  const secret = await secrets
    .getSecret('OAUTH_PROXY_SECRET')
    .then((value) => value?.reveal())
    .catch(() => undefined)
  const googleClientId = await variables.get('OAUTH_PROXY_GOOGLE_CLIENT_ID')
  const githubClientId = await variables.get('OAUTH_PROXY_GITHUB_CLIENT_ID')

  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {}
  if (googleClientId) {
    socialProviders.google = { clientId: googleClientId, clientSecret: PROXY_CLIENT_SECRET }
  }
  if (githubClientId) {
    socialProviders.github = { clientId: githubClientId, clientSecret: PROXY_CLIENT_SECRET }
  }

  if (!productionURL || !secret || !stageId || Object.keys(socialProviders).length === 0) {
    return { socialProviders: {}, plugins: [] }
  }
  return {
    socialProviders,
    plugins: [oAuthProxy({ productionURL, secret }), stageStatePrefix(stageId)],
  }
}
