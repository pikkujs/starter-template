import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/AppShell'
import { requireAuthentication } from '@/pikku/auth.gen'

export const Route = createFileRoute('/app')({
  beforeLoad: requireAuthentication,
  component: AppShell,
})
