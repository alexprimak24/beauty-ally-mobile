import { useAuth } from '@clerk/expo'
import { useQuery } from '@tanstack/react-query'

import { useErrorToast } from '@/hooks/useErrorToast'
import { listAlerts } from '@/services/alerts'
import { ONE_HOUR, ONE_MINUTE } from '@/utils/tanstack/queryClient'
import { notificationQueryKeys } from '../queryKeys'

export function useNotifications() {
  const { getToken, userId } = useAuth()
  const query = useQuery({
    queryKey: notificationQueryKeys.list(userId),
    queryFn: () => listAlerts(getToken),
    enabled: !!userId,
    staleTime: ONE_MINUTE * 5,
    gcTime: ONE_HOUR * 6,
    refetchOnWindowFocus: true,
  })

  useErrorToast(query.error, query.isError)
  return query
}
