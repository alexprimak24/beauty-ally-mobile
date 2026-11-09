import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'

const optionalStringSchema = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? undefined)

const notificationItemSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  subtitle: optionalStringSchema,
  type: z.enum(['info', 'update', 'warning']),
  linkUrl: optionalStringSchema,
  activeFrom: z.string(),
  activeTo: optionalStringSchema,
  createdAt: z.string(),
  read: z.boolean(),
})

const legacyMarkedNotificationSchema = z
  .object({
    ID: z.string().min(1),
    Title: z.string(),
    Subtitle: optionalStringSchema,
    Type: z.enum(['info', 'update', 'warning']),
    LinkUrl: optionalStringSchema,
    ActiveFrom: z.string(),
    ActiveTo: optionalStringSchema,
    CreatedAt: z.string(),
    Read: z.boolean(),
  })
  .transform((alert) => ({
    id: alert.ID,
    title: alert.Title,
    subtitle: alert.Subtitle,
    type: alert.Type,
    linkUrl: alert.LinkUrl,
    activeFrom: alert.ActiveFrom,
    activeTo: alert.ActiveTo,
    createdAt: alert.CreatedAt,
    read: alert.Read,
  }))

const markedNotificationSchema = z.union([notificationItemSchema, legacyMarkedNotificationSchema])

const notificationListSchema = z.array(notificationItemSchema)
const unreadSchema = z.object({ unread: z.number().int().nonnegative() })

export type NotificationItem = z.infer<typeof notificationItemSchema>
export type Unread = z.infer<typeof unreadSchema>

export function alertsCount(getToken: GetToken): Promise<Unread> {
  return apiRequest(getToken, '/v1/alerts/unread-count', {
    method: 'GET',
    schema: unreadSchema,
    timeoutMs: 6000,
  })
}

export function listAlerts(getToken: GetToken): Promise<NotificationItem[]> {
  return apiRequest(getToken, '/v1/alerts', {
    method: 'GET',
    schema: notificationListSchema,
  })
}

export function markAsRead(id: string, getToken: GetToken): Promise<NotificationItem> {
  return apiRequest(getToken, `/v1/alerts/${encodeURIComponent(id)}/read`, {
    method: 'PUT',
    // Accept both the current exported Go DTO fields and the intended camelCase contract.
    schema: markedNotificationSchema,
    timeoutMs: 12000,
  })
}
