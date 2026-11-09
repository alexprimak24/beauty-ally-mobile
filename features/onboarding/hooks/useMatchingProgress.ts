import { useCallback, useEffect, useRef, useState } from 'react'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import {
  cancelAnimation,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { getMatchingStepCount, MATCHING_DURATION_MS } from '../model'

function triggerStepHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
}

export function useMatchingProgress() {
  const router = useRouter()
  const progress = useSharedValue(0)
  const [completedSteps, setCompletedSteps] = useState(0)
  const [displayedProgress, setDisplayedProgress] = useState(0)
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const finish = useCallback(() => {
    navigationTimer.current = setTimeout(() => {
      router.push('/(auth)/onboarding/consent')
    }, 300)
  }, [router])

  useEffect(() => {
    progress.value = 0
    progress.value = withTiming(100, { duration: MATCHING_DURATION_MS }, (finished) => {
      if (finished) scheduleOnRN(finish)
    })

    return () => {
      cancelAnimation(progress)
      if (navigationTimer.current) clearTimeout(navigationTimer.current)
    }
  }, [finish, progress])

  useAnimatedReaction(
    () => Math.floor(progress.value),
    (currentProgress, previousProgress) => {
      if (currentProgress === previousProgress) return

      scheduleOnRN(setDisplayedProgress, currentProgress)

      const currentStepCount = getMatchingStepCount(currentProgress)
      const previousStepCount = getMatchingStepCount(previousProgress ?? 0)
      if (currentStepCount > previousStepCount) {
        scheduleOnRN(setCompletedSteps, currentStepCount)
        scheduleOnRN(triggerStepHaptic)
      }
    },
  )

  return { completedSteps, displayedProgress, progress }
}
