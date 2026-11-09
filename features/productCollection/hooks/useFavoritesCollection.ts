import { useAnalytics } from '@/hooks/useAnalytics'
import { useInfiniteFavorites } from '@/hooks/useInfiniteProductChecksBase'
import { analyticsEvents } from '@/utils/analytics'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'

export function useFavoritesCollection() {
  const [search, setSearch] = useState('')
  const analytics = useAnalytics()
  const query = useInfiniteFavorites({ search })

  useFocusEffect(
    useCallback(() => {
      analytics.capture(analyticsEvents.collectionOpened, { collection: 'favorites' })
    }, [analytics]),
  )

  return {
    ...query,
    onSearchChange: useCallback((value: string) => setSearch(value), []),
    search,
  }
}
