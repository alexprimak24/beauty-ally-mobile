/// <reference types="jest" />

import {
  buildRoutineEntryPayloads,
  createRoutineSchedule,
  isRoutineScheduleInvalid,
} from '../schedule'

describe('routine schedule model', () => {
  it('maps existing routine configuration into editable state', () => {
    expect(
      createRoutineSchedule({
        morning: {
          frequency_type: 'selected_weekdays',
          routine_entry_id: 'morning-entry',
          weekdays_mask: 5,
        },
        evening: null,
      }),
    ).toEqual({
      morning: { frequency: 'selected_weekdays', isSelected: true, weekdaysMask: 5 },
      evening: { frequency: 'daily', isSelected: false, weekdaysMask: 0 },
    })
  })

  it('defaults nullable weekday masks for both configured periods', () => {
    expect(
      createRoutineSchedule({
        morning: {
          frequency_type: 'selected_weekdays',
          routine_entry_id: 'morning-entry',
          weekdays_mask: null,
        },
        evening: {
          frequency_type: 'selected_weekdays',
          routine_entry_id: 'evening-entry',
          weekdays_mask: null,
        },
      }),
    ).toEqual({
      morning: { frequency: 'selected_weekdays', isSelected: true, weekdaysMask: 0 },
      evening: { frequency: 'selected_weekdays', isSelected: true, weekdaysMask: 0 },
    })
  })

  it('requires at least one weekday for selected-weekday schedules', () => {
    const schedule = createRoutineSchedule()
    schedule.evening = {
      frequency: 'selected_weekdays',
      isSelected: true,
      weekdaysMask: 0,
    }

    expect(isRoutineScheduleInvalid(schedule)).toBe(true)
    schedule.evening.weekdaysMask = 16
    expect(isRoutineScheduleInvalid(schedule)).toBe(false)
  })

  it('builds routine payloads only for selected periods', () => {
    expect(buildRoutineEntryPayloads('product-id', createRoutineSchedule())).toEqual([])

    const schedule = createRoutineSchedule()
    schedule.morning = { frequency: 'daily', isSelected: true, weekdaysMask: 63 }
    schedule.evening = {
      frequency: 'selected_weekdays',
      isSelected: true,
      weekdaysMask: 42,
    }

    expect(buildRoutineEntryPayloads('product-id', schedule)).toEqual([
      {
        frequencyType: 'daily',
        productCheckID: 'product-id',
        routineType: 'morning',
        weekdaysMask: null,
      },
      {
        frequencyType: 'selected_weekdays',
        productCheckID: 'product-id',
        routineType: 'evening',
        weekdaysMask: 42,
      },
    ])
  })
})
