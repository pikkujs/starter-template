import type {
  CoreServices,
  CoreSingletonServices,
  CoreConfig,
  CoreUserSession,
} from "@pikku/core"
import type { Kysely } from "kysely"

export interface UserSession extends CoreUserSession {
  userId: string
}

export interface Config extends CoreConfig {}

export interface SingletonServices extends CoreSingletonServices<Config> {
  kysely: Kysely<any>
}

export interface Services extends CoreServices<SingletonServices> {}
