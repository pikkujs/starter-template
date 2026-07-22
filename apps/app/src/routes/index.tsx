import { createFileRoute, redirect } from '@tanstack/react-router'

// The starter has no marketing landing — entry is the sign-in screen. Redirect
// at the router level so it runs during SSR (and every navigation), instead of a
// client-only effect that leaves `/` blank until hydration. Signed-in visitors
// are then bounced to /app by /login's own auth gate.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/login' })
  },
})
