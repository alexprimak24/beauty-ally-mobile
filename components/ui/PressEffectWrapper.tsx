import type { ReactNode } from 'react'
import type {
  AccessibilityRole,
  AccessibilityState,
  Insets,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { clsx } from 'clsx'
import React from 'react'
import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

interface PressEffectWrapperProps {
  onPress: () => void
  children: ReactNode
  className?: string
  containerClassName?: string
  fillAll?: boolean
  shadowNeeded?: boolean
  needPressInOut?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  onLongPress?: () => void
  hitSlop?: Insets | number
  android_ripple?: { color?: string; borderless?: boolean; radius?: number; foreground?: boolean }
  testID?: string
  accessibilityLabel?: string
  accessibilityHint?: string
  accessibilityRole?: AccessibilityRole
  accessibilityState?: AccessibilityState
}

export default function PressEffectWrapper({
  onPress,
  children,
  className,
  containerClassName,
  fillAll = true,
  shadowNeeded = false,
  needPressInOut = true,
  disabled = false,
  style,
  contentStyle,
  onLongPress,
  hitSlop,
  android_ripple,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
}: PressEffectWrapperProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    if (!needPressInOut || disabled) return
    scale.value = withSpring(0.95, { stiffness: 200 })
  }

  const handlePressOut = () => {
    if (!needPressInOut || disabled) return
    scale.value = withSpring(1, { stiffness: 200 })
  }

  const handlePress = () => {
    if (disabled) return
    onPress()
  }

  const boxShadow: ViewStyle = {
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3,
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={onLongPress}
      hitSlop={hitSlop}
      android_ripple={android_ripple}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled }}
      className={clsx(containerClassName, fillAll && 'flex-1')}
      style={[shadowNeeded && boxShadow, style]}
    >
      <Animated.View
        style={[animatedStyle, contentStyle]}
        className={clsx(className, disabled && 'opacity-50')}
      >
        {children}
      </Animated.View>
    </Pressable>
  )
}
