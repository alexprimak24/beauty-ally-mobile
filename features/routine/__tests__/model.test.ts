/// <reference types="jest" />

import type { GetRoutineForDateRes, RoutineItem } from '@/services/routine'

import {
  calendarDayFromRoutine,
  completedCalendarDay,
  completeRoutineDayInState,
  completeRoutineGroupInState,
  isTodayDate,
  recomputeRoutineSummary,
  removeRoutineItem,
  toggleRoutineItem,
} from '../model'

function item(
  id: string,
  position: number,
  status: RoutineItem['status'] = 'pending',
): RoutineItem {
  return {
    routine_entry_id: id,
    product_check_id: `product-${id}`,
    product_name: `Product ${id}`,
    is_favorites: false,
    position,
    frequency_type: 'daily',
    status,
  }
}

function routine(overrides: Partial<GetRoutineForDateRes> = {}): GetRoutineForDateRes {
  return {
    date: '2026-11-07',
    streak: 2,
    max_streak: 5,
    summary: {
      morning_completed: false,
      evening_completed: false,
      day_completed: false,
    },
    morning: [item('morning-1', 0), item('morning-2', 1)],
    evening: [item('evening-1', 0)],
    ...overrides,
  }
}

describe('routine model', () => {
  it('recomputes group and day completion for populated and empty routines', () => {
    const completedMorning = routine({
      morning: [item('morning-1', 0, 'done')],
      evening: [],
    })

    expect(recomputeRoutineSummary(completedMorning).summary).toEqual({
      morning_completed: true,
      evening_completed: false,
      day_completed: true,
    })
    expect(
      recomputeRoutineSummary(routine({ morning: [], evening: [] })).summary.day_completed,
    ).toBe(false)
  })

  it('toggles only the requested item and recomputes completion', () => {
    const original = routine({
      morning: [item('morning-1', 0)],
      evening: [],
    })
    const next = toggleRoutineItem(original, 'morning-1')

    expect(next.morning[0].status).toBe('done')
    expect(next.summary.day_completed).toBe(true)
    expect(original.morning[0].status).toBe('pending')
  })

  it('removes an entry, compacts positions, and recomputes completion', () => {
    const next = removeRoutineItem(
      routine({
        morning: [item('first', 0, 'done'), item('second', 1, 'done')],
        evening: [],
      }),
      'first',
    )

    expect(next.morning).toEqual([
      expect.objectContaining({ routine_entry_id: 'second', position: 0 }),
    ])
    expect(next.summary.day_completed).toBe(true)
  })

  it('completes one group or the full routine without changing the other group early', () => {
    const morningOnly = completeRoutineGroupInState(routine(), 'morning')

    expect(morningOnly.morning.every((entry) => entry.status === 'done')).toBe(true)
    expect(morningOnly.evening[0].status).toBe('pending')
    expect(morningOnly.summary.day_completed).toBe(false)

    const fullDay = completeRoutineDayInState(morningOnly)
    expect(fullDay.evening[0].status).toBe('done')
    expect(fullDay.summary.day_completed).toBe(true)
  })

  it('derives calendar completion from the optimistic routine state', () => {
    const complete = completeRoutineDayInState(routine())
    const calendarDay = {
      date: complete.date,
      any_completed: false,
      morning_completed: false,
      evening_completed: false,
      day_completed: false,
    }

    expect(calendarDayFromRoutine(calendarDay, complete)).toEqual({
      ...calendarDay,
      any_completed: true,
      morning_completed: true,
      evening_completed: true,
      day_completed: true,
    })
    expect(completedCalendarDay(calendarDay).day_completed).toBe(true)
  })

  it('compares dates against the local calendar day', () => {
    const now = new Date()
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-')

    expect(isTodayDate(today)).toBe(true)
    expect(isTodayDate('2000-01-01')).toBe(false)
  })
})
