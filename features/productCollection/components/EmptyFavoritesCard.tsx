import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import { images } from '@/constants/images'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'

interface EmptyFavoritesCardProps {
  isSearch?: boolean
  query?: string
}

export default function EmptyFavoritesCard({
  isSearch = false,
  query = '',
}: EmptyFavoritesCardProps) {
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(components)

  return (
    <View className="mb-4 mt-6 flex-1 items-center justify-start px-6">
      <Image
        source={isSearch ? images.entryEmpty : images.favoritesEmpty}
        style={{ marginBottom: 24, width: sizes.emtryCardW, height: sizes.emtryCardH }}
        resizeMode="contain"
      />

      <Text
        className="mb-4 text-center font-quicksandSemiBold text-dark"
        style={{ fontSize: type.lg }}
      >
        {isSearch ? t('emptyFavorites.titleSearch', { query }) : t('emptyFavorites.titleNone')}
      </Text>

      {isSearch ? (
        <Text
          className="mb-4 text-center font-quicksand text-dark/70"
          style={{ fontSize: type.base }}
        >
          <Trans
            ns={components}
            i18nKey="emptyFavorites.hintSearch"
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
            i18nKey="emptyFavorites.hintNone"
            components={{ strong: <Text className="font-quicksandSemiBold" /> }}
          />
        </Text>
      )}
    </View>
  )
}
