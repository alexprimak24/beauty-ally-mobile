export const notificationQueryKeys = {
  all: ['alerts'] as const,
  list: (userId: string | null | undefined) => ['alerts', userId] as const,
  unread: (userId: string | null | undefined) => ['alertsUnreadCount', userId] as const,
}
