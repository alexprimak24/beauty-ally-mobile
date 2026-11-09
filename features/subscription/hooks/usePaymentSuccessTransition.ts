import { useCallback, useEffect, useState } from 'react'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

const HOME_ROUTE = '/(protected)/(tabs)' as const

export function usePaymentSuccessTransition() {
  const router = useRouter()
  const pulse = useSharedValue(1)
  const exit = useSharedValue(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    pulse.value = withRepeat(withSpring(1.05, { damping: 5 }), -1, true)
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    return () => cancelAnimation(pulse)
  }, [pulse])

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }))

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(exit.value, [0, 1], [1, 0.98]) }],
    opacity: interpolate(exit.value, [0, 1], [1, 0]),
  }))

  const overlayStyle = useAnimatedStyle(() => ({ opacity: exit.value }))

  const goHome = useCallback(() => router.replace(HOME_ROUTE), [router])
  const startExit = useCallback(() => {
    if (isExiting) return

    setIsExiting(true)
    void Haptics.selectionAsync()
    exit.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) scheduleOnRN(goHome)
    })
  }, [exit, goHome, isExiting])

  return { contentStyle, iconStyle, isExiting, overlayStyle, startExit }
}
