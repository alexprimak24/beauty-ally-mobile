import type { RoutineSummary } from '@/services/routine'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export const SKINCARE_SHELF_NOTIFICATION_ROUTE = '/(protected)/skincareShelf'

const CHANNEL_ID = 'skincare-shelf-reminders-v2'
const STORAGE_KEY = '@skincare_shelf_reminder'
const SOFT_PROMPT_STORAGE_KEY = '@skincare_shelf_reminder_soft_prompt_seen'
const REMINDER_HOUR = 22
const REMINDER_MINUTE = 0
const NOTIFICATION_KIND = 'skincareShelfReminder'
const NOTIFICATION_SOUND = 'skincare_reminder.wav'

type SkincareReminderType = 'day' | 'evening'

interface StoredReminder {
  date: string
  id: string
  triggerAt: number
  type: SkincareReminderType
}

interface ReminderTexts {
  dayBody: string
  eveningBody: string
  title: string
}

interface SyncSkincareShelfReminderProps {
  date: string
  hasRoutineEntries: boolean
  summary?: RoutineSummary
  texts: ReminderTexts
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

function getReminderType(summary: RoutineSummary): SkincareReminderType | null {
  if (summary.day_completed || (summary.morning_completed && summary.evening_completed)) return null

  if (summary.morning_completed && !summary.evening_completed) return 'evening'

  return 'day'
}

function getReminderDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day, REMINDER_HOUR, REMINDER_MINUTE, 0, 0)
}

async function ensureAndroidChannelAsync() {
  if (Platform.OS !== 'android') return

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Skincare reminders',
    importance: AndroidImportance.DEFAULT,
    sound: NOTIFICATION_SOUND,
  })
}

async function ensureNotificationPermissionAsync() {
  const current = await Notifications.getPermissionsAsync()
  return hasNotificationPermission(current)
}

function hasNotificationPermission(status: Notifications.NotificationPermissionsStatus) {
  const baseStatus = status as Notifications.NotificationPermissionsStatus & {
    granted?: boolean
    status?: string
  }

  if (baseStatus.granted || baseStatus.status === 'granted') return true

  return (
    status.ios?.status === IosAuthorizationStatus.PROVISIONAL ||
    status.ios?.status === IosAuthorizationStatus.EPHEMERAL
  )
}

function canAskForNotificationPermission(status: Notifications.NotificationPermissionsStatus) {
  const baseStatus = status as Notifications.NotificationPermissionsStatus & {
    canAskAgain?: boolean
    status?: string
  }

  if (hasNotificationPermission(status)) return false

  if (baseStatus.status === 'denied') return false

  return (
    status.ios?.status === IosAuthorizationStatus.NOT_DETERMINED ||
    baseStatus.status === 'undetermined' ||
    baseStatus.canAskAgain === true
  )
}

export async function shouldShowSkincareReminderPermissionPromptAsync() {
  const hasSeenSoftPrompt = await AsyncStorage.getItem(SOFT_PROMPT_STORAGE_KEY)
  if (hasSeenSoftPrompt === 'true') return false

  const current = await Notifications.getPermissionsAsync()
  return canAskForNotificationPermission(current)
}

export async function markSkincareReminderPermissionPromptSeenAsync() {
  await AsyncStorage.setItem(SOFT_PROMPT_STORAGE_KEY, 'true')
}

export async function requestSkincareReminderPermissionAsync() {
  await markSkincareReminderPermissionPromptSeenAsync()
  const requested = await Notifications.requestPermissionsAsync()
  return hasNotificationPermission(requested)
}

async function getStoredReminderAsync(): Promise<StoredReminder | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredReminder
  } catch {
    await AsyncStorage.removeItem(STORAGE_KEY)
    return null
  }
}

async function cancelSkincareShelfReminderAsync() {
  const stored = await getStoredReminderAsync()
  if (stored?.id)
    await Notifications.cancelScheduledNotificationAsync(stored.id).catch(() => undefined)

  await AsyncStorage.removeItem(STORAGE_KEY)
}

export async function syncSkincareShelfReminderAsync({
  date,
  hasRoutineEntries,
  summary,
  texts,
}: SyncSkincareShelfReminderProps) {
  if (!summary || !hasRoutineEntries) {
    await cancelSkincareShelfReminderAsync()
    return
  }

  const reminderType = getReminderType(summary)
  const reminderDate = getReminderDate(date)

  if (!reminderType || reminderDate.getTime() <= Date.now()) {
    await cancelSkincareShelfReminderAsync()
    return
  }

  const stored = await getStoredReminderAsync()
  if (
    stored?.date === date &&
    stored.type === reminderType &&
    stored.triggerAt === reminderDate.getTime()
  ) {
    return
  }

  await cancelSkincareShelfReminderAsync()

  const hasPermission = await ensureNotificationPermissionAsync()
  if (!hasPermission) return

  await ensureAndroidChannelAsync()

  const notificationId = await Notifications.scheduleNotificationAsync({
    identifier: `${NOTIFICATION_KIND}-${date}`,
    content: {
      title: texts.title,
      body: reminderType === 'evening' ? texts.eveningBody : texts.dayBody,
      sound: NOTIFICATION_SOUND,
      data: {
        kind: NOTIFICATION_KIND,
        route: SKINCARE_SHELF_NOTIFICATION_ROUTE,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: CHANNEL_ID,
    },
  })

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date,
      id: notificationId,
      triggerAt: reminderDate.getTime(),
      type: reminderType,
    } satisfies StoredReminder),
  )
}

function isSkincareShelfReminderResponse(
  response: Notifications.NotificationResponse | null | undefined,
) {
  return response?.notification.request.content.data?.kind === NOTIFICATION_KIND
}

export function addSkincareShelfReminderResponseListener(onOpen: () => void) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    if (isSkincareShelfReminderResponse(response)) onOpen()
  })
}

export function getLastSkincareShelfReminderResponse() {
  const response = Notifications.getLastNotificationResponse()
  if (!isSkincareShelfReminderResponse(response)) return null

  return response
}

export function clearLastSkincareShelfReminderResponse() {
  Notifications.clearLastNotificationResponse()
}
