import { getConsentByType } from '@/services/userOperations'
import { ONE_DAY } from '@/utils/tanstack/queryClient'
import { useAuth } from '@clerk/expo'
import { useQuery } from '@tanstack/react-query'
import { useErrorToast } from './useErrorToast'

// NOT USED ANYWHERE SO FAR
// export function useConsentStatus() {
//   const { getToken } = useAuth()

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ['consentStatus'],
//     queryFn: async () => {
//       const res = await getConsentsStatus(getToken)

//       return res
//     },
//     staleTime: 1000 * 60 * 60 * 24,
//   })

//   return { data, isLoading, isError, refetch }
// }

export function useHealthConsent() {
  const { getToken, userId } = useAuth()

  const query = useQuery({
    queryKey: ['healthConsent', userId],
    queryFn: async () => {
      const res = await getConsentByType('health_data', getToken)

      return res
    },
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
    refetchOnReconnect: false,
    enabled: !!userId,
  })

  useErrorToast(query.error, query.isError)

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
