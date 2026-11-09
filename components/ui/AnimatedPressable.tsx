import React from 'react'
import type { PressableProps, StyleProp, ViewStyle } from 'react-native'
import { Pressable } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

// This specific bezier curve mimics high-end Apple easing
const APPLE_EASE = Easing.bezier(0.25, 1, 0.5, 1)

interface AnimatedPressableProps extends Omit<
  PressableProps,
  'children' | 'disabled' | 'onPress' | 'onPressIn' | 'onPressOut' | 'style'
> {
  children: React.ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  activeScale?: number
}

export function AnimatedPressable({
  children,
  onPress,
  style,
  disabled,
  activeScale = 0.92, // The "squeeze" amount
  accessibilityRole,
  accessibilityState,
  ...pressableProps
}: AnimatedPressableProps) {
  const pressed = useSharedValue(false)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? activeScale : 1, {
          duration: 150,
          easing: APPLE_EASE,
        }),
      },
    ],
    opacity: withTiming(pressed.value && !disabled ? 0.75 : 1, {
      duration: 150,
      easing: APPLE_EASE,
    }),
  }))

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      accessibilityRole={accessibilityRole ?? (onPress ? 'button' : undefined)}
      accessibilityState={{ ...accessibilityState, disabled: Boolean(disabled) }}
      onPressIn={() => (pressed.value = true)}
      onPressOut={() => (pressed.value = false)}
      onPress={onPress}
      hitSlop={15}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  )
}
