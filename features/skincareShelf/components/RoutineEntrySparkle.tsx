import { scale } from '@/design/responsiveNew'
import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface RoutineEntrySparkleProps {
  bottom?: number
  delay?: number
  left?: number
  right?: number
  size?: number
  top?: number
}

export function RoutineEntrySparkle({
  bottom,
  delay = 0,
  left,
  right,
  size = 20,
  top,
}: RoutineEntrySparkleProps) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })),
        withTiming(0, { duration: 900, easing: Easing.in(Easing.quad) }),
        withDelay(400, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    )
  }, [delay, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    alignItems: 'center' as const,
    bottom,
    height: size,
    justifyContent: 'center' as const,
    left,
    opacity: progress.value,
    position: 'absolute' as const,
    right,
    top,
    transform: [{ scale: progress.value }, { rotate: `${progress.value * 90}deg` }],
    width: size,
  }))

  return (
    <Animated.View pointerEvents="none" style={animatedStyle}>
      <View
        style={{
          position: 'absolute',
          width: '4%',
          height: '100%',
          backgroundColor: '#FFF',
          borderRadius: size,
          shadowColor: '#FFF',
          shadowOpacity: 0.9,
          shadowRadius: scale(3),
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '4%',
          backgroundColor: '#FFF',
          borderRadius: size,
          shadowColor: '#FFF',
          shadowOpacity: 0.9,
          shadowRadius: scale(3),
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: '30%',
          height: '30%',
          backgroundColor: '#FFF',
          borderRadius: size,
          shadowColor: '#FFF',
          shadowOpacity: 1,
          shadowRadius: scale(5),
        }}
      />
    </Animated.View>
  )
}
