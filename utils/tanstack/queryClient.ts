// utils/tanstack/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const ONE_MINUTE = 1000 * 60
export const ONE_HOUR = ONE_MINUTE * 60
export const ONE_DAY = ONE_HOUR * 24

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,

      /**
       * Refetch data after 4 hours as a default
       */
      staleTime: ONE_HOUR * 4,

      retry(failureCount: number, error: Error) {
        if (failureCount > 2) return false

        if (error.message.includes('Network Error') || error.message.includes('Timeout'))
          return false

        return true
      },
    },
    mutations: {
      retry: 0,
    },
  },
})
