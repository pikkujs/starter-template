/**
 * The people this app is for, and the people its scenarios run as.
 *
 * One `definePersonas` call for the whole project — codegen builds the
 * `PersonaId` union from it, materialises one scenario actor per person, and
 * seeds a user row each, so a second call site would be a second answer to
 * "who uses this app". ADD yours here — do not remove `visitor`. It is not a product
 * persona, it is the actor the shipped scenarios name, and PKU677 requires a browser
 * step's actor to be a literal `actors.<name>`, so they cannot pick one dynamically.
 * Delete it and `actors.visitor` stops type-checking, which fails `pikku all` — and a
 * failed type check means nothing you write afterwards registers at all.
 *
 * Addresses are never written down: each is derived from the persona id and
 * `scenarios.emailDomain` in pikku.config.json, so `visitor` signs in as
 * visitor@actors.local. Writing one by hand is how a run signs in as somebody
 * who was never created.
 */
import { definePersonas } from '#pikku/scopes/pikku-personas.gen.js'

definePersonas({
  visitor: {
    name: 'Visitor',
    jobTitle: 'Synthetic health-check user',
    personality: 'Signs in and checks their own session — proves auth end to end',
    account: {},
  },
})
