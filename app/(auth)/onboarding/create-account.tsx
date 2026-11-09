import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import PrimaryContainer from '@/components/ui/PrimaryContainer'
import { useRTokens } from '@/design/useRTokens'
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons'
import { onboarding } from '@/utils/i18n/keyConstants'

export default function CreateAccountScreen() {
  const { type } = useRTokens()
  const { t } = useTranslation(onboarding)

  return (
    <PrimaryContainer>
      <View className="mt-2 flex-1 flex-col justify-between pb-6">
        <View>
          <Text
            className="mb-2 font-iSansSB font-semibold text-dark"
            style={{ fontSize: type.xl4, letterSpacing: -0.5 }}
          >
            {t('createAccount.title')}
          </Text>
          <Text
            className="font-iSansM font-medium text-darkDisabled"
            style={{ fontSize: type.base, lineHeight: 24 }}
          >
            {t('createAccount.subtitle')}
          </Text>
        </View>

        <View className="w-full gap-6">
          <SocialAuthButtons />
          <Text
            className="px-4 text-center font-iSans text-darkDisabled"
            style={{ fontSize: type.xs }}
          >
            {t('createAccount.terms')}
          </Text>
        </View>
      </View>
    </PrimaryContainer>
  )
}
