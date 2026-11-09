import type {
  GetRoutineForDateRes,
  RoutineCalendarDay,
  RoutineItem,
  RoutineType,
} from '@/services/routine'

export function isTodayDate(date: string) {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')

  return date === `${yyyy}-${mm}-${dd}`
}

export function recomputeRoutineSummary(data: GetRoutineForDateRes): GetRoutineForDateRes {
  const morningDone = data.morning.filter((item) => item.status === 'done').length
  const eveningDone = data.evening.filter((item) => item.status === 'done').length
  const morningCompleted = data.morning.length > 0 && morningDone === data.morning.length
  const eveningCompleted = data.evening.length > 0 && eveningDone === data.evening.length

  let dayCompleted = false

  if (data.morning.length > 0 && data.evening.length > 0) {
    dayCompleted = morningCompleted && eveningCompleted
  } else if (data.morning.length > 0) {
    dayCompleted = morningCompleted
  } else if (data.evening.length > 0) {
    dayCompleted = eveningCompleted
  }

  return {
    ...data,
    summary: {
      morning_completed: morningCompleted,
      evening_completed: eveningCompleted,
      day_completed: dayCompleted,
    },
  }
}

export function toggleRoutineItem(
  data: GetRoutineForDateRes,
  routineEntryID: string,
): GetRoutineForDateRes {
  const toggleItem = (item: RoutineItem): RoutineItem =>
    item.routine_entry_id === routineEntryID
      ? { ...item, status: item.status === 'done' ? 'pending' : 'done' }
      : item

  return recomputeRoutineSummary({
    ...data,
    morning: data.morning.map(toggleItem),
    evening: data.evening.map(toggleItem),
  })
}

export function removeRoutineItem(
  data: GetRoutineForDateRes,
  routineEntryID: string,
): GetRoutineForDateRes {
  return recomputeRoutineSummary({
    ...data,
    morning: data.morning
      .filter((item) => item.routine_entry_id !== routineEntryID)
      .map((item, index) => ({ ...item, position: index })),
    evening: data.evening
      .filter((item) => item.routine_entry_id !== routineEntryID)
      .map((item, index) => ({ ...item, position: index })),
  })
}

export function completeRoutineGroupInState(
  data: GetRoutineForDateRes,
  routineType: RoutineType,
): GetRoutineForDateRes {
  return recomputeRoutineSummary({
    ...data,
    morning:
      routineType === 'morning'
        ? data.morning.map((item) => ({ ...item, status: 'done' as const }))
        : data.morning,
    evening:
      routineType === 'evening'
        ? data.evening.map((item) => ({ ...item, status: 'done' as const }))
        : data.evening,
  })
}

export function completeRoutineDayInState(data: GetRoutineForDateRes): GetRoutineForDateRes {
  return recomputeRoutineSummary({
    ...data,
    morning: data.morning.map((item) => ({ ...item, status: 'done' as const })),
    evening: data.evening.map((item) => ({ ...item, status: 'done' as const })),
  })
}

export function calendarDayFromRoutine(
  day: RoutineCalendarDay,
  routine: GetRoutineForDateRes,
): RoutineCalendarDay {
  return {
    ...day,
    any_completed:
      routine.morning.some((item) => item.status === 'done') ||
      routine.evening.some((item) => item.status === 'done'),
    morning_completed: routine.summary.morning_completed,
    evening_completed: routine.summary.evening_completed,
    day_completed: routine.summary.day_completed,
  }
}

export function completedCalendarDay(day: RoutineCalendarDay): RoutineCalendarDay {
  return {
    ...day,
    any_completed: true,
    morning_completed: true,
    evening_completed: true,
    day_completed: true,
  }
}
