import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, Text, View } from 'react-native'
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { resultScoreColors, resultSpring } from '../constants'
import type { ResultVerdictConfig } from '../types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface HighlightedFactorProps {
  score: number
  title: string
}

function HighlightedFactor({ score, title }: HighlightedFactorProps) {
  const { t } = useTranslation(main)
  const normalizedScore = Math.max(10, score)
  const progress = useSharedValue(1)
  const animatedBarStyle = useAnimatedStyle(() => {
    const widthPercent = interpolate(progress.value, [0, 1], [0, normalizedScore])
    let backgroundColor: string = resultScoreColors.red

    if (normalizedScore > 60) {
      backgroundColor = interpolateColor(
        progress.value,
        [0, 0.5, 1],
        [resultScoreColors.red, resultScoreColors.orange, resultScoreColors.green],
      )
    } else if (normalizedScore > 30) {
      backgroundColor = interpolateColor(
        progress.value,
        [0, 1],
        [resultScoreColors.red, resultScoreColors.orange],
      )
    }

    return { width: `${widthPercent}%`, backgroundColor }
  })

  return (
    <>
      <Text
        className="font-quicksandSemiBold text-white"
        style={{ fontSize: scale(16), marginTop: scale(20), marginBottom: scale(12) }}
      >
        {t(`result.highlitedFactors.${title}`)}
      </Text>
      <View
        className="w-full overflow-hidden bg-[#fff]"
        style={{ height: scale(5), borderRadius: 100 }}
      >
        <Animated.View style={[{ height: '100%', borderRadius: 100 }, animatedBarStyle]} />
      </View>
    </>
  )
}

interface ResultVerdictCardProps {
  config: ResultVerdictConfig
  factors: { score: number; title: string }[]
  label: string
  shouldAnimate: boolean
}

export function ResultVerdictCard({
  config,
  factors,
  label,
  shouldAnimate,
}: ResultVerdictCardProps) {
  const isPressed = useSharedValue(false)
  const pressedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isPressed.value ? 0.98 : 1, resultSpring) }],
  }))

  return (
    <Animated.View
      style={{
        backgroundColor: config.color,
        marginHorizontal: scale(12),
        borderRadius: scale(46),
        paddingTop: scale(28),
        marginTop: -scale(35),
      }}
      entering={
        shouldAnimate
          ? FadeInDown.delay(300)
              .duration(600)
              .easing(Easing.bezier(0.25, 1, 0.5, 1))
              .withInitialValues({ opacity: 0.9, transform: [{ translateY: 40 }] })
          : undefined
      }
    >
      <View
        className="w-full min-w-0 flex-row items-center justify-center"
        style={{ paddingHorizontal: scale(18) }}
      >
        <Image
          source={config.icon}
          style={{
            width: scale(30),
            height: scale(30),
            marginRight: scale(14),
            marginLeft: scale(2),
          }}
          resizeMode="contain"
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-quicksandBold text-dark"
          style={{ fontSize: scale(24), flexShrink: 1 }}
        >
          {label}
        </Text>
      </View>

      <AnimatedPressable
        onPressIn={() => {
          isPressed.value = true
        }}
        onPressOut={() => {
          isPressed.value = false
        }}
        style={pressedStyle}
      >
        <View
          style={{
            borderRadius: scale(46),
            backgroundColor: '#212529',
            marginTop: scale(24),
            paddingHorizontal: scale(26),
            paddingTop: scale(6),
            paddingBottom: scale(26),
          }}
        >
          {factors.map((factor) => (
            <HighlightedFactor key={factor.title} score={factor.score} title={factor.title} />
          ))}
        </View>
      </AnimatedPressable>
    </Animated.View>
  )
}
