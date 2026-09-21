import { CachedFlagSource } from '@pikku/core/flag'
import type { DeclaredFlag, FlagConfigSnapshot } from '@pikku/core/flag'
import type { FeatureFlagSource } from '@pikku/core/services'
import { FEATURE_FLAGS, FEATURE_FLAGS_FALLBACK } from '#pikku/scopes/pikku-flags.gen.js'

/**
 * Serves the flags this app declares, with no store behind them.
 *
 * Every flag reads at its declared default until a real source is wired, which
 * is what a project wants before it has somewhere to keep overrides — the admin
 * screen still lists what exists, so a flag is discoverable the moment it is
 * declared rather than only once someone has built a store.
 *
 * REPLACE this with a store-backed source to make a flag switchable at runtime.
 */
export class DeclaredFlagSource extends CachedFlagSource {
  constructor() {
    super({ declared: FEATURE_FLAGS })
  }

  protected async fetchSnapshot(): Promise<FlagConfigSnapshot> {
    return FEATURE_FLAGS_FALLBACK
  }
}

/**
 * Tell a flag source which flags this app declares.
 *
 * The runtime injects a store-backed source where there is one — pikku dev's
 * KyselyFeatureFlagStore, a stage's own — and builds it before this app's code
 * is loaded, so it starts out knowing no declaration at all. The console's
 * Feature flags board reads the store's declared set, so without this it lists
 * nothing for an app that declares flags, and "Create missing rows" has nothing
 * to create a row for.
 *
 * The cast is the point rather than a workaround: `setDeclared` is protected
 * because it is meant to be called by whoever knows the declarations, and here
 * that is the app rather than the store it was handed. A source that does not
 * take declarations — a provider like PostHog, whose own UI owns them — simply
 * does not have the method, and is left alone.
 */
export function declareFlagsTo(source: FeatureFlagSource): void {
  const takesDeclarations = source as Partial<{
    setDeclared(declared: DeclaredFlag[]): void
  }>
  takesDeclarations.setDeclared?.(FEATURE_FLAGS)
}
