'use client'

import { PikkuProvider } from '@pikku/react'
import { pikku } from '@/lib/pikku'

export function Providers({ children }: { children: React.ReactNode }) {
  return <PikkuProvider pikku={pikku}>{children}</PikkuProvider>
}
