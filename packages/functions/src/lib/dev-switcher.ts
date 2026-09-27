import { resolveActorSignIn } from '@pikku/better-auth'
import type { FeatureFlagSource } from '@pikku/core/services'

/** Always on under `pikku dev`; a deployed stage needs actor sign-in and its devSwitcher flag. */
export async function devSwitcherOn(
  featureFlags: FeatureFlagSource | undefined,
  actorSignInOptIn: string | undefined,
): Promise<boolean> {
  const gate = resolveActorSignIn(actorSignInOptIn)
  if (!gate.enabled) return false
  if (gate.mayProvision) return true
  return (await featureFlags?.snapshot())?.devSwitcher?.enabled === true
}
