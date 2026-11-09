import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import React from 'react'
import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useRTokens } from '@/design/useRTokens'

interface PrimaryRoundBtnProps {
  onPress: () => void
  children: ReactNode
  className?: string // Tailwind utility classes for size/custom styling
  accessibilityLabel?: string
}

export default function PrimaryRoundBtn({
  onPress,
  children,
  className,
  accessibilityLabel,
}: PrimaryRoundBtnProps) {
  const { sizes } = useRTokens()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { stiffness: 200 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 200 })
  }

  const handlePress = () => {
    onPress()
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      className="items-center justify-center"
    >
      <Animated.View
        style={[animatedStyle, { width: sizes.pfp, height: sizes.pfp }]}
        className={clsx('items-center justify-center overflow-hidden rounded-full', className)}
      >
        {children}
      </Animated.View>
    </Pressable>
  )
}
