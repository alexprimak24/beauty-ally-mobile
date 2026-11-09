import { scale } from '@/design/responsiveNew'
import { useOpenLink } from '@/hooks/useOpenLink'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Platform, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GlassContainer } from './GlassContainer'

export function UpdateProductDataBtns({
  zIndex = 1000,
  scanId,
  productLink,
}: {
  zIndex?: number
  scanId: string
  productLink: string
}) {
  const router = useRouter()
  const { openLink } = useOpenLink()
  const insets = useSafeAreaInsets()

  const openEditModal = () => {
    router.push({
      pathname: '/(protected)/(modals)/edit/scan-details',
      params: {
        scanId,
      },
    })
  }

  const openProductWebsite = () => {
    if (!productLink) {
      router.push({
        pathname: '/(protected)/(modals)/edit/scan-details',
        params: {
          scanId,
          isUrl: 'true',
        },
      })
    }

    openLink(productLink!)
  }

  const containerSize = 46

  return (
    <View
      style={{
        position: 'absolute',
        top: Platform.OS === 'android' ? insets.top + scale(10) : insets.top + scale(5),
        right: scale(20),
      }}
    >
      <GlassContainer zIndex={zIndex}>
        <View
          style={{
            flexDirection: 'row',
            gap: scale(10),
            height: scale(containerSize),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            onPress={openEditModal}
            style={{
              paddingHorizontal: scale(12),
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="create-outline" size={24} color="#212529" style={{ marginRight: 2 }} />
          </Pressable>
          <Pressable
            onPress={openProductWebsite}
            style={{
              paddingHorizontal: scale(12),
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="bag-handle-outline"
              size={24}
              color="#212529"
              style={{ marginRight: 2 }}
            />
          </Pressable>
        </View>
      </GlassContainer>
    </View>
  )
}
