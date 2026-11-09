import type { NotificationItem } from '@/services/alerts'
import type { Href } from 'expo-router'

export function getNotificationTheme(type: NotificationItem['type']) {
  switch (type) {
    case 'warning':
      return { borderColor: '#FEE2E2', unreadColor: '#fdebf6' }
    case 'update':
      return { borderColor: '#DBEAFE', unreadColor: '#def2ff' }
    default:
      return { borderColor: '#E5E7EB', unreadColor: '#d6f5d6' }
  }
}

export type NotificationDestination =
  { kind: 'internal'; href: Href } | { kind: 'external'; url: string } | { kind: 'none' }

export function resolveNotificationDestination(
  linkUrl: string | undefined,
): NotificationDestination {
  const normalizedUrl = linkUrl?.trim()
  if (!normalizedUrl) return { kind: 'none' }
  if (normalizedUrl.startsWith('/')) {
    return { kind: 'internal', href: normalizedUrl as Href }
  }
  return { kind: 'external', url: normalizedUrl }
}
