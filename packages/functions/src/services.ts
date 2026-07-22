import {
  JsonConsoleLogger,
  LocalEmailService,
  LocalSecretService,
  LocalVariablesService,
  NoopAuditService,
  createInvocationAudit,
} from '@pikku/core/services'
import { createAuditedKysely, KyselyCredentialService } from '@pikku/kysely'
import { pikkuServices, pikkuWireServices } from '../.pikku/pikku-types.gen.js'
import { TypedSecretService } from '../.pikku/secrets/pikku-secrets.gen.js'
import { TypedVariablesService } from '../.pikku/variables/pikku-variables.gen.js'
import { CFWorkerSchemaService } from '@pikku/schema-cfworker'
import type { Kysely } from 'kysely'
import type { VercelAIAgentRunner } from '@pikku/ai-vercel'
import { GeneratedTemplateEmailService } from './lib/email-service.js'
import type { DB } from '#pikku/db/schema.gen.js'

export const createSingletonServices = pikkuServices(async (config, existingServices) => {
  const variables =
    existingServices?.variables ?? new TypedVariablesService(new LocalVariablesService())
  const secrets =
    existingServices?.secrets ?? new TypedSecretService(new LocalSecretService(variables))
  const logger = existingServices?.logger ?? new JsonConsoleLogger()
  const schema = existingServices?.schema ?? new CFWorkerSchemaService(logger)
  const emailService =
    existingServices?.emailService ??
    new GeneratedTemplateEmailService({
      delegate: new LocalEmailService(),
    })
  // The durable audit sink. In a deployed stage fabric injects the platform's
  // audit service; locally it falls back to a no-op so nothing is persisted.
  const audit = existingServices?.audit ?? new NoopAuditService()
  // kysely is injected by pikku dev (node:sqlite) or the CF Worker workflow (libsql).
  // The template never constructs its own dialect — dialects are fabric/runtime
  // concerns — so it must always be provided by the runtime.
  if (!existingServices?.kysely) {
    throw new Error('kysely service was not injected by the runtime (pikku dev / fabric)')
  }
  const kysely: Kysely<DB> = existingServices.kysely

  // Per-user credential store (wire.getCredential) — needed by addons imported
  // with --auth per-user/delegated. CREDENTIALS_KEY is a genuinely-optional
  // secret: without it the app runs fine, credential-using addon calls fail
  // with a clear error from the addon's wire services.
  let credentialService = existingServices?.credentialService
  if (!credentialService) {
    const credentialsKey = await secrets.getSecret('CREDENTIALS_KEY').catch(() => null)
    if (credentialsKey) {
      // Cast via the constructor's own parameter type: duplicate kysely installs
      // make Kysely nominally incompatible (#private) across packages.
      const kyselyCredentials = new KyselyCredentialService(
        kysely as unknown as ConstructorParameters<typeof KyselyCredentialService>[0],
        { key: credentialsKey },
      )
      // Self-creates the credentials table (ifNotExists) — get/set do not auto-init.
      await kyselyCredentials.init()
      credentialService = kyselyCredentials
    }
  }

  const litellmProxyUrl = process.env.LITELLM_PROXY_URL ?? null
  const litellmApiKey = process.env.LITELLM_API_KEY ?? null
  let aiAgentRunner: VercelAIAgentRunner | undefined
  if (litellmProxyUrl && litellmApiKey) {
    // The AI SDKs (~3MB) are stubbed out of non-agent units at bundle time —
    // only units with the `ai-model` capability keep them. So import them
    // dynamically and guard on the module resolving to a real export; in a
    // stubbed unit the import yields `{}` and the runner is simply not built.
    const aiVercel = await import('@pikku/ai-vercel')
    const aiSdk = await import('@ai-sdk/openai-compatible')
    if (aiVercel.VercelAIAgentRunner && aiSdk.createOpenAICompatible) {
      const litellmProvider = aiSdk.createOpenAICompatible({
        name: 'litellm',
        baseURL: litellmProxyUrl,
        apiKey: litellmApiKey,
      })
      aiAgentRunner = new aiVercel.VercelAIAgentRunner({
        openai: (modelId: string) => litellmProvider.chatModel(modelId),
        anthropic: (modelId: string) => litellmProvider.chatModel(modelId),
        google: (modelId: string) => litellmProvider.chatModel(modelId),
        deepseek: (modelId: string) => litellmProvider.chatModel(modelId),
      })
    }
  }

  return {
    ...(existingServices ?? {}),
    config,
    variables,
    secrets,
    schema,
    logger,
    emailService,
    audit,
    kysely,
    ...(credentialService ? { credentialService } : {}),
    ...(aiAgentRunner ? { aiAgentRunner } : {}),
  }
})

export const createWireServices = pikkuWireServices(async (singletonServices, wire) => {
  if (!singletonServices.audit) {
    return {}
  }
  const auditLog = createInvocationAudit(singletonServices.audit, wire)
  // auditLog is ALWAYS injected, but `auditLog.write(...)` only PERSISTS when this
  // function set `audit: true` — createInvocationAudit gates on wire.audit, so
  // without it write() is a warn-only no-op (see @pikku/core audit-service.ts).
  // `auditLog.config` is set ONLY when audit: true is on, and when it is, ALSO wrap
  // kysely so every query is captured and the runner flushes the buffer on close.
  // Without audit: true, leave the plain kysely untouched — no per-query overhead.
  if (!auditLog.config) {
    return { auditLog }
  }
  return {
    auditLog,
    kysely: createAuditedKysely(singletonServices.kysely, { audit: auditLog }),
  }
})
