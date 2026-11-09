import { clsx } from 'clsx'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { icons } from '@/constants/icons'

export default function AnimatedBackButton({
  onPress,
  size = 48,
  className,
}: {
  onPress?: () => void
  size?: number
  className?: string
}) {
  const scale = useSharedValue(1)
  const router = useRouter()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value < 1 ? 0.7 : 1,
  }))

  const handleOnPress = () => {
    if (onPress) onPress()
    else router.back()
  }

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 12 })
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 8 })
      }}
      onPress={handleOnPress}
      className={clsx('mr-2', className && className)}
    >
      <Animated.View style={animatedStyle}>
        <Image
          source={icons.goBack}
          resizeMode="contain"
          style={{
            width: size,
            height: size,
          }}
        />
      </Animated.View>
    </Pressable>
  )
}
