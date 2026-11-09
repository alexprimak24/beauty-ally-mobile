import { getProductChecks } from '@/services/productChecks'
import { ONE_HOUR, ONE_MINUTE } from '@/utils/tanstack/queryClient'
import { useAuth } from '@clerk/expo'
import { useInfiniteQuery } from '@tanstack/react-query'

interface Params {
  search?: string
  matchSummary?: string
  favoritesOnly?: boolean
  skincareOnly?: boolean
  excludingSkincare?: boolean
}

export const RAW_PRODUCT_CHECKS_KEYS = {
  all: 'productChecks',
  favorites: 'favoritesChecks',
  skincare: 'skincareChecks',
  excludingSkincare: 'excludingSkincareChecks',
}

function useInfiniteProductChecksBase(keyParams: Params) {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth()
  const {
    search = '',
    matchSummary = '',
    favoritesOnly,
    skincareOnly,
    excludingSkincare,
  } = keyParams

  const rootKey = favoritesOnly
    ? RAW_PRODUCT_CHECKS_KEYS.favorites
    : skincareOnly
      ? RAW_PRODUCT_CHECKS_KEYS.skincare
      : excludingSkincare
        ? RAW_PRODUCT_CHECKS_KEYS.excludingSkincare
        : RAW_PRODUCT_CHECKS_KEYS.all

  return useInfiniteQuery({
    queryKey: [rootKey, { userId, search, matchSummary }],
    queryFn: ({ pageParam = 1 }) =>
      getProductChecks(
        getToken,
        pageParam,
        search,
        matchSummary,
        !!favoritesOnly,
        !!skincareOnly,
        !!excludingSkincare,
      ),

    getNextPageParam: (lastPage) =>
      lastPage && typeof lastPage === 'object' && 'hasNextPage' in lastPage
        ? lastPage.hasNextPage
          ? lastPage.page + 1
          : undefined
        : undefined,

    initialPageParam: 1,
    enabled: isLoaded && isSignedIn && !!userId,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: ONE_MINUTE * 3,
    gcTime: ONE_HOUR * 2,
  })
}

export function useInfiniteProductChecks(params: { matchSummary?: string; search?: string }) {
  return useInfiniteProductChecksBase(params)
}

export function useInfiniteFavorites(params: { search?: string }) {
  return useInfiniteProductChecksBase({ ...params, favoritesOnly: true })
}

export function useInfiniteProductChecksExcludingSkincare(params: { search?: string }) {
  return useInfiniteProductChecksBase({ ...params, excludingSkincare: true })
}
