import { useFeatureFlag, usePikkuAnalytics } from '@pikku/react'
import type { AnalyticsEvent } from '@/pikku/types.gen'
import type { FeatureFlagName } from '@project/functions/.pikku/scopes/pikku-flags.gen.js'

/** Records a declared analytics event from a screen. The name and props are checked against definitions/analytics.ts. */
export const useAnalytics = () => usePikkuAnalytics<AnalyticsEvent>()

/** Whether to show a feature. The name is checked against definitions/flags.ts; the function checks for itself. */
export const useFlag = (name: FeatureFlagName) => useFeatureFlag<FeatureFlagName>(name)
