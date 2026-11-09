import { useRTokens } from '@/design/useRTokens'
import { useMatchingProgress } from '@/features/onboarding/hooks/useMatchingProgress'
import { onboarding } from '@/utils/i18n/keyConstants'
import { clsx } from 'clsx'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MatchingProgressScreen() {
  const matching = useMatchingProgress()
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(onboarding)
  const steps = useMemo(
    () => [
      t('summary.steps.step1'),
      t('summary.steps.step2'),
      t('summary.steps.step3'),
      t('summary.steps.step4'),
      t('summary.steps.step5'),
    ],
    [t],
  )
  const progressStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      matching.progress.value,
      [0, 40, 100],
      ['#F4B2A8', '#F3C7A5', '#2FB5FC'],
    ),
    width: `${matching.progress.value}%`,
  }))
  const progressTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      matching.progress.value,
      [0, 40, 100],
      ['#F4B2A8', '#F3C7A5', '#2FB5FC'],
    ),
  }))

  return (
    <SafeAreaView className="flex-1 px-6 pb-[10px] pt-2">
      <View className="flex-1 justify-center py-8">
        <Animated.Text
          className="text-center font-quicksandBold"
          style={[{ fontSize: type.xl6 }, progressTextStyle]}
        >
          {matching.displayedProgress}%
        </Animated.Text>
        <Text className="mb-6 mt-4 text-center text-dark" style={{ fontSize: type.xl2 }}>
          {t('summary.title')}
        </Text>

        <View className="mb-4 mt-6 justify-center rounded-3xl bg-white px-4 pt-4">
          {steps.map((step, index) => {
            const isCompleted = index < matching.completedSteps

            return (
              <View className="mb-4 flex-row items-center" key={`matching-step-${index + 1}`}>
                <View
                  className={clsx(
                    'mr-3 items-center justify-center rounded-full border-2',
                    isCompleted ? 'border-dark bg-dark' : 'border-gray-300',
                  )}
                  style={{ width: sizes.summaryCheckmarks, height: sizes.summaryCheckmarks }}
                >
                  {isCompleted ? <Text className="font-bold text-white">✓</Text> : null}
                </View>
                <Text
                  className={clsx(
                    'mr-5',
                    isCompleted ? 'font-semibold text-dark' : 'text-gray-500',
                  )}
                  style={{ fontSize: type.base }}
                >
                  {step}
                </Text>
              </View>
            )
          })}
        </View>

        <View className="mx-2 mt-6 h-2 overflow-hidden rounded-full bg-gray-200">
          <Animated.View className="h-2 rounded-full" style={progressStyle} />
        </View>
      </View>
    </SafeAreaView>
  )
}
