import { redirect } from '@tanstack/react-router'
import { fetchSession, type GetSessionOutput } from './session'
import { isUnauthorized } from './rpc'

export const APP_HOME = '/app'

/**
 * Route gates for `beforeLoad`. They run before the route's component mounts, so a
 * signed-out visitor never sees the app shell first — which the effect-based hooks these
 * replace could not prevent, because effects fire after the first render.
 *
 * `isUnauthorized` decides what "signed out" means — pikku says it with a 403, not a 401.
 * Anything else is a real failure and is rethrown so the error boundary shows it instead of
 * silently bouncing to login.
 *
 * Every route using one must also set `ssr: false`: the session cookie is host-only on
 * the API origin, so the SSR worker cannot send it.
 */
export async function requireAuthentication(): Promise<{ session: GetSessionOutput }> {
  try {
    return { session: await fetchSession() }
  } catch (error) {
    if (isUnauthorized(error)) {
      throw redirect({ to: '/app/auth/login' })
    }
    throw error
  }
}

export async function redirectIfAuthenticated(): Promise<void> {
  try {
    await fetchSession()
  } catch (error) {
    if (!isUnauthorized(error)) {
      console.error('Could not check the session before showing an auth screen', error)
    }
    return
  }
  throw redirect({ to: APP_HOME })
}
