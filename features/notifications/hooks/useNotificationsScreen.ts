import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'

import { useAnalytics } from '@/hooks/useAnalytics'
import { useOpenLink } from '@/hooks/useOpenLink'
import type { NotificationItem } from '@/services/alerts'
import { analyticsEvents } from '@/utils/analytics'
import { resolveNotificationDestination } from '../model'
import { useMarkNotificationAsRead } from './useMarkNotificationAsRead'
import { useNotifications } from './useNotifications'

export function useNotificationsScreen() {
  const router = useRouter()
  const analytics = useAnalytics()
  const { openLink } = useOpenLink()
  const { data = [], isLoading, refetch } = useNotifications()
  const markAsRead = useMarkNotificationAsRead()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }, [refetch])

  const openNotification = useCallback(
    (notification: NotificationItem) => {
      const destination = resolveNotificationDestination(notification.linkUrl)
      analytics.capture(analyticsEvents.notificationOpened, {
        destination: destination.kind,
        notification_type: notification.type,
        was_unread: !notification.read,
      })

      if (!notification.read) markAsRead.mutate(notification.id)

      if (destination.kind === 'internal') router.push(destination.href)
      if (destination.kind === 'external') void openLink(destination.url)
    },
    [analytics, markAsRead, openLink, router],
  )

  return {
    isLoading,
    markingNotificationId: markAsRead.isPending ? markAsRead.variables : undefined,
    notifications: data,
    onRefresh,
    openNotification,
    refreshing,
  }
}
