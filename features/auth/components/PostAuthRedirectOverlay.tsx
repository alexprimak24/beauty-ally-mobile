import { useEffect } from 'react'
import { BlurView } from 'expo-blur'
import { Platform, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import LoadingSpinner from '@/components/ui/LoadingIndicator'

interface PostAuthRedirectOverlayProps {
  accessibilityLabel: string
}

export function PostAuthRedirectOverlay({ accessibilityLabel }: PostAuthRedirectOverlayProps) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 350 })
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  const content = (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      className="flex-1 items-center justify-center"
    >
      <LoadingSpinner isBig />
    </View>
  )

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, animatedStyle]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={30} tint="dark" style={styles.fill}>
          {content}
        </BlurView>
      ) : (
        <View style={styles.androidBackdrop}>{content}</View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 1000,
  },
  fill: {
    flex: 1,
  },
  androidBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
})
