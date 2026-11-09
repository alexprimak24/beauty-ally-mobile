import type { GetRoutineForDateRes } from '@/services/routine'
import { main } from '@/utils/i18n/keyConstants'
import { syncSkincareShelfReminderAsync } from '@/utils/notifications/skincareShelfReminders'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const REMINDER_TEXT = {
  title: 'mySkincareShelf.notifications.title',
  dayBody: 'mySkincareShelf.notifications.dayBody',
  eveningBody: 'mySkincareShelf.notifications.eveningBody',
} as const

interface UseSkincareShelfReminderSyncProps {
  date: string
  enabled?: boolean
  isLoadingRoutine: boolean
  routine?: GetRoutineForDateRes
}

export function getTodayRoutineDateString() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function useSkincareShelfReminderSync({
  date,
  enabled = true,
  isLoadingRoutine,
  routine,
}: UseSkincareShelfReminderSyncProps) {
  const { t } = useTranslation(main)

  useEffect(() => {
    if (!enabled || isLoadingRoutine) return

    syncSkincareShelfReminderAsync({
      date,
      hasRoutineEntries: (routine?.morning?.length ?? 0) > 0 || (routine?.evening?.length ?? 0) > 0,
      summary: routine?.summary,
      texts: {
        title: t(REMINDER_TEXT.title),
        dayBody: t(REMINDER_TEXT.dayBody),
        eveningBody: t(REMINDER_TEXT.eveningBody),
      },
    }).catch((error) => {
      console.warn('Failed to sync skincare shelf reminder:', error)
    })
  }, [
    date,
    enabled,
    isLoadingRoutine,
    routine?.evening?.length,
    routine?.morning?.length,
    routine?.summary,
    routine?.summary?.day_completed,
    routine?.summary?.evening_completed,
    routine?.summary?.morning_completed,
    t,
  ])
}
