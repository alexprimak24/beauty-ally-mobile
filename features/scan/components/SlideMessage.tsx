import { useRTokens } from '@/design/useRTokens'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, Text, View } from 'react-native'

interface ScanSuccessMessageProps {
  visible: boolean
  message: string
  /**
   * Callback to sync state with parent.
   * Pass your useState setter here: setVisible={setShowToast}
   */
  setVisible: (visible: boolean) => void
}

export function SlideMessage({ visible, message, setVisible }: ScanSuccessMessageProps) {
  const translateY = useRef(new Animated.Value(20)).current
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.9)).current

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [localVisible, setLocalVisible] = useState(false)
  const { type } = useRTokens()

  useEffect(() => {
    if (visible) {
      setLocalVisible(true)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      // 1. Reset values
      translateY.setValue(20)
      opacity.setValue(0)
      scale.setValue(0.9)

      // 2. Animate In
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
      ]).start()

      // 3. Clear existing timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 4. Wait 1600ms, then fade out
      timeoutRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setLocalVisible(false)
          setVisible(false)
        })
      }, 1600)
    }
  }, [visible, opacity, scale, translateY, setVisible])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!localVisible) return null

  // --- GLASS CONTAINER HELPER ---
  const GlassContainer = Platform.OS === 'ios' ? BlurView : View
  const glassProps =
    Platform.OS === 'ios'
      ? { intensity: 30, tint: 'dark' as const } // type assertion fix just in case
      : {}

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 330, // <--- CHANGED FROM 200 TO 400
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
      pointerEvents="none"
    >
      <GlassContainer
        // @ts-ignore - tint/intensity only exist on BlurView, but View ignores them safely
        {...glassProps}
        style={[
          styles.toastContainer,
          // Android specific override for "Glass" look
          Platform.OS === 'android' && { backgroundColor: 'rgba(20, 20, 20, 0.95)' },
        ]}
      >
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={16} color="#000" />
        </View>

        {/* Text */}
        <Text style={[styles.text, { fontSize: type.base }]} numberOfLines={1}>
          {message}
        </Text>
      </GlassContainer>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',

    // iOS Default Style (BlurView handles bg)
    backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.3)' : undefined,

    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // Crisp glass border
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,

    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,

    gap: 12,
    overflow: 'hidden', // Essential for BlurView borderRadius on iOS
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ade80', // Camera Green
    // backgroundColor: '#d6f5d6', // Camera Green
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-SemiBold',
    fontWeight: '600',
    letterSpacing: 0.3,
    flexShrink: 1, // Ensures text truncates if it hits the 80% limit
  },
})
