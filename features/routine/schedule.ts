import type { CreateRoutineEntryProps, FrequencyType, RoutineType } from '@/services/routine'
import type { RoutineConfig } from '@/types/scanEntry'

export interface RoutinePeriodSchedule {
  frequency: FrequencyType
  isSelected: boolean
  weekdaysMask: number
}

export interface RoutineSchedule {
  evening: RoutinePeriodSchedule
  morning: RoutinePeriodSchedule
}

function emptyPeriod(isSelected = false): RoutinePeriodSchedule {
  return {
    frequency: 'daily',
    isSelected,
    weekdaysMask: 0,
  }
}

export function createRoutineSchedule(config?: RoutineConfig | null): RoutineSchedule {
  return {
    morning: config?.morning
      ? {
          frequency: config.morning.frequency_type,
          isSelected: true,
          weekdaysMask: config.morning.weekdays_mask ?? 0,
        }
      : emptyPeriod(),
    evening: config?.evening
      ? {
          frequency: config.evening.frequency_type,
          isSelected: true,
          weekdaysMask: config.evening.weekdays_mask ?? 0,
        }
      : emptyPeriod(),
  }
}

export function createNewRoutineSchedule(): RoutineSchedule {
  return {
    morning: emptyPeriod(true),
    evening: emptyPeriod(),
  }
}

function isRoutinePeriodInvalid(period: RoutinePeriodSchedule) {
  return period.isSelected && period.frequency === 'selected_weekdays' && period.weekdaysMask === 0
}

export function isRoutineScheduleInvalid(schedule: RoutineSchedule) {
  return isRoutinePeriodInvalid(schedule.morning) || isRoutinePeriodInvalid(schedule.evening)
}

export function buildRoutineEntryPayloads(
  productCheckID: string,
  schedule: RoutineSchedule,
): CreateRoutineEntryProps[] {
  return (['morning', 'evening'] as const).flatMap((routineType) => {
    const period = schedule[routineType]
    if (!period.isSelected) return []

    return [
      {
        frequencyType: period.frequency,
        productCheckID,
        routineType,
        weekdaysMask: period.frequency === 'daily' ? null : period.weekdaysMask,
      },
    ]
  })
}

export function updateRoutineSchedule(
  schedule: RoutineSchedule,
  routineType: RoutineType,
  update: Partial<RoutinePeriodSchedule>,
): RoutineSchedule {
  return {
    ...schedule,
    [routineType]: { ...schedule[routineType], ...update },
  }
}
