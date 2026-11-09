import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect } from 'react'
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

// --- THEME PALETTE ---
const TEXT_MAIN = '#212529'
const TEXT_SUB = '#6B7280'
const ACCENT_COLOR = '#d6f5d6'

// --- RESPONSIVE SCALING ---
const { width } = Dimensions.get('window')
function scale(size: number) {
  const scaleFactor = width / 375
  const cappedScale = Math.min(scaleFactor, 1.3)
  return Math.round(size * cappedScale)
}

const styles = StyleSheet.create({
  iosFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  androidFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerWrapper: {
    width: scale(80),
    height: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  ringContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    overflow: 'hidden',
    position: 'absolute',
  },
  ringGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  ringInnerMask: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    shadowColor: ACCENT_COLOR,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: scale(18),
    fontFamily: 'Quicksand-Bold',
    color: TEXT_MAIN,
    marginBottom: 4,
  },
  subMessage: {
    fontSize: scale(14),
    fontFamily: 'Quicksand-Medium',
    color: TEXT_SUB,
  },
})

// --- GLASS HELPER (Internal) ---
function GlassBackground({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill}>
        <View style={styles.iosFill} />
        {children}
      </BlurView>
    )
  }
  return <View style={styles.androidFill}>{children}</View>
}

interface PaywallLoadingOverlayProps {
  visible: boolean
  message?: string
  subMessage?: string
}

export function PaywallLoadingOverlay({
  visible,
  message = 'Processing...',
  subMessage = 'Securing your plan',
}: PaywallLoadingOverlayProps) {
  const rotation = useSharedValue(0)
  const pulse = useSharedValue(1)

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(withTiming(360, { duration: 1500, easing: Easing.linear }), -1)
      pulse.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        true,
      )
    } else {
      rotation.value = 0
      pulse.value = 1
    }
  }, [pulse, rotation, visible])

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }))

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }))

  if (!visible) return null

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={[StyleSheet.absoluteFill, { zIndex: 999 }]}
    >
      <GlassBackground>
        <View style={styles.contentContainer}>
          <View style={styles.spinnerWrapper}>
            <Animated.View style={[styles.ringContainer, rotateStyle]}>
              <LinearGradient
                colors={[ACCENT_COLOR, 'transparent', ACCENT_COLOR, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ringGradient}
              />
            </Animated.View>

            <View style={styles.ringInnerMask} />

            <Animated.View style={[styles.iconContainer, pulseStyle]}>
              <Ionicons name="lock-closed" size={scale(28)} color={TEXT_MAIN} />
            </Animated.View>
          </View>

          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subMessage}>{subMessage}</Text>
        </View>
      </GlassBackground>
    </Animated.View>
  )
}
