import type { ReorderRoutineEntriesProps, RoutineItem } from '@/services/routine'
import { addDays, addWeeks, format } from 'date-fns'
import type { Locale } from 'date-fns'
import { skincareShelfText, weekdayKeys } from './constants'
import type { CalendarWeekItem, ReorderRoutineEntry, RoutineType, ShelfEntryItem } from './types'

type Translate = (key: string) => string

export function buildCalendarWeeks(
  startDate: Date,
  locale: Locale,
  translate: Translate,
): CalendarWeekItem[] {
  return Array.from({ length: 5 }, (_, weekIndex) => {
    const weekStart = addWeeks(startDate, weekIndex)
    const days = Array.from({ length: 7 }, (__, dayIndex) => {
      const date = addDays(weekStart, dayIndex)

      return {
        id: format(date, 'yyyy-MM-dd'),
        dayStr: translate(skincareShelfText.weekdays.short[weekdayKeys[dayIndex]]),
        dateNum: format(date, 'd', { locale }),
        dayIndex,
      }
    })

    return { id: `week-${weekIndex}`, days }
  })
}

export function toShelfItems(
  items: RoutineItem[],
  routineType: RoutineType,
  translate: Translate,
): ShelfEntryItem[] {
  return items
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({
      id: item.routine_entry_id,
      routineEntryID: item.routine_entry_id,
      productCheckID: item.product_check_id,
      productName: item.product_name,
      frontImage: item.front_image ?? '',
      purchaseLink: item.purchase_link ?? '',
      routineType,
      frequencyDisplay:
        item.frequency_type === 'daily'
          ? translate(skincareShelfText.frequency.daily)
          : translate(skincareShelfText.frequency.specificDays),
      appliedToday: item.status === 'done',
      isRunningLow: false,
      isFavorites: item.is_favorites,
      stepNumber: index + 1,
    }))
}

export function getStreakPalette(streak: number) {
  if (streak >= 365) return { color: '#8B5CF6', backgroundColor: '#EDE9FE' }
  if (streak >= 90) return { color: '#6366F1', backgroundColor: '#E0E7FF' }
  if (streak >= 30) return { color: '#0EA5E9', backgroundColor: '#E0F2FE' }
  if (streak >= 14) return { color: '#F59E0B', backgroundColor: '#FEF3C7' }
  if (streak > 7) return { color: '#F97316', backgroundColor: '#FFEDD5' }
  if (streak > 0) return { color: '#F43F5E', backgroundColor: '#FFE4E6' }

  return { color: '#8E8E93', backgroundColor: '#E5E5EA' }
}

export function toReorderRoutineEntries(
  items: RoutineItem[],
  routineType: RoutineType,
): ReorderRoutineEntry[] {
  return items
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      id: item.routine_entry_id,
      frontImage: item.front_image ?? '',
      productCheckID: item.product_check_id,
      productName: item.product_name,
      routineEntryID: item.routine_entry_id,
      routineType,
    }))
}

export function buildReorderRoutinePayload(
  morningEntries: ReorderRoutineEntry[],
  eveningEntries: ReorderRoutineEntry[],
): ReorderRoutineEntriesProps {
  const toPayload = (items: ReorderRoutineEntry[], routineType: RoutineType) =>
    items.map((item, position) => ({
      position,
      routineEntryID: item.routineEntryID,
      routineType,
    }))

  return {
    items: [...toPayload(morningEntries, 'morning'), ...toPayload(eveningEntries, 'evening')],
  }
}

export function getRoutineOrderSignature(entries: ReorderRoutineEntry[]) {
  return entries.map((entry) => entry.id).join(',')
}

export function hasRoutineOrderChanged(
  morningEntries: ReorderRoutineEntry[],
  eveningEntries: ReorderRoutineEntry[],
  initialMorningSignature: string,
  initialEveningSignature: string,
) {
  return (
    getRoutineOrderSignature(morningEntries) !== initialMorningSignature ||
    getRoutineOrderSignature(eveningEntries) !== initialEveningSignature
  )
}

export function resolveInitialReorderSection(
  requestedSection: RoutineType,
  morningEntries: ReorderRoutineEntry[],
  eveningEntries: ReorderRoutineEntry[],
): RoutineType {
  if (requestedSection === 'morning' && morningEntries.length > 0) return 'morning'
  if (requestedSection === 'evening' && eveningEntries.length > 0) return 'evening'
  if (morningEntries.length === 0 && eveningEntries.length > 0) return 'evening'

  return 'morning'
}
