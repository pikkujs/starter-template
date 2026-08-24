import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/LoginPage'
import { redirectIfAuthenticated } from '@/lib/auth-gate'

export const Route = createFileRoute('/app_/auth/login')({
  ssr: false,
  beforeLoad: redirectIfAuthenticated,
  component: LoginPage,
})
