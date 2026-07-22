import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'

export const Route = createFileRoute('/reset-password')({
  // The emailed link lands here as /reset-password?token=… — anything else is a
  // token-less visit, which the page handles by pointing back at /forgot-password.
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
  return <ResetPasswordPage />
}
