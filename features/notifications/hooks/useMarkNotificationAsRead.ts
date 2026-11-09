import { useAuth } from '@clerk/expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useErrorToast } from '@/hooks/useErrorToast'
import { markAsRead } from '@/services/alerts'
import type { NotificationItem, Unread } from '@/services/alerts'
import { notificationQueryKeys } from '../queryKeys'

interface MarkAsReadContext {
  previousNotifications?: NotificationItem[]
  previousUnread?: Unread
}

export function useMarkNotificationAsRead() {
  const { getToken, userId } = useAuth()
  const queryClient = useQueryClient()
  const notificationsKey = notificationQueryKeys.list(userId)
  const unreadKey = notificationQueryKeys.unread(userId)

  const mutation = useMutation<NotificationItem, Error, string, MarkAsReadContext>({
    mutationFn: (id) => markAsRead(id, getToken),
    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationsKey }),
        queryClient.cancelQueries({ queryKey: unreadKey }),
      ])

      const previousNotifications = queryClient.getQueryData<NotificationItem[]>(notificationsKey)
      const previousUnread = queryClient.getQueryData<Unread>(unreadKey)
      const notification = previousNotifications?.find((item) => item.id === id)

      queryClient.setQueryData<NotificationItem[]>(notificationsKey, (current = []) =>
        current.map((item) => (item.id === id ? { ...item, read: true } : item)),
      )
      if (notification && !notification.read && previousUnread) {
        queryClient.setQueryData<Unread>(unreadKey, {
          unread: Math.max(0, previousUnread.unread - 1),
        })
      }

      return { previousNotifications, previousUnread }
    },
    onError: (_error, _id, context) => {
      if (!context) return

      if (context.previousNotifications) {
        queryClient.setQueryData(notificationsKey, context.previousNotifications)
      } else {
        queryClient.removeQueries({ queryKey: notificationsKey, exact: true })
      }
      if (context.previousUnread) {
        queryClient.setQueryData(unreadKey, context.previousUnread)
      }
    },
    onSuccess: (updatedNotification) => {
      queryClient.setQueryData<NotificationItem[]>(notificationsKey, (current = []) =>
        current.map((item) => (item.id === updatedNotification.id ? updatedNotification : item)),
      )
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: notificationsKey }),
        queryClient.invalidateQueries({ queryKey: unreadKey }),
      ])
    },
  })

  useErrorToast(mutation.error, mutation.isError)
  return mutation
}
