import { scale } from '@/design/responsiveNew'
import { BlurTargetView, BlurView } from 'expo-blur'
import { useRef } from 'react'
import type { AccessibilityRole, ViewInstance, ViewStyle } from 'react-native'
import { Platform, Pressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export function GlassRoundedBtn({
  zIndex = 1000,
  onPress,
  styles,
  children,
  size,
  accessibilityLabel,
  accessibilityRole = 'button',
}: {
  zIndex?: number
  onPress: () => void
  styles?: ViewStyle
  children: React.ReactNode
  size: number
  accessibilityLabel?: string
  accessibilityRole?: AccessibilityRole
}) {
  const pressed = useSharedValue(false)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 0.9 : 1) }],
    opacity: withTiming(pressed.value ? 0.8 : 1),
  }))

  const targetRef = useRef<ViewInstance>(null)

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      onPress={onPress}
      onPressIn={() => (pressed.value = true)}
      onPressOut={() => (pressed.value = false)}
      style={[
        styles,
        {
          zIndex,
        },
      ]}
      hitSlop={10}
    >
      <Animated.View
        style={[
          {
            width: scale(size),
            height: scale(size),
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
              width: '100%',
              height: '100%',
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
