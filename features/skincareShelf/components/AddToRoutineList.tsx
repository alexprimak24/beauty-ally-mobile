import type { ReactElement } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'

import EmptyMySkincareCard from './EmptyMySkincareCard'
import LoadingDarkSpinner from '@/components/ui/LoadingIndicator'
import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import ProductCheckCard from '@/features/productCollection/components/ProductCheckCard'
import type { ProductChecksEntry } from '@/types/scanEntry'

interface AddToRoutineListProps {
  entries: ProductChecksEntry[]
  header: ReactElement
  isFetchingNextPage: boolean
  isLoading: boolean
  onContentSizeChange: (width: number, height: number) => void
  onEndReached: () => void
  onRefresh: () => Promise<void>
  onSelectProduct: (product: ProductChecksEntry) => void
  query: string
  refreshing: boolean
}

export function AddToRoutineList({
  entries,
  header,
  isFetchingNextPage,
  isLoading,
  onContentSizeChange,
  onEndReached,
  onRefresh,
  onSelectProduct,
  query,
  refreshing,
}: AddToRoutineListProps) {
  const { type } = useRTokens()

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View className="px-4">
          <ProductCheckCard entry={item} onSelect={onSelectProduct} variant="secondary" />
        </View>
      )}
      onContentSizeChange={onContentSizeChange}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.8}
      contentContainerStyle={{ paddingBottom: scale(40) }}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        isLoading || isFetchingNextPage ? (
          <View className="self-center" style={{ marginBottom: type.paddingBottom }}>
            <LoadingDarkSpinner />
          </View>
        ) : (
          <View style={{ marginBottom: type.paddingBottom, height: 32 }} />
        )
      }
      ListEmptyComponent={
        !isLoading && !isFetchingNextPage ? (
          <EmptyMySkincareCard isSearch={query.length > 0} />
        ) : undefined
      }
    />
  )
}
