import type { ReactElement } from 'react'
import { useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

import LoadingDarkSpinner from '@/components/ui/LoadingIndicator'
import { useRTokens } from '@/design/useRTokens'
import ProductCheckCard from './ProductCheckCard'
import ConfigureRoutineModal from '@/features/routine/components/ConfigureRoutineModal'
import { useDeleteMutation } from '@/hooks/useDeleteMutation'
import { useFavoritesMutation } from '@/hooks/useFavoritesMutation'
import { useRemoveProductFromSkincareMutation } from '@/features/routine'
import type { ProductChecksResponse } from '@/services/productChecks'
import type { ProductChecksEntry } from '@/types/scanEntry'
import type { ProductEngagementSource } from '@/utils/analytics'
import { useProductCollectionList } from '../hooks/useProductCollectionList'

interface ProductCollectionListProps {
  analyticsSource: ProductEngagementSource
  emptyState: ReactElement
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean | undefined
  header: ReactElement
  isFetchingNextPage: boolean
  isLoading: boolean
  pages: ProductChecksResponse[] | undefined
  refetch: () => Promise<unknown>
}

export function ProductCollectionList({
  analyticsSource,
  emptyState,
  fetchNextPage,
  hasNextPage,
  header,
  isFetchingNextPage,
  isLoading,
  pages,
  refetch,
}: ProductCollectionListProps) {
  const { type } = useRTokens()
  const [productToConfigure, setProductToConfigure] = useState<ProductChecksEntry | null>(null)
  const deleteMutation = useDeleteMutation()
  const favoriteMutation = useFavoritesMutation()
  const removeSkincareMutation = useRemoveProductFromSkincareMutation()

  const { entries, onContentSizeChange, onEndReached, onRefresh, refreshing } =
    useProductCollectionList({
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      pages,
      refetch,
    })

  return (
    <>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        ListEmptyComponent={!isLoading && !isFetchingNextPage ? emptyState : undefined}
        ListFooterComponent={
          isLoading || isFetchingNextPage ? (
            <View className="self-center" style={{ marginBottom: type.paddingBottom }}>
              <LoadingDarkSpinner />
            </View>
          ) : (
            <View style={{ marginBottom: type.paddingBottom, height: 32 }} />
          )
        }
        contentContainerStyle={{ backgroundColor: '#f4f6f8', minHeight: '100%' }}
        onContentSizeChange={onContentSizeChange}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.8}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View className="px-4">
            <ProductCheckCard
              onToggleFavorites={() =>
                favoriteMutation.mutate({
                  action: item.isFavorites ? 'removed' : 'added',
                  id: item.id,
                  source: analyticsSource,
                })
              }
              onToggleFavoritesDisabled={favoriteMutation.isPending}
              onToggleSkincare={() =>
                removeSkincareMutation.removeProductFromSkincare({
                  id: item.id,
                  source: analyticsSource,
                })
              }
              onToggleSkincareDisabled={removeSkincareMutation.isRemovingProductFromSkincare}
              onDelete={() => deleteMutation.mutate({ id: item.id })}
              onDeleteDisabled={deleteMutation.isPending}
              entry={item}
              variant="secondary"
              onConfigureRoutine={setProductToConfigure}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <ConfigureRoutineModal
        analyticsSource={analyticsSource}
        product={productToConfigure}
        onClose={() => setProductToConfigure(null)}
      />
    </>
  )
}
