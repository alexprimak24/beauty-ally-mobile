import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import { images } from '@/constants/images'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'

interface EmptyMySkincareCardProps {
  isSearch?: boolean
}

export default function EmptyMySkincareCard({ isSearch = false }: EmptyMySkincareCardProps) {
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(components)

  return (
    <View className="mb-4 mt-6 flex-1 items-center justify-start px-6">
      <Image
        source={isSearch ? images.entryEmpty : images.mySkincareEmpty}
        style={{ marginBottom: 24, width: sizes.emtryCardW, height: sizes.emtryCardH }}
        resizeMode="contain"
      />

      <Text
        className="mb-5 text-center font-quicksandSemiBold text-dark"
        style={{ fontSize: type.lg }}
      >
        {isSearch ? (
          t('emptyMySkincare.titleSearch')
        ) : (
          <Trans
            ns={components}
            i18nKey="emptyMySkincare.titleNone"
            components={{ br: <Text>{'\n'}</Text> }}
          />
        )}
      </Text>

      {isSearch ? (
        <Text
          className="mb-4 text-center font-quicksand text-dark/70"
          style={{ fontSize: type.base }}
        >
          <Trans
            ns={components}
            i18nKey="emptyMySkincare.hintSearch"
            components={{ br: <Text>{'\n'}</Text> }}
          />
        </Text>
      ) : (
        <Text
          className="mb-4 text-center font-quicksand text-dark/70"
          style={{ fontSize: type.base }}
        >
          <Trans
            ns={components}
            i18nKey="emptyMySkincare.hintNone"
            components={{ strong: <Text className="font-quicksandSemiBold" /> }}
          />
        </Text>
      )}
    </View>
  )
}
