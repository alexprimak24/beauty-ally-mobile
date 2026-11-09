import { useAuth } from '@clerk/expo'
import { useQuery } from '@tanstack/react-query'

import { alertsCount } from '@/services/alerts'
import { ONE_HOUR, ONE_MINUTE } from '@/utils/tanstack/queryClient'
import { notificationQueryKeys } from '../queryKeys'

export function useUnreadNotificationsCount() {
  const { getToken, userId } = useAuth()
  return useQuery({
    queryKey: notificationQueryKeys.unread(userId),
    queryFn: () => alertsCount(getToken),
    staleTime: ONE_MINUTE * 10,
    gcTime: ONE_HOUR,
    enabled: !!userId,
  })
}
