import { useCallback, useState } from 'react'

import type { FrequencyType, RoutineType } from '@/services/routine'
import {
  createRoutineSchedule,
  isRoutineScheduleInvalid,
  type RoutineSchedule,
  updateRoutineSchedule,
} from '../schedule'

export function useRoutineSchedule(initialSchedule: RoutineSchedule = createRoutineSchedule()) {
  const [schedule, setSchedule] = useState(initialSchedule)

  const resetSchedule = useCallback((nextSchedule: RoutineSchedule) => {
    setSchedule(nextSchedule)
  }, [])

  const togglePeriod = useCallback((routineType: RoutineType) => {
    setSchedule((current) =>
      updateRoutineSchedule(current, routineType, {
        isSelected: !current[routineType].isSelected,
      }),
    )
  }, [])

  const setFrequency = useCallback((routineType: RoutineType, frequency: FrequencyType) => {
    setSchedule((current) => updateRoutineSchedule(current, routineType, { frequency }))
  }, [])

  const toggleWeekday = useCallback((routineType: RoutineType, weekday: number) => {
    setSchedule((current) =>
      updateRoutineSchedule(current, routineType, {
        weekdaysMask: current[routineType].weekdaysMask ^ weekday,
      }),
    )
  }, [])

  return {
    isInvalid: isRoutineScheduleInvalid(schedule),
    resetSchedule,
    schedule,
    setFrequency,
    togglePeriod,
    toggleWeekday,
  }
}
