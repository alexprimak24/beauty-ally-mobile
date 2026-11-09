import ErrorCard from '@/components/ui/ErrorCard'
import { GlassBackButton } from '@/components/ui/GlassBackButton'
import { WARM_BLURHASH } from '@/constants/blurHash'
import { scale, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/design/responsiveNew'
import { components } from '@/utils/i18n/keyConstants'
import { Image as ExpoImage, type ImageProps } from 'expo-image'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ResultPageStateProps {
  loading: boolean
  onRetry?: () => void
  previewKey?: string
  previewSource?: ImageProps['source']
}

const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.45

export function ResultPageState({
  loading,
  onRetry,
  previewKey = 'unknown',
  previewSource,
}: ResultPageStateProps) {
  const { t } = useTranslation(components)

  if (loading && previewSource) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <GlassBackButton zIndex={10} />
        <ExpoImage
          cachePolicy="memory-disk"
          contentFit="cover"
          placeholder={WARM_BLURHASH}
          placeholderContentFit="cover"
          recyclingKey={`${previewKey}:loading-preview`}
          source={previewSource}
          style={{ height: IMAGE_HEIGHT, width: SCREEN_WIDTH }}
          transition={100}
        />
        <View
          className="flex-1 items-center justify-center bg-white"
          style={{
            marginTop: -scale(80),
            borderTopLeftRadius: scale(46),
            borderTopRightRadius: scale(46),
          }}
        >
          <ActivityIndicator color="#212529" size="large" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <GlassBackButton zIndex={10} />
      <View className="flex-1 items-center justify-center px-6">
        {loading ? (
          <ActivityIndicator color="#212529" size="large" />
        ) : (
          <View className="w-full">
            <ErrorCard />
            {onRetry ? (
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.8}
                onPress={onRetry}
                style={{
                  alignSelf: 'center',
                  marginTop: scale(20),
                  borderRadius: scale(24),
                  backgroundColor: '#212529',
                  paddingHorizontal: scale(24),
                  paddingVertical: scale(12),
                }}
              >
                <Text className="font-quicksandBold text-white" style={{ fontSize: scale(14) }}>
                  {t('errorCard.generic')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
