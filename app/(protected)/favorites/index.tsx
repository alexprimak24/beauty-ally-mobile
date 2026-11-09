import EmptyFavoritesCard from '@/features/productCollection/components/EmptyFavoritesCard'
import { GlassBackButton } from '@/components/ui/GlassBackButton'
import { FavoritesCollectionHeader } from '@/features/productCollection/components/FavoritesCollectionHeader'
import { ProductCollectionList } from '@/features/productCollection/components/ProductCollectionList'
import { useFavoritesCollection } from '@/features/productCollection/hooks/useFavoritesCollection'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FavoritesScreen() {
  const favorites = useFavoritesCollection()

  return (
    <>
      <View className="absolute top-0 z-0 h-2/3 w-full bg-lightPink" />
      <View className="absolute bottom-0 z-0 h-1/3 w-full bg-lightBg" />
      <SafeAreaView className="flex-1">
        <GlassBackButton zIndex={10} />
        <ProductCollectionList
          analyticsSource="favorites"
          emptyState={
            <EmptyFavoritesCard isSearch={Boolean(favorites.search)} query={favorites.search} />
          }
          fetchNextPage={favorites.fetchNextPage}
          hasNextPage={favorites.hasNextPage}
          header={
            <FavoritesCollectionHeader
              hasError={Boolean(favorites.error)}
              onSearchChange={favorites.onSearchChange}
            />
          }
          isFetchingNextPage={favorites.isFetchingNextPage}
          isLoading={favorites.isLoading}
          pages={favorites.data?.pages}
          refetch={favorites.refetch}
        />
      </SafeAreaView>
    </>
  )
}
