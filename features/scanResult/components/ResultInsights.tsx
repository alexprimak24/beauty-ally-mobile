import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { LayoutChangeEvent } from 'react-native'
import { Image, Pressable, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { resultSpring } from '../constants'
import type { ResultCardConfig } from '../types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function ResultGridCard({ config }: { config: ResultCardConfig }) {
  const { t } = useTranslation(main)
  const isPressed = useSharedValue(false)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isPressed.value ? 0.96 : 1, resultSpring) }],
    opacity: withSpring(isPressed.value ? 0.9 : 1, resultSpring),
  }))

  return (
    <AnimatedPressable
      className="flex-1 justify-between"
      onPressIn={() => {
        isPressed.value = true
      }}
      onPressOut={() => {
        isPressed.value = false
      }}
      style={[
        {
          backgroundColor: config.backgroundColor,
          padding: scale(16),
          borderRadius: scale(32),
          minHeight: scale(170),
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.03)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: scale(10) },
          shadowOpacity: 0.03,
          shadowRadius: scale(20),
        },
        animatedStyle,
      ]}
    >
      <View className="flex-row items-start justify-between">
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            padding: scale(8),
            borderRadius: scale(20),
          }}
        >
          <Image
            source={config.image}
            style={{ width: scale(48), height: scale(48) }}
            resizeMode="contain"
          />
        </View>
      </View>

      <View>
        <Text
          className="font-quicksandBold uppercase text-gray-500 opacity-80"
          style={{ fontSize: scale(11), letterSpacing: scale(1), marginBottom: scale(4) }}
        >
          {t(config.title)}
        </Text>
        {config.frequency ? (
          <Text
            className="font-quicksandBold leading-tight text-gray-900"
            style={{ fontSize: scale(20) }}
          >
            <Trans
              ns={main}
              i18nKey={`result.frequency.${config.frequency}`}
              values={{ times: config.value, period: config.frequency }}
              components={{
                b: (
                  <Text
                    className="font-quicksandBold text-gray-500"
                    style={{ fontSize: scale(18) }}
                  />
                ),
              }}
            />
          </Text>
        ) : (
          <Text
            className="font-quicksandBold leading-tight text-gray-900"
            style={{ fontSize: scale(20) }}
          >
            {t(config.value)}
          </Text>
        )}
      </View>
    </AnimatedPressable>
  )
}

function EditorialInsight({ note, tip }: { note: string; tip: string }) {
  const { t } = useTranslation(main)
  const [noteHeight, setNoteHeight] = useState(0)
  const isNotePressed = useSharedValue(false)
  const isTipPressed = useSharedValue(false)
  const noteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isNotePressed.value ? 0.98 : 1, resultSpring) }],
  }))
  const tipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isTipPressed.value ? 0.98 : 1, resultSpring) }],
  }))

  const handleLayout = (event: LayoutChangeEvent) => {
    setNoteHeight(event.nativeEvent.layout.height)
  }

  const marginHeight = scale(32)

  return (
    <View className="flex-row" style={{ marginTop: scale(32), paddingHorizontal: scale(8) }}>
      <View
        className="overflow-hidden rounded-full bg-gray-200"
        style={{ width: scale(4), marginRight: scale(24) }}
      >
        <View
          className="w-full bg-[#212529]"
          style={{ height: noteHeight + marginHeight / 4, borderRadius: 100 }}
        />
      </View>

      <View className="flex-1 pb-4">
        <View onLayout={handleLayout} style={{ marginBottom: marginHeight }}>
          <Text
            className="font-quicksandBold uppercase tracking-widest text-gray-400"
            style={{ fontSize: scale(12), marginBottom: scale(8) }}
          >
            {t('result.staticText.personalNote')}
          </Text>
          <AnimatedPressable
            onPressIn={() => {
              isNotePressed.value = true
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
            }}
            onPressOut={() => {
              isNotePressed.value = false
            }}
            style={noteStyle}
          >
            <Text
              className="font-quicksandSemiBold text-gray-800"
              style={{ fontSize: scale(18) }}
              selectable
            >
              {note}
            </Text>
          </AnimatedPressable>
        </View>

        <View>
          <View className="flex-row items-center" style={{ marginBottom: scale(8) }}>
            <Ionicons name="flash" size={scale(14)} color="#F59E0B" />
            <Text
              className="font-quicksandBold uppercase tracking-widest text-[#F59E0B]"
              style={{ fontSize: scale(12), marginLeft: scale(8) }}
            >
              {t('result.staticText.usageTip')}
            </Text>
          </View>
          <AnimatedPressable
            onPressIn={() => {
              isTipPressed.value = true
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
            }}
            onPressOut={() => {
              isTipPressed.value = false
            }}
            style={tipStyle}
          >
            <Text
              className="font-quicksandMedium italic text-gray-600"
              style={{ fontSize: scale(14), lineHeight: scale(24) }}
              selectable
            >
              {tip}
            </Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  )
}

interface ResultInsightsProps {
  bestTime: ResultCardConfig
  breakoutRisk: ResultCardConfig
  frequency: ResultCardConfig
  note: string
  routineCompatibility: ResultCardConfig
  tip: string
}

export function ResultInsights({
  bestTime,
  breakoutRisk,
  frequency,
  note,
  routineCompatibility,
  tip,
}: ResultInsightsProps) {
  return (
    <>
      <View style={{ flexDirection: 'column', gap: scale(16) }}>
        <View style={{ flexDirection: 'row', gap: scale(16) }}>
          <ResultGridCard config={routineCompatibility} />
          <ResultGridCard config={breakoutRisk} />
        </View>
        <View style={{ flexDirection: 'row', gap: scale(16) }}>
          <ResultGridCard config={bestTime} />
          <ResultGridCard config={frequency} />
        </View>
      </View>

      <EditorialInsight note={note} tip={tip} />
    </>
  )
}
