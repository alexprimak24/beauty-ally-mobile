import { scale } from '@/design/responsiveNew'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlassRoundedBtn } from './GlassRoundedBtn'

const HOME_ROUTE = '/(protected)/(tabs)'

export function GlassBackButton({ zIndex = 1000 }: { zIndex: number }) {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const goBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push(HOME_ROUTE)
    }
  }

  const iconSize = 46

  return (
    <View
      style={{
        position: 'absolute',
        top: Platform.OS === 'android' ? insets.top + scale(10) : insets.top + scale(5),
        left: scale(20),
      }}
    >
      <GlassRoundedBtn zIndex={zIndex} size={iconSize} onPress={goBack}>
        <Ionicons name="chevron-back" size={24} color="#212529" style={{ marginRight: 2 }} />
      </GlassRoundedBtn>
    </View>
  )
}
