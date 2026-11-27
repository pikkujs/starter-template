import {
  VIRTUAL_USER_SIGN_IN_OPT_IN_ENV,
  provisionVirtualUsers,
  resolveVirtualUserSignIn,
} from '@pikku/better-auth'
import { KyselyScopeService } from '@pikku/kysely'
import { pikkuServerLifecycle } from '#pikku/setup'
import {
  virtualUserConfigs,
  virtualUserEnvironments,
} from '#pikku/scenarios/pikku-virtual-users.gen.js'

export const lifecycle = pikkuServerLifecycle({
  afterStart: async ({ auth, scopeService, kysely, logger, variables }) => {
    const gate = resolveVirtualUserSignIn(await variables.get(VIRTUAL_USER_SIGN_IN_OPT_IN_ENV))
    if (gate.reason !== 'allow-outside-dev-env') {
      return
    }
    if (!auth) {
      throw new Error('Provisioning virtual users needs auth')
    }
    const { created, skipped } = await provisionVirtualUsers(
      {
        auth,
        scopeService: scopeService ?? new KyselyScopeService(kysely as any),
        logger,
      },
      {
        virtualUsers: virtualUserConfigs,
        environments: virtualUserEnvironments,
        environment: await variables.get('PIKKU_ENV'),
      },
    )
    logger.info(`virtual users: created ${created}`)
    for (const reason of skipped) {
      logger.warn(reason)
    }
  },
})
