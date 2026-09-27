import { z } from 'zod'
import { ACTOR_SIGN_IN_OPT_IN_ENV } from '@pikku/better-auth'
import { pikkuSessionlessFunc } from '#pikku/function'
import { devSwitcherOn } from '../lib/dev-switcher.js'
import { personaList } from '#pikku/scenarios/pikku-personas.gen.js'

const signInable = (app?: string) => {
  const all = personaList.filter((persona) => persona.runnable !== false && persona.email)
  const own = all.filter((persona) => persona.app === app)
  return own.length > 0 ? own : all
}

export const ListDevActorsInput = z.object({ app: z.string().optional() })

export const ListDevActorsOutput = z.object({
  actors: z.array(z.object({ id: z.string(), name: z.string(), jobTitle: z.string().nullable() })),
})

/** The personas the "Sign in as" switcher offers: none unless `devSwitcherOn`. */
export const listDevActors = pikkuSessionlessFunc({
  expose: true,
  readonly: true,
  input: ListDevActorsInput,
  output: ListDevActorsOutput,
  func: async ({ variables, featureFlags }, { app }) => {
    if (!(await devSwitcherOn(featureFlags, await variables.get(ACTOR_SIGN_IN_OPT_IN_ENV)))) {
      return { actors: [] }
    }
    return {
      actors: signInable(app).map((persona) => ({
        id: persona.id,
        name: persona.name ?? persona.id,
        jobTitle: persona.jobTitle ?? null,
      })),
    }
  },
})
