import type { RefObject } from 'react'
import type { SharedValue } from 'react-native-reanimated'
import {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Gesture } from 'react-native-gesture-handler'
import * as Haptics from 'expo-haptics'
import { scheduleOnRN } from 'react-native-worklets'

import { productCheckCardMetrics } from '../components/productCheckCardTheme'

const triggerLightHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
const triggerMediumHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
export const triggerSuccessHaptic = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

const timingConfig = {
  duration: 350,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
}

interface ProductCheckCardGestureOptions {
  isSwipingRef: RefObject<boolean>
  onApply: () => void
  translateX: SharedValue<number>
}

export function useProductCheckCardGesture({
  isSwipingRef,
  onApply,
  translateX,
}: ProductCheckCardGestureOptions) {
  const startX = useSharedValue(0)
  const hasCrossedApply = useSharedValue(false)
  const { applyThreshold, maxSwipeRight, rightActionsWidth } = productCheckCardMetrics

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      startX.value = translateX.value
      isSwipingRef.current = true
    })
    .onUpdate((event) => {
      let nextX = startX.value + event.translationX
      if (nextX < -rightActionsWidth) {
        nextX = -rightActionsWidth + (nextX + rightActionsWidth) * 0.2
      }
      if (nextX > maxSwipeRight) {
        nextX = maxSwipeRight + (nextX - maxSwipeRight) * 0.2
      }

      if (nextX > applyThreshold && !hasCrossedApply.value) {
        hasCrossedApply.value = true
        scheduleOnRN(triggerLightHaptic)
      } else if (nextX <= applyThreshold && hasCrossedApply.value) {
        hasCrossedApply.value = false
      }
      translateX.value = nextX
    })
    .onEnd((event) => {
      if (translateX.value > applyThreshold * 0.7) {
        scheduleOnRN(triggerSuccessHaptic)
        scheduleOnRN(onApply)
        translateX.value = withTiming(0, timingConfig)
      } else if (translateX.value < -rightActionsWidth * 0.5 || event.velocityX < -500) {
        scheduleOnRN(triggerMediumHaptic)
        translateX.value = withTiming(-rightActionsWidth, timingConfig)
      } else {
        translateX.value = withTiming(0, timingConfig)
      }
      hasCrossedApply.value = false
      isSwipingRef.current = false
    })

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const applyIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, applyThreshold * 0.8], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(translateX.value, [0, applyThreshold], [0.5, 1], Extrapolation.CLAMP),
      },
    ],
  }))

  return { applyIconStyle, cardStyle, gesture }
}
