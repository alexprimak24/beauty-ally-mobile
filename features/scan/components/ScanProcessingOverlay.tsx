import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import LoadingSecondarySpinner from '@/components/ui/LoadingSecondaryIndicator'
import { components } from '@/utils/i18n/keyConstants'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Easing, Modal, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'

export type ProcessingPreset = 'front' | 'back' | 'both'

const STAGES_DEFAULT: Record<ProcessingPreset, string[]> = {
  front: ['Uploading photo…', 'Reading the label…', 'Reviewing the product…', 'Almost ready…'],
  back: [
    'Uploading photo…',
    'Reading the ingredient list…',
    'Reviewing the product more closely…',
    'Giving your skin profile a closer look…',
    'Checking how this lines up with you…',
    'Almost done…',
  ],
  both: [
    'Reading the label…',
    'Reviewing the product...',
    'Giving your skin profile a closer look…',
    'Checking how the product lines up with you…',
    'Making sure everything fits...',
    'Almost done…',
  ],
}

const ESTIMATE_MS: Record<ProcessingPreset, number> = {
  front: 5000,
  back: 15500,
  both: 16000,
}

const STAGE_BEATS: Record<ProcessingPreset, number[]> = {
  front: [0, 0.15, 0.45, 0.85],
  back: [0, 0.12, 0.25, 0.5, 0.73, 0.9],
  both: [0, 0.1, 0.22, 0.45, 0.7, 0.88],
}

interface ScanProcessingOverlayProps {
  visible: boolean
  preset: ProcessingPreset
  estimateMs?: number
}

export default function ScanProcessingOverlay({
  visible,
  preset,
  estimateMs,
}: ScanProcessingOverlayProps) {
  const [stageIdx, setStageIdx] = useState(0)

  // Progress as a scalar 0..1 (native-driver friendly)
  const progress = useRef(new Animated.Value(0)).current
  const fadeIn = useRef(new Animated.Value(0)).current

  // Pulse opacity near the end
  const barPulse = useRef(new Animated.Value(0)).current
  const pulseAnimRef = useRef<Animated.CompositeAnimation | null>(null)

  const { type } = useRTokens()
  const { t } = useTranslation(components)

  const totalMs = estimateMs ?? ESTIMATE_MS[preset]

  const stages = useMemo(() => {
    const fromI18n = t(`scanProcessingOverlay.stages.${preset}`, {
      returnObjects: true,
      defaultValue: STAGES_DEFAULT[preset],
    }) as unknown

    const arr = Array.isArray(fromI18n) ? (fromI18n as string[]) : STAGES_DEFAULT[preset]
    return arr.length ? arr : STAGES_DEFAULT[preset]
  }, [preset, t])

  useEffect(() => {
    if (!visible) return

    let isActive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    let pulseStartTimer: ReturnType<typeof setTimeout> | null = null

    setStageIdx(0)
    progress.setValue(0)
    fadeIn.setValue(0)
    barPulse.setValue(0)

    pulseAnimRef.current?.stop()
    pulseAnimRef.current = null

    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start()

    // Ramp up to 0.96 and hover
    Animated.timing(progress, {
      toValue: 0.96,
      duration: Math.max(900, totalMs - 700),
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    }).start()

    // Start pulse near the end
    pulseStartTimer = setTimeout(
      () => {
        if (!isActive) return

        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(barPulse, {
              toValue: 1,
              duration: 650,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(barPulse, {
              toValue: 0,
              duration: 650,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        )

        pulseAnimRef.current = loop
        loop.start()
      },
      Math.floor(totalMs * 0.78),
    )

    const beats = STAGE_BEATS[preset]
    const usableBeats =
      beats.length === stages.length
        ? beats
        : stages.map((_, i) => (i === 0 ? 0 : i / Math.max(1, stages.length)))

    const lastStageIndex = stages.length - 1

    usableBeats.forEach((beat, i) => {
      if (i === 0) return

      const ms = Math.floor(totalMs * beat)
      const tmr = setTimeout(() => {
        if (!isActive) return

        setStageIdx(i)

        // Light haptic on each stage change...
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})

        // ...and stronger at the end
        if (i === lastStageIndex) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
        }
      }, ms)

      timers.push(tmr)
    })

    return () => {
      isActive = false
      timers.forEach(clearTimeout)
      if (pulseStartTimer) clearTimeout(pulseStartTimer)
      pulseAnimRef.current?.stop()
      pulseAnimRef.current = null
    }
  }, [visible, preset, stages, totalMs, progress, fadeIn, barPulse])

  if (!visible) return null

  // Subtle pulse opacity (base 0.78 -> 1.0)
  const fillOpacity = barPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.78, 1],
  })

  // Progress as scaleX (0..1). Keep left-anchored.
  const scaleX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.0001, 1], // avoid 0 (some renderers can glitch)
  })

  const Body = (
    <View style={styles.body}>
      <Animated.View style={[styles.cardShell, { opacity: fadeIn }]}>
        <View style={styles.card}>
          <View style={styles.spinnerContainer}>
            <LoadingSecondarySpinner />
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  opacity: fillOpacity,
                  transform: [{ scaleX }],
                  transformOrigin: 'left', // if your RN version ignores this, see note below
                },
              ]}
            />
          </View>

          {/* Stage text */}
          <Text style={[styles.stageText, { fontSize: type.sm }]}>
            {stages[Math.min(stageIdx, stages.length - 1)]}
          </Text>

          <Text style={[styles.hintText, { fontSize: type.xxs }]}>
            {t('scanProcessingOverlay.hint')}
          </Text>
        </View>
      </Animated.View>
    </View>
  )

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.modalRoot}>
        {Platform.OS === 'android' ? (
          <View pointerEvents="none" style={styles.androidBackdrop} />
        ) : (
          <BlurView pointerEvents="none" intensity={40} tint="dark" style={styles.blurBackdrop} />
        )}
        {Body}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  androidBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  blurBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  body: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(24),
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(32),
    borderWidth: StyleSheet.hairlineWidth,
    padding: scale(24),
  },
  cardShell: {
    borderRadius: scale(32),
    maxWidth: 520,
    overflow: 'hidden',
    width: '88%',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  modalRoot: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    flex: 1,
  },
  progressFill: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: '100%',
    width: '100%',
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(4),
    height: scale(8),
    marginBottom: scale(16),
    overflow: 'hidden',
    width: '100%',
  },
  spinnerContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  stageText: {
    color: '#FFFFFF',
    marginBottom: scale(8),
    textAlign: 'center',
  },
})
