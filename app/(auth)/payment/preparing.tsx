import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useRTokens } from '@/design/useRTokens'
import { PostAuthRedirectOverlay } from '@/features/auth/components/PostAuthRedirectOverlay'
import { usePostAuthRedirect } from '@/features/auth/hooks/usePostAuthRedirect'
import BeautyShelf from '@/features/home/components/BeautyShelf'
import FactOfTheDay from '@/features/home/components/FactOfTheDay'
import HomeHeader from '@/features/home/components/HomeHeader'
import EmptyRecentUploads from '@/features/home/components/EmptyRecentUploads'
import { main, onboarding } from '@/utils/i18n/keyConstants'

export default function PostAuthRedirectScreen() {
  const { type } = useRTokens()
  const { t } = useTranslation([main, onboarding])
  const { displayName } = usePostAuthRedirect()
  const visibleName = displayName || t('home.compliments.list.0', { ns: main })

  return (
    <SafeAreaView className="relative flex-1 bg-white">
      <ScrollView
        pointerEvents="none"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: type.paddingTop,
          paddingBottom: type.paddingBottom,
        }}
      >
        <HomeHeader isRedirect />
        <View className="mt-8">
          <Text className="font-quicksandBold text-dark" style={{ fontSize: type.xl }}>
            {t('home.welcomeStart', { ns: main })}
            {` ${visibleName}`}
          </Text>
        </View>
        <FactOfTheDay />
        <BeautyShelf />
        <View className="mt-10">
          <EmptyRecentUploads onPressScan={() => {}} />
        </View>
      </ScrollView>

      <PostAuthRedirectOverlay
        accessibilityLabel={t('paymentPage.loading.default.message', { ns: onboarding })}
      />
    </SafeAreaView>
  )
}
