import PrimaryBtn from '@/components/ui/PrimaryBtn'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface LayoutGateStateProps {
  isRetrying?: boolean
  onRetry?: () => void
  variant: 'error' | 'loading'
}

export function LayoutGateState({ isRetrying = false, onRetry, variant }: LayoutGateStateProps) {
  const { t } = useTranslation(components)
  const { type } = useRTokens()
  const isLoading = variant === 'loading'

  return (
    <SafeAreaView className="flex-1 bg-[#F4F6F8]">
      <View className="flex-1 items-center justify-center px-6">
        <View
          accessibilityLiveRegion="polite"
          accessibilityRole={isLoading ? undefined : 'alert'}
          className="w-full max-w-md items-center px-7 py-9"
        >
          <View
            className={`mb-5 size-16 items-center justify-center rounded-full ${
              isLoading ? 'bg-[#E8F8F1]' : 'bg-[#FFF0F0]'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator
                accessibilityLabel={t('layoutGate.loadingTitle')}
                color="#212529"
              />
            ) : (
              <Ionicons color="#E45B5B" name="cloud-offline-outline" size={30} />
            )}
          </View>

          <Text className="text-center font-quicksandBold text-dark" style={{ fontSize: type.xl2 }}>
            {t(isLoading ? 'layoutGate.loadingTitle' : 'layoutGate.errorTitle')}
          </Text>
          <Text
            className="mt-2 text-center font-quicksandMedium text-dark/60"
            style={{ fontSize: type.sm, lineHeight: type.sm * 1.5 }}
          >
            {t(isLoading ? 'layoutGate.loadingBody' : 'layoutGate.errorBody')}
          </Text>

          {!isLoading && onRetry ? (
            <View className="mt-7 w-full">
              <PrimaryBtn
                btnHeight={52}
                loading={isRetrying}
                onPress={onRetry}
                text={t('layoutGate.retry')}
              />
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}
