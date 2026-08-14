import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { useRedirectIfAuthenticated } from '@/hooks/useAuthGate'

export const Route = createFileRoute('/app_/auth/forgot-password')({
  component: ForgotPasswordRoute,
})

function ForgotPasswordRoute() {
  useRedirectIfAuthenticated()
  return <ForgotPasswordPage />
}
