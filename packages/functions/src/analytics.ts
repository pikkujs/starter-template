/**
 * What this app measures.
 *
 * `pageViewed` is a PLACEHOLDER so the Analytics screen has something to show
 * on a fresh project. REPLACE it with the events this app actually cares about.
 *
 * The catalog is read off the declaration at build time, not off a record, so
 * an event lists here before anyone has fired it — which is exactly the event
 * someone is looking for when they open the screen.
 */
import { z } from 'zod'
import { defineAnalyticsEvents } from '@pikku/core/analytics'

export const analyticsEvents = defineAnalyticsEvents({
  pageViewed: z.object({
    path: z.string(),
  }),
})
