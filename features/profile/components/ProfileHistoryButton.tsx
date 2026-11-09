import { useTranslation } from 'react-i18next'
import { Image, Text } from 'react-native'
import { useRouter } from 'expo-router'

import PressEffectWrapper from '@/components/ui/PressEffectWrapper'
import { icons } from '@/constants/icons'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'

export function ProfileHistoryButton() {
  const router = useRouter()
  const { sizes, type } = useRTokens()
  const { t } = useTranslation(components)
  const label = t('scanHistoryBtn.title')

  return (
    <PressEffectWrapper
      onPress={() => router.push('/history')}
      className="w-full flex-row items-center justify-between rounded-full bg-lightGreen px-6"
      fillAll={false}
      accessibilityLabel={t('scanHistoryBtn.a11yOpenHistory')}
      contentStyle={{
        height: sizes.longActionBtnH,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 1,
      }}
    >
      <Text className="font-quicksandBold text-dark" style={{ fontSize: type.xl }}>
        {label}
      </Text>
      <Image
        source={icons.history}
        style={{ width: sizes.longActionBtnImgS2, height: sizes.longActionBtnImgS2 }}
        tintColor="#212529"
      />
    </PressEffectWrapper>
  )
}
