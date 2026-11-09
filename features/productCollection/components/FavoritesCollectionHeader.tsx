import ErrorCard from '@/components/ui/ErrorCard'
import { SearchInput } from '@/components/ui/SearchInput'
import { images } from '@/constants/images'
import { useRTokens } from '@/design/useRTokens'
import { main } from '@/utils/i18n/keyConstants'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'

interface FavoritesCollectionHeaderProps {
  hasError: boolean
  onSearchChange: (value: string) => void
}

export function FavoritesCollectionHeader({
  hasError,
  onSearchChange,
}: FavoritesCollectionHeaderProps) {
  const { radii, sizes, type } = useRTokens()
  const { t } = useTranslation(main)

  return (
    <>
      <View
        className="w-full items-center bg-lightPink pb-4"
        style={{ borderBottomLeftRadius: radii.xl3, borderBottomRightRadius: radii.xl3 }}
      >
        <Image
          resizeMode="contain"
          source={images.favorites}
          style={{ width: sizes.image36, height: sizes.image36 }}
        />
        <Text className="font-quicksandSemiBold text-dark" style={{ fontSize: type.xl2 }}>
          {t('favorites.header')}
        </Text>
      </View>
      <View className="px-4">
        <SearchInput
          containerClassName="my-6 bg-white"
          iconColor="#212529"
          onQueryChange={onSearchChange}
          placeholder={t('favorites.searchPlaceholder')}
        />
      </View>
      {hasError ? <ErrorCard message={t('favorites.loadingErr')} /> : null}
    </>
  )
}
