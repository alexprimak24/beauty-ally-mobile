import { RAW_PRODUCT_CHECKS_KEYS } from '@/hooks/useInfiniteProductChecksBase'
import { deleteProductCheck } from '@/services/manipulateProductChecks'
import type { ProductChecksResponse } from '@/services/productChecks'
import { useAuth } from '@clerk/expo'
import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useErrorToast } from './useErrorToast'

export function useDeleteMutation() {
  const { getToken, userId } = useAuth()
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteProductCheck(getToken, id),

    onMutate: async ({ id }) => {
      // Calcel all
      await Promise.all(
        Object.values(RAW_PRODUCT_CHECKS_KEYS).map((root) =>
          qc.cancelQueries({ queryKey: [root, { userId }] }),
        ),
      )

      // Collect all relevant query keys (product/favorites/skincare)
      const keys = qc
        .getQueryCache()
        .findAll()
        .map((q) => q.queryKey)
        .filter(
          (key) => Array.isArray(key) && Object.values(RAW_PRODUCT_CHECKS_KEYS).includes(key[0]),
        )

      const backups: Record<string, InfiniteData<ProductChecksResponse>> = {}

      for (const key of keys) {
        const prev = qc.getQueryData<InfiniteData<ProductChecksResponse>>(key)
        if (!prev) continue

        backups[JSON.stringify(key)] = prev

        const next: InfiniteData<ProductChecksResponse> = {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            entries: page.entries.filter((e) => e.id !== id),
            totalItems: Math.max(0, (page.totalItems ?? 0) - 1),
          })),
        }

        qc.setQueryData(key, next)
      }

      return { backups }
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx?.backups) return
      for (const [key, data] of Object.entries(ctx.backups)) {
        qc.setQueryData(JSON.parse(key), data)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [RAW_PRODUCT_CHECKS_KEYS.all] })
    },

    // onSettled: async () => {
    //   await Promise.all([
    //     qc.invalidateQueries({ queryKey: [RAW_PRODUCT_CHECKS_KEYS.all] }),
    //     qc.invalidateQueries({ queryKey: [RAW_PRODUCT_CHECKS_KEYS.favorites] }),
    //     qc.invalidateQueries({ queryKey: [RAW_PRODUCT_CHECKS_KEYS.skincare] }),
    //   ])
    // },
  })

  useErrorToast(mutation.error, mutation.isError)

  return mutation
}
