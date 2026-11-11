import { useEffect, useState, type ReactNode } from 'react'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PikkuProvider, createAnalytics, createFeatureFlags, createPikku } from '@pikku/react'
import { PikkuFetch } from '@sdk/api/pikku-fetch.gen'
import { PikkuRPC } from '@sdk/api/pikku-rpc.gen'
import { defaultLocale, localeDir, supportedLocales, setActiveLocale } from '@/i18n/messages'
import { appMeta } from '@/app-meta'
import { apiUrl } from '@/pikku/env.gen'
import type { AnalyticsEvent } from '@/pikku/types.gen'
import type { FeatureFlagName } from '@project/functions/.pikku/scopes/pikku-flags.gen.js'
import { PageViews } from '@/lib/page-views'
import { DefaultErrorPage } from '@/components/DefaultErrorPage'
import { DefaultNotFoundPage } from '@/components/DefaultNotFoundPage'
import globals from '@/styles/globals.css?url'

const LOCALE_KEY = 'app-locale'
const COLOR_SCHEME_KEY = 'app-color-scheme'

export const Route = createRootRoute({
  head: () => ({ meta: appMeta, links: [{ rel: 'stylesheet', href: globals }] }),
  notFoundComponent: DefaultNotFoundPage,
  errorComponent: (props: ErrorComponentProps) => (
    <RootDocument>
      <DefaultErrorPage {...props} />
    </RootDocument>
  ),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
})

// Applies the saved colour scheme before first paint so a dark user never flashes light.
const schemeScript = `try{var s=localStorage.getItem('${COLOR_SCHEME_KEY}');if(s==='dark')document.documentElement.classList.add('dark')}catch(e){}`

function referrerOrigin(): string | undefined {
  try {
    return document.referrer ? new URL(document.referrer).origin : undefined
  } catch {
    return undefined
  }
}

function RootDocument({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<string>(defaultLocale)
  const [queryClient] = useState(() => new QueryClient())
  const [pikku] = useState(() => ({
    ...createPikku(PikkuFetch, PikkuRPC, { serverUrl: apiUrl(), credentials: 'include' }),
    // Not made by createPikku: without these two, useAnalytics and useFlag throw.
    analytics: createAnalytics<AnalyticsEvent>({ endpoint: () => `${apiUrl()}/analytics` }),
    featureFlags: createFeatureFlags<FeatureFlagName>({
      endpoint: () => `${apiUrl()}/feature-flags`,
    }),
  }))
  const router = useRouter()

  useEffect(() => {
    const root = document.documentElement
    const publish = () => {
      if (!router.state.isLoading) root.setAttribute('data-app-hydrated', 'true')
    }
    const clear = () => root.removeAttribute('data-app-hydrated')
    publish()
    const offStart = router.subscribe('onBeforeNavigate', clear)
    const offResolved = router.subscribe('onResolved', publish)
    return () => {
      offStart()
      offResolved()
    }
  }, [router])

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved && supportedLocales.includes(saved as (typeof supportedLocales)[number])) {
      setLocaleRaw(saved)
      setActiveLocale(saved as (typeof supportedLocales)[number])
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = localeDir(locale)
  }, [locale])

  // Studio and console live preview: they post the generated theme.css and we swap it in without persisting.
  // Dev only, and only from the page that frames this one: in production nothing may inject CSS.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const framer = window.location.ancestorOrigins?.[0] ?? referrerOrigin()
    const onMessage = (event: MessageEvent) => {
      const data = event.data
      if (event.source !== window.parent || !framer || event.origin !== framer) return
      if (data?.source !== 'cloud-console' || data.type !== 'set-theme-css') return
      let style = document.getElementById('theme-preview')
      if (!style) {
        style = document.createElement('style')
        style.id = 'theme-preview'
        document.head.appendChild(style)
      }
      style.textContent = typeof data.css === 'string' ? data.css : ''
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const setLocale = (next: string) => {
    localStorage.setItem(LOCALE_KEY, next)
    setLocaleRaw(next)
    setActiveLocale(next as (typeof supportedLocales)[number])
  }

  return (
    <html lang={locale} dir={localeDir(locale)}>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: schemeScript }} />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <PikkuProvider pikku={pikku}>
            <PageViews />
            {children}
          </PikkuProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
