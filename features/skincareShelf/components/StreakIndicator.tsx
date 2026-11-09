import { scale } from '@/design/responsiveNew'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { getStreakPalette } from '../model'

interface StreakIndicatorProps {
  streak: number
  noBackground?: boolean
  onPress?: () => void
}

export function StreakIndicator({ streak, noBackground = false, onPress }: StreakIndicatorProps) {
  const { color, backgroundColor } = getStreakPalette(streak)
  const scaleAnimation = useSharedValue(1)
  const rotateAnimation = useSharedValue(0)
  const previousStreak = useRef(streak)

  useEffect(() => {
    if (streak > previousStreak.current) {
      scaleAnimation.value = withSequence(
        withTiming(1.35, { duration: 150, easing: Easing.out(Easing.ease) }),
        withSpring(1, { damping: 5, stiffness: 100 }),
      )
      rotateAnimation.value = withSequence(
        withTiming(10, { duration: 45 }),
        withTiming(-10, { duration: 45 }),
        withTiming(10, { duration: 45 }),
        withTiming(0, { duration: 45 }),
      )
    }
    previousStreak.current = streak
  }, [rotateAnimation, scaleAnimation, streak])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }, { rotate: `${rotateAnimation.value}deg` }],
  }))

  const content = (
    <Animated.View
      style={[
        animatedStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: noBackground ? 'transparent' : backgroundColor,
          paddingHorizontal: noBackground ? 0 : scale(8),
          paddingVertical: noBackground ? 0 : scale(4),
          borderRadius: scale(12),
        },
      ]}
    >
      <Ionicons name={streak > 0 ? 'flame' : 'flame-outline'} size={scale(16)} color={color} />
      <Text
        style={{ fontFamily: 'Quicksand-Bold', fontSize: scale(14), color, marginLeft: scale(4) }}
      >
        {streak}
      </Text>
    </Animated.View>
  )

  if (onPress)
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    )

  return content
}
