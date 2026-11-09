import { RAW_PRODUCT_CHECKS_KEYS } from '@/hooks/useInfiniteProductChecksBase'
import { addToFavoritesProductCheck } from '@/services/manipulateProductChecks'
import type { ProductChecksResponse } from '@/services/productChecks'
import type { GetRoutineForDateRes } from '@/services/routine'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { analyticsEvents } from '@/utils/analytics'
import type { ProductEngagementSource } from '@/utils/analytics'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { useAuth } from '@clerk/expo'
import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useErrorToast } from './useErrorToast'
import { useAnalytics } from './useAnalytics'

interface FavoritesMutationVariables {
  action: 'added' | 'removed'
  id: string
  source: ProductEngagementSource
}

export function useFavoritesMutation() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  const analytics = useAnalytics()

  const mutation = useMutation({
    mutationFn: ({ id }: FavoritesMutationVariables) => addToFavoritesProductCheck(getToken, id),

    onMutate: async ({ id }) => {
      await Promise.all([
        ...Object.values(RAW_PRODUCT_CHECKS_KEYS).map((root) =>
          qc.cancelQueries({ queryKey: [root] }),
        ),
        qc.cancelQueries({ queryKey: queryKeys.productCheck.all }),
        qc.cancelQueries({ queryKey: queryKeys.routine.all }),
      ])

      const backups: Record<string, unknown> = {}

      // 1) Infinite product checks caches
      const productCheckKeys = qc
        .getQueryCache()
        .findAll()
        .map((q) => q.queryKey)
        .filter(
          (key) =>
            Array.isArray(key) &&
            typeof key[0] === 'string' &&
            Object.values(RAW_PRODUCT_CHECKS_KEYS).includes(key[0]),
        )

      for (const key of productCheckKeys) {
        const root = key[0] as string
        const prev = qc.getQueryData<InfiniteData<ProductChecksResponse>>(key)
        if (!prev) continue

        backups[JSON.stringify(key)] = prev

        const next: InfiniteData<ProductChecksResponse> = {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            entries:
              root === RAW_PRODUCT_CHECKS_KEYS.favorites
                ? page.entries.filter((e) => e.id !== id)
                : page.entries.map((e) =>
                    e.id === id ? { ...e, isFavorites: !e.isFavorites } : e,
                  ),
          })),
        }

        qc.setQueryData(key, next)
      }

      // 2) Product detail caches
      const detailKeys = qc
        .getQueryCache()
        .findAll()
        .map((q) => q.queryKey)
        .filter(
          (key) => Array.isArray(key) && key[0] === queryKeys.productCheck.all[0] && key[1] === id,
        )

      for (const key of detailKeys) {
        const prevDetail = qc.getQueryData<ProductChecksEntry>(key)
        if (!prevDetail) continue

        backups[JSON.stringify(key)] = prevDetail
        qc.setQueryData(key, { ...prevDetail, isFavorites: !prevDetail.isFavorites })
      }

      // 3) Routine caches
      const routineKeys = qc
        .getQueryCache()
        .findAll()
        .map((q) => q.queryKey)
        .filter((key) => Array.isArray(key) && key[0] === queryKeys.routine.all[0])

      for (const key of routineKeys) {
        const prevRoutine = qc.getQueryData<GetRoutineForDateRes>(key)
        if (!prevRoutine) continue

        backups[JSON.stringify(key)] = prevRoutine

        const nextRoutine: GetRoutineForDateRes = {
          ...prevRoutine,
          morning: prevRoutine.morning.map((item) =>
            item.product_check_id === id ? { ...item, is_favorites: !item.is_favorites } : item,
          ),
          evening: prevRoutine.evening.map((item) =>
            item.product_check_id === id ? { ...item, is_favorites: !item.is_favorites } : item,
          ),
        }

        qc.setQueryData(key, nextRoutine)
      }

      return { backups }
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx?.backups) return

      for (const [key, data] of Object.entries(ctx.backups)) {
        qc.setQueryData(JSON.parse(key), data)
      }
    },

    onSuccess: (_data, variables) => {
      analytics.capture(analyticsEvents.productCollectionChanged, {
        action: variables.action,
        collection: 'favorites',
        source: variables.source,
      })
    },

    onSettled: async (_data, _error, variables) => {
      await qc.invalidateQueries({ queryKey: queryKeys.productCheck.byId(variables.id) })
      await qc.invalidateQueries({ queryKey: queryKeys.routine.all })
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return mutation
}
