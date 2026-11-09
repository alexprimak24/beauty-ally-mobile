import * as Haptics from 'expo-haptics'
import { Gesture } from 'react-native-gesture-handler'
import {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { routineEntryLayout } from '../routineEntryTheme'
import type { ShelfEntryItem } from '../types'

const triggerLightHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
const triggerMediumHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
const triggerSuccessHaptic = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

interface UseRoutineEntrySwipeOptions {
  entry: ShelfEntryItem
  isApplyDisabled: boolean
  isInteractive: boolean
  onApplyToggle?: (entry: ShelfEntryItem) => void
}

export function useRoutineEntrySwipe({
  entry,
  isApplyDisabled,
  isInteractive,
  onApplyToggle,
}: UseRoutineEntrySwipeOptions) {
  const rightActionsWidth = routineEntryLayout.actionButtonWidth * 2
  const translateX = useSharedValue(0)
  const startX = useSharedValue(0)
  const hasCrossedApply = useSharedValue(false)
  const canTriggerApply = useSharedValue(false)
  const timingConfig = { duration: 220, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
  const applyToggle = () => onApplyToggle?.(entry)

  const panGesture = Gesture.Pan()
    .enabled(!isApplyDisabled)
    .activeOffsetX([-4, 4])
    .failOffsetY([-10, 10])
    .onStart(() => {
      startX.value = translateX.value
      canTriggerApply.value = startX.value >= -4
    })
    .onUpdate((event) => {
      let nextX = startX.value + event.translationX

      if (nextX < -rightActionsWidth) {
        nextX = -rightActionsWidth + (nextX + rightActionsWidth) * 0.2
      }
      if (nextX > routineEntryLayout.maxSwipeRight) {
        nextX = routineEntryLayout.maxSwipeRight + (nextX - routineEntryLayout.maxSwipeRight) * 0.2
      }
      if (!canTriggerApply.value && nextX > 0) nextX = 0
      if (!isInteractive && nextX > 0) nextX = 0

      if (
        isInteractive &&
        canTriggerApply.value &&
        nextX > routineEntryLayout.applyThreshold &&
        !hasCrossedApply.value
      ) {
        hasCrossedApply.value = true
        scheduleOnRN(triggerLightHaptic)
      } else if (!canTriggerApply.value || nextX <= routineEntryLayout.applyThreshold) {
        hasCrossedApply.value = false
      }

      translateX.value = nextX
    })
    .onEnd((event) => {
      if (
        isInteractive &&
        canTriggerApply.value &&
        (translateX.value > routineEntryLayout.applyThreshold * 0.6 || event.velocityX > 600)
      ) {
        scheduleOnRN(triggerSuccessHaptic)
        if (onApplyToggle) scheduleOnRN(applyToggle)
        translateX.value = withTiming(0, timingConfig)
      } else if (translateX.value < -rightActionsWidth * 0.5 || event.velocityX < -500) {
        scheduleOnRN(triggerMediumHaptic)
        translateX.value = withTiming(-rightActionsWidth, timingConfig)
      } else {
        translateX.value = withTiming(0, timingConfig)
      }

      hasCrossedApply.value = false
      canTriggerApply.value = false
    })

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  const animatedApplyIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, routineEntryLayout.applyThreshold * 0.8],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, routineEntryLayout.applyThreshold],
          [0.5, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }))
  const closeActions = () => {
    translateX.value = withTiming(0, timingConfig)
  }

  return {
    animatedApplyIconStyle,
    animatedCardStyle,
    closeActions,
    panGesture,
    rightActionsWidth,
  }
}
