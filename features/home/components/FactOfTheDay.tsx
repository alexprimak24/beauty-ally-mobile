import { icons } from '@/constants/icons'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { getDailySkincareTip } from '@/utils/getDailySkincareTip'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'

function FactOfTheDay() {
  const { t } = useTranslation('main')
  const factOfTheDay = getDailySkincareTip(t)
  const { sizes } = useRTokens()

  return (
    <View
      className="mt-8 w-full flex-col bg-lightGreen"
      style={{
        borderRadius: scale(24),
        paddingHorizontal: scale(20),
        paddingVertical: scale(24),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: scale(12) }}>
        <Image
          source={icons.idea}
          style={{ width: sizes.ideaIcon, height: sizes.ideaIcon, marginRight: scale(10) }}
        />
        <Text className="font-quicksandSemiBold text-dark" style={{ fontSize: scale(18) }}>
          {t('home.title')}
        </Text>
      </View>
      <Text
        className="font-quicksandMedium"
        style={{ fontSize: scale(15), lineHeight: scale(22), color: '#4A5D52' }}
      >
        {factOfTheDay}
      </Text>
    </View>
  )
}

export default FactOfTheDay
