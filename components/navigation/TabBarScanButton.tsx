import type { ReactNode } from 'react'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useRTokens } from '@/design/useRTokens'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    zIndex: 99,
  },
  button: {
    backgroundColor: '#212529',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#212529',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
})

interface TabBarScanButtonProps {
  onPress: () => void
  children: ReactNode
  accessibilityLabel?: string
}

export function TabBarScanButton({ onPress, children, accessibilityLabel }: TabBarScanButtonProps) {
  const { sizes } = useRTokens()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { stiffness: 200 })
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
      style={styles.wrapper}
    >
      <Animated.View
        style={[styles.button, animatedStyle, { width: sizes.scanBtn, height: sizes.scanBtn }]}
      >
        {children}
      </Animated.View>
    </Pressable>
  )
}
