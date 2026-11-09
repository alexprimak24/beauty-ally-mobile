import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'

function MyBeautyShelfTitle() {
  const { type } = useRTokens()
  const { t } = useTranslation(components)

  return (
    <Text className="ml-4 font-quicksandSemiBold text-dark" style={{ fontSize: type.xl }}>
      {t('home.beautyShelf.title')}
    </Text>
  )
}

export default MyBeautyShelfTitle
