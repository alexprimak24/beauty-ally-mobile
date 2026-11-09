import { BlurView } from 'expo-blur'
import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import LoadingLightSpinner from './LoadingLightSpinner'

export default function LoadingOverlay({ visible }: { visible: boolean }) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 350 })
  }, [opacity, visible])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const content = (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Halo glow behind the spinner */}
      {/* <View
        style={{
          position: 'absolute',
          width: 140,
          height: 140,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.06)',
          shadowColor: '#fff',
          shadowOpacity: 0.25,
          shadowRadius: 25,
          transform: [{ scale: 1.2 }],
        }}
      /> */}
      <LoadingLightSpinner />
    </View>
  )

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        {
          ...StyleSheet.absoluteFill,
          zIndex: 1000,
        },
        animatedStyle,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={30} tint="dark" style={{ flex: 1 }}>
          {content}
        </BlurView>
      ) : (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>{content}</View>
      )}
    </Animated.View>
  )
}
