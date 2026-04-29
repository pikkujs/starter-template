import {
  JsonConsoleLogger,
  LocalSecretService,
  LocalVariablesService,
} from "@pikku/core/services"
import { pikkuServices } from "../.pikku/pikku-types.gen.js"
import { PikkuMetaService } from "../.pikku/pikku-meta-service.gen.js"
import { CFWorkerSchemaService } from "@pikku/schema-cfworker"
import { PikkuKysely } from "@pikku/kysely-postgres"

export const createSingletonServices = pikkuServices(async (config, { variables, secrets }) => {
  const logger = new JsonConsoleLogger()

  if (!variables) {
    variables = new LocalVariablesService()
  }

  if (!secrets) {
    secrets = new LocalSecretService(variables)
  }

  const schema = new CFWorkerSchemaService(logger)

  const databaseUrl = await secrets.getSecret('DATABASE_URL')
  const kysely = new PikkuKysely(logger, databaseUrl)
  await kysely.init()

  const metaService = new PikkuMetaService()

  return {
    config,
    variables,
    secrets,
    schema,
    logger,
    kysely,
    metaService,
  }
})
