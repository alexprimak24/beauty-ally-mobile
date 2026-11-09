import { BlurView } from 'expo-blur'
import type { ViewStyle } from 'react-native'
import { Platform, View } from 'react-native'

interface SafeBlurProps {
  style?: ViewStyle | ViewStyle[]
  intensity?: number
  tint?: 'light' | 'dark' | 'default'
  children?: React.ReactNode
}

export default function SafeBlur({
  style,
  intensity = 30,
  tint = 'dark',
  children,
}: SafeBlurProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} tint={tint} style={style}>
        {children}
      </BlurView>
    )
  }

  // ANDROID FALLBACK
  // Since we don't have blur to separate text from the camera image,
  // we use a slightly more opaque background color than usual.
  const fallbackColor =
    tint === 'light'
      ? 'rgba(255, 255, 255, 0.3)' // Visible white for light tint
      : 'rgba(0, 0, 0, 0.6)' // Darker black for dark tint to ensure readability

  return (
    <View style={[style, { backgroundColor: fallbackColor, overflow: 'hidden' }]}>{children}</View>
  )
}
