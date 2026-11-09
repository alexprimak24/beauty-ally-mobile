import { scale } from '@/design/responsiveNew'
import { GlassRoundedBtn } from '@/components/ui/GlassRoundedBtn'
import PressEffectWrapper from '@/components/ui/PressEffectWrapper'
import { components } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import { useVideoPlayer, VideoView } from 'expo-video'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scheduleOnRN } from 'react-native-worklets'

const SCAN_GUIDE_KEYS = {
  steps: {
    1: { title: 'scanGuide.steps.1.title', subtitle: 'scanGuide.steps.1.subtitle' },
    2: { title: 'scanGuide.steps.2.title', subtitle: 'scanGuide.steps.2.subtitle' },
    3: { title: 'scanGuide.steps.3.title', subtitle: 'scanGuide.steps.3.subtitle' },
    4: { title: 'scanGuide.steps.4.title', subtitle: 'scanGuide.steps.4.subtitle' },
    5: { title: 'scanGuide.steps.5.title', subtitle: 'scanGuide.steps.5.subtitle' },
  },
  actions: {
    continue: 'scanGuide.actions.continue',
    gotIt: 'scanGuide.actions.gotIt',
  },
}

const STEP_DATA = {
  1: { video: require('@/assets/tutorial/twoTypes.mp4'), keys: SCAN_GUIDE_KEYS.steps[1] },
  2: { video: require('@/assets/tutorial/oneStep.mp4'), keys: SCAN_GUIDE_KEYS.steps[2] },
  3: { video: require('@/assets/tutorial/twoStep.mp4'), keys: SCAN_GUIDE_KEYS.steps[3] },
  4: { video: require('@/assets/tutorial/oneStepShared.mp4'), keys: SCAN_GUIDE_KEYS.steps[4] },
  5: { video: require('@/assets/tutorial/twoStepShared.mp4'), keys: SCAN_GUIDE_KEYS.steps[5] },
} as const

type StepNumber = keyof typeof STEP_DATA

interface Props {
  visible: boolean
  onClose: () => void
}

interface ScanGuideVideoProps {
  source: (typeof STEP_DATA)[StepNumber]['video']
}

function ScanGuideVideo({ source }: ScanGuideVideoProps) {
  const player = useVideoPlayer(source, (nextPlayer) => {
    nextPlayer.muted = true
    nextPlayer.loop = true
    nextPlayer.showNowPlayingNotification = false
    nextPlayer.play()
  })

  return (
    <VideoView
      player={player}
      nativeControls={false}
      contentFit="contain"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default function ScanGuideOverlay({ visible, onClose }: Props) {
  const { t } = useTranslation(components)
  const [step, setStep] = useState<StepNumber>(1)
  const [mounted, setMounted] = useState(false)
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const show = useSharedValue(0)
  const sheetH = Math.round(height - insets.top - insets.bottom)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      setStep(1)
      show.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.cubic) })
    } else {
      show.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (f) => {
        if (f) {
          scheduleOnRN(setMounted, false)
        }
      })
    }
  }, [visible, show])

  const dimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(show.value, [0, 1], [0, 0.9]),
  }))
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(show.value, [0, 1], [24, 0]) }],
  }))

  const handleNext = () => {
    if (step < 5) {
      setStep((s) => (s + 1) as StepNumber)
    } else {
      onClose()
    }
  }

  if (!mounted) return null

  return (
    <Modal visible={mounted} transparent statusBarTranslucent animationType="none">
      <View className="flex-1">
        <Animated.View style={dimStyle} className="absolute inset-0 bg-[#0f172a]" />
        <Pressable onPress={onClose} className="absolute inset-0" />

        <View className="flex-1 justify-end">
          <Animated.View
            style={[sheetStyle, { width, height: sheetH }]}
            className="flex-col overflow-hidden rounded-t-[32px] bg-[#f4f6f8] p-4"
          >
            {/* Header / Progress Dots */}
            <View className="my-2 flex-row items-center justify-between px-2">
              <GlassRoundedBtn size={scale(44)} onPress={onClose}>
                <Ionicons name="close" size={scale(24)} color="#212529" />
              </GlassRoundedBtn>

              <View className="flex-row items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <View
                    key={n}
                    style={{ height: scale(6), width: step === n ? scale(24) : scale(6) }}
                    className={`rounded-full ${step === n ? 'bg-[#334155]' : 'bg-[#cbd5e1]'}`}
                  />
                ))}
              </View>
            </View>

            {/* Content Area */}
            <View className="mt-4 flex-1">
              <View className="mb-8 w-full flex-1 items-center justify-center">
                <ScanGuideVideo key={step} source={STEP_DATA[step].video} />
              </View>

              <View className="mb-4 w-full px-6">
                <Text
                  style={{ fontSize: scale(28), letterSpacing: 0.3 }}
                  className="mb-4 text-center font-quicksandBold text-[#0f172a]"
                >
                  {t(STEP_DATA[step].keys.title)}
                </Text>
                <Text
                  style={{ fontSize: scale(16), lineHeight: scale(24) }}
                  className="text-center font-quicksandMedium text-[#64748b]"
                >
                  {t(STEP_DATA[step].keys.subtitle)}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <PressEffectWrapper
              fillAll={false}
              onPress={handleNext}
              contentStyle={{ marginTop: scale(16), marginBottom: scale(24), height: scale(56) }}
              className="items-center justify-center rounded-full bg-[#0f172a] shadow-sm"
            >
              <Text className="font-quicksandBold text-white" style={{ fontSize: scale(18) }}>
                {step < 5 ? t(SCAN_GUIDE_KEYS.actions.continue) : t(SCAN_GUIDE_KEYS.actions.gotIt)}
              </Text>
            </PressEffectWrapper>
          </Animated.View>
        </View>
      </View>
    </Modal>
  )
}
