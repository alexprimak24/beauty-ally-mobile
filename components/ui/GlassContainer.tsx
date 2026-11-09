import { BlurTargetView, BlurView } from 'expo-blur'
import { useRef } from 'react'
import type { ViewInstance, ViewStyle } from 'react-native'
import { Platform, Pressable } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export function GlassContainer({
  styles,
  children,
  zIndex = 1,
}: {
  styles?: ViewStyle
  children: React.ReactNode
  zIndex?: number
}) {
  const pressed = useSharedValue(false)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? 0.95 : 1, {
          duration: 150,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      },
    ],
    opacity: withTiming(pressed.value ? 0.8 : 1),
  }))

  const targetRef = useRef<ViewInstance>(null)

  return (
    <Pressable
      onPressIn={() => (pressed.value = true)}
      onPressOut={() => (pressed.value = false)}
      style={[styles, { zIndex }]}
      hitSlop={10}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            borderRadius: 100,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.6)',
          },
          animatedStyle,
        ]}
      >
        {Platform.OS === 'android' && (
          <BlurTargetView
            ref={targetRef}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.4)', // tint overlay
            }}
          >
            {children}
          </BlurTargetView>
        )}
        {Platform.OS === 'ios' && (
          <BlurView
            intensity={35}
            tint="light"
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.4)', // tint overlay
            }}
          >
            {children}
          </BlurView>
        )}
      </Animated.View>
    </Pressable>
  )
}
