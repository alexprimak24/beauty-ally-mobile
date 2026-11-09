import type { ProductChecksResponse } from '@/services/productChecks'
import { getProductCheckById } from '@/services/productChecks'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { ONE_MINUTE } from '@/utils/tanstack/queryClient'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { useAuth } from '@clerk/expo'
import type { InfiniteData } from '@tanstack/react-query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useErrorToast } from './useErrorToast'

interface UseProductCheckByIdProps {
  scanId: string
  matchSummary?: string
  search?: string
  enabled?: boolean
  includeRoutineConfig?: boolean
}

export function useProductCheckById({
  scanId,
  matchSummary = '',
  search = '',
  enabled = true,
  includeRoutineConfig = false,
}: UseProductCheckByIdProps) {
  const { getToken, userId } = useAuth()
  const queryClient = useQueryClient()

  const cachedData = queryClient.getQueryData<InfiniteData<ProductChecksResponse>>([
    'productChecks',
    { userId, search, matchSummary },
  ])

  const cachedEntry = cachedData?.pages
    .flatMap((page) => page.entries)
    .find((entry) => entry.id === scanId)

  const query = useQuery<ProductChecksEntry>({
    queryKey: queryKeys.productCheck.detail(scanId, includeRoutineConfig),
    queryFn: () => getProductCheckById(getToken, scanId, includeRoutineConfig),
    initialData: includeRoutineConfig ? undefined : cachedEntry,
    refetchOnMount: true,
    enabled: enabled && !!userId && !!scanId,
    staleTime: 0,
    gcTime: ONE_MINUTE * 30,
  })

  useErrorToast(query.error, query.isError)

  return query
}
