import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, useWindowDimensions } from 'react-native'

import type { ProductChecksResponse } from '@/services/productChecks'
import { flattenProductCollectionPages, shouldLoadInitialNextPage } from '../model'

interface UseProductCollectionListOptions {
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean
  isLoading: boolean
  pages: ProductChecksResponse[] | undefined
  refetch: () => Promise<unknown>
}

export function useProductCollectionList({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  pages,
  refetch,
}: UseProductCollectionListOptions) {
  const [refreshing, setRefreshing] = useState(false)
  const { height: viewportHeight } = useWindowDimensions()

  const entries = useMemo(() => flattenProductCollectionPages(pages), [pages])

  useFocusEffect(
    useCallback(() => {
      let active = true
      const timeoutId = setTimeout(() => {
        if (active) void refetch()
      }, 250)

      return () => {
        active = false
        clearTimeout(timeoutId)
      }
    }, [refetch]),
  )

  useEffect(() => {
    entries.forEach((entry) => {
      if (entry.frontImage) void Image.prefetch(entry.frontImage)
    })
  }, [entries])

  useEffect(() => {
    if (shouldLoadInitialNextPage({ isFetchingNextPage, isLoading, pages })) {
      void fetchNextPage()
    }
  }, [fetchNextPage, isFetchingNextPage, isLoading, pages])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const onContentSizeChange = useCallback(
    (_width: number, contentHeight: number) => {
      if (contentHeight < viewportHeight && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, viewportHeight],
  )

  return {
    entries,
    onContentSizeChange,
    onEndReached,
    onRefresh,
    refreshing,
  }
}
