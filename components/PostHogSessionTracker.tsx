import { useAuth } from '@clerk/expo'
import { useAnalytics } from '@/hooks/useAnalytics'
import { analyticsEvents, analyticsScreenFromSegments } from '@/utils/analytics'
import { useSegments } from 'expo-router'
import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'

function PostHogSessionTracker() {
  const analytics = useAnalytics()
  const { isLoaded, userId } = useAuth()
  const lastState = useRef(AppState.currentState)
  const lastScreen = useRef<string | null>(null)
  const previousUserId = useRef<string | null | undefined>(undefined)
  const segments = useSegments()
  const screen = analyticsScreenFromSegments(segments)

  useEffect(() => {
    if (!screen || lastScreen.current === screen) return

    lastScreen.current = screen
    analytics.screen(screen)
  }, [analytics, screen])

  useEffect(() => {
    if (!isLoaded) return

    const previous = previousUserId.current

    if (userId) {
      if (previous && previous !== userId) analytics.reset()
      analytics.identify(userId)
    } else if (previous) {
      analytics.reset()
    }

    previousUserId.current = userId
  }, [analytics, isLoaded, userId])

  useEffect(() => {
    // fire once for cold start (initial active)
    analytics.capture(analyticsEvents.appOpened)

    const sub = AppState.addEventListener('change', (next) => {
      const prev = lastState.current
      lastState.current = next

      if ((prev === 'background' || prev === 'inactive') && next === 'active') {
        analytics.capture(analyticsEvents.appOpened)
      }
    })

    return () => sub.remove()
  }, [analytics])

  return null
}

export default PostHogSessionTracker
