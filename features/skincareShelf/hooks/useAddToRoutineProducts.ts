import { useCallback, useState } from 'react'

import { useProductCollectionList } from '@/features/productCollection/hooks/useProductCollectionList'
import { useInfiniteProductChecksExcludingSkincare } from '@/hooks/useInfiniteProductChecksBase'
import type { ProductChecksEntry } from '@/types/scanEntry'

export function useAddToRoutineProducts() {
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<ProductChecksEntry | null>(null)
  const productChecks = useInfiniteProductChecksExcludingSkincare({ search: query })
  const collection = useProductCollectionList({
    fetchNextPage: productChecks.fetchNextPage,
    hasNextPage: productChecks.hasNextPage,
    isFetchingNextPage: productChecks.isFetchingNextPage,
    isLoading: productChecks.isLoading,
    pages: productChecks.data?.pages,
    refetch: productChecks.refetch,
  })

  const closeRoutineConfiguration = useCallback(() => setSelectedProduct(null), [])

  return {
    closeRoutineConfiguration,
    entries: collection.entries,
    error: productChecks.error,
    isFetchingNextPage: productChecks.isFetchingNextPage,
    isLoading: productChecks.isLoading,
    onContentSizeChange: collection.onContentSizeChange,
    onEndReached: collection.onEndReached,
    onQueryChange: setQuery,
    onRefresh: collection.onRefresh,
    query,
    refreshing: collection.refreshing,
    selectProduct: setSelectedProduct,
    selectedProduct,
  }
}
