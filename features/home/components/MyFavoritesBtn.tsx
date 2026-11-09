import { images } from '@/constants/images'
import PressEffectWrapper from '@/components/ui/PressEffectWrapper'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { main } from '@/utils/i18n/keyConstants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text } from 'react-native'

interface MyFavoritesBtnProps {
  onPress: () => void
}

function MyFavoritesBtn({ onPress }: MyFavoritesBtnProps) {
  const { t } = useTranslation(main)
  const { type, sizes } = useRTokens()

  return (
    <PressEffectWrapper
      onPress={onPress}
      containerClassName="flex-1"
      style={{ aspectRatio: 1 }}
      className="relative flex-1 items-center justify-center rounded-3xl border-2 border-lightPinkBorder bg-lightPink"
      contentStyle={{
        flex: 1,
        borderRadius: scale(24),
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={images.favorites}
        style={{ width: sizes.imgSize, height: sizes.imgSize }}
        resizeMode="contain"
      />
      <Text className="mb-4 font-quicksand text-dark" style={{ fontSize: type.lg }}>
        {t('favorites.header')}
      </Text>
    </PressEffectWrapper>
  )
}

export default MyFavoritesBtn
