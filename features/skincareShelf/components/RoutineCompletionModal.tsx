import { scale } from '@/design/responsiveNew'
import { useCallback, useEffect, useRef } from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { scheduleOnRN } from 'react-native-worklets'

import type { RoutineCompletionType } from '../types'

interface RoutineCompletionModalProps {
  description: string
  height: number
  onClose: () => void
  onComplete: (type: RoutineCompletionType) => void
  themeColor: string
  title: string
  type: RoutineCompletionType | null
}

export function RoutineCompletionModal({
  description,
  height,
  onClose,
  onComplete,
  themeColor,
  title,
  type,
}: RoutineCompletionModalProps) {
  const typeRef = useRef(type)
  const holdProgress = useSharedValue(0)
  const idlePulse = useSharedValue(1)
  const isSuccess = useSharedValue(false)
  const textTranslateY = scale(-15)

  useEffect(() => {
    typeRef.current = type

    if (type !== null) {
      idlePulse.value = withRepeat(
        withTiming(1.08, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      )
      return
    }

    idlePulse.value = 1
  }, [idlePulse, type])

  const finishCompletion = useCallback(() => {
    const completionType = typeRef.current
    if (!completionType) return

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    onClose()
    onComplete(completionType)

    setTimeout(() => {
      isSuccess.value = false
      holdProgress.value = 0
    }, 400)
  }, [holdProgress, isSuccess, onClose, onComplete])

  useAnimatedReaction(
    () => holdProgress.value,
    (value, previousValue) => {
      if (value === 1 && previousValue !== 1 && !isSuccess.value) {
        isSuccess.value = true
        scheduleOnRN(finishCompletion)
      }
    },
  )

  const handlePressIn = useCallback(() => {
    if (isSuccess.value) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    holdProgress.value = withTiming(1, { duration: 1300, easing: Easing.in(Easing.quad) })
  }, [holdProgress, isSuccess])

  const handlePressOut = useCallback(() => {
    if (isSuccess.value || holdProgress.value >= 1) return

    holdProgress.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.quad) })
  }, [holdProgress, isSuccess])

  const close = useCallback(() => {
    onClose()
    setTimeout(() => {
      isSuccess.value = false
      holdProgress.value = 0
    }, 400)
  }, [holdProgress, isSuccess, onClose])

  const expandingOrbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(holdProgress.value, [0, 1], [idlePulse.value, 40], Extrapolation.CLAMP),
      },
    ],
  }))

  const dimBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(holdProgress.value, [0, 0.8], [1, 0], Extrapolation.CLAMP),
  }))

  const textGroupStyle = useAnimatedStyle(() => ({
    opacity: interpolate(holdProgress.value, [0, 0.4], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          holdProgress.value,
          [0, 0.4],
          [0, textTranslateY],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }))

  return (
    <Modal animationType="fade" transparent visible={type !== null}>
      <View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, dimBackgroundStyle]} />
        <TouchableOpacity activeOpacity={1} onPress={close} style={StyleSheet.absoluteFill} />

        <View style={[styles.content, { bottom: height * 0.15 }]}>
          <Animated.View style={[styles.copy, textGroupStyle]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </Animated.View>

          <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View
              style={[styles.completionOrb, { backgroundColor: themeColor }, expandingOrbStyle]}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  copy: {
    alignItems: 'center',
    marginBottom: scale(32),
    paddingHorizontal: scale(10),
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: scale(32),
    color: '#FFF',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Quicksand-Medium',
    fontSize: scale(16),
    color: 'rgba(255,255,255,0.8)',
    marginTop: scale(8),
    textAlign: 'center',
    lineHeight: scale(22),
  },
  completionOrb: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.5,
    shadowRadius: scale(16),
    elevation: 10,
  },
})
