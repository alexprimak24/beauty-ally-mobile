import { checkFreeRemaining } from '@/services/entitlements'
import { ONE_HOUR, ONE_MINUTE } from '@/utils/tanstack/queryClient'
import { useAuth } from '@clerk/expo'
import { useQuery } from '@tanstack/react-query'

// RC is source of truth so we don't need it

// export function useCheckPro() {
//   const { getToken, userId } = useAuth()

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ['checkPro', userId],
//     queryFn: async () => {
//       const res = await checkPro(getToken)

//       return res
//     },
//     staleTime: ONE_HOUR,
//     gcTime: ONE_HOUR * 24,
//     enabled: !!userId,
//     retry: 3,
//   })

//   return { data, isLoading, isError, refetch }
// }

export function useCheckFree() {
  const { getToken, userId } = useAuth()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['checkFree', userId],
    queryFn: async () => {
      const res = await checkFreeRemaining(getToken) // throws on HTTP error

      return res
    },
    staleTime: ONE_MINUTE * 20,
    gcTime: ONE_HOUR * 12,
    enabled: !!userId,
    retry: 3,
  })

  return { data, isLoading, isError, refetch }
}
