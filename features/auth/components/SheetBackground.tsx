import type { PropsWithChildren } from 'react'
import { BlurView } from 'expo-blur'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SHEET_BACKGROUND_COLOR = 'rgba(255,255,255,0.94)'

function SheetBackground({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets()
  const content = (
    <View className="px-6 pt-7" style={{ paddingBottom: Math.max(insets.bottom + 16, 32) }}>
      {children}
    </View>
  )

  if (Platform.OS === 'ios') {
    return (
      <View>
        <BlurView
          intensity={70}
          tint="extraLight"
          style={[StyleSheet.absoluteFill, { backgroundColor: SHEET_BACKGROUND_COLOR }]}
        />
        {content}
      </View>
    )
  }

  return <View style={{ backgroundColor: SHEET_BACKGROUND_COLOR }}>{content}</View>
}

export default SheetBackground
