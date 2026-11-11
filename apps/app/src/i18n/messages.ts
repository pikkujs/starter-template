import { createAppI18n, asI18n } from '@pikku/react'
import * as runtime from '../paraglide/runtime.js'
import { m as paraglideMessages } from '../paraglide/messages.js'
import active from './active.json'

export const { m, supportedLocales, defaultLocale, localeDir, setActiveLocale, useLocale } =
  createAppI18n({ messages: paraglideMessages, runtime, active })

export { asI18n }
