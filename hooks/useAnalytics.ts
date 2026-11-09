import { usePostHog } from 'posthog-react-native'
import { useMemo } from 'react'
import { createAnalyticsClient } from '@/utils/analytics'

export function useAnalytics() {
  const posthog = usePostHog()
  return useMemo(() => createAnalyticsClient(posthog), [posthog])
}
