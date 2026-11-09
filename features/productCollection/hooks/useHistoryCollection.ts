import { useInfiniteProductChecks } from '@/hooks/useInfiniteProductChecksBase'
import { useCallback, useState } from 'react'

export function useHistoryCollection() {
  const [search, setSearch] = useState('')
  const [matchSummary, setMatchSummary] = useState('')
  const query = useInfiniteProductChecks({ search, matchSummary })

  return {
    ...query,
    matchSummary,
    onMatchSummaryChange: useCallback((value: string) => setMatchSummary(value), []),
    onSearchChange: useCallback((value: string) => setSearch(value), []),
    search,
  }
}
