import { useErrorToast } from '@/hooks/useErrorToast'
import type { ApiError } from '@/services/api/errors'
import type {
  GetRoutineCalendarProps,
  GetRoutineCalendarRes,
  GetRoutineForDateRes,
} from '@/services/routine'
import { getRoutineCalendar, getRoutineForDate } from '@/services/routine'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { useAuth } from '@clerk/expo'
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export function useGetRoutineForDate(date: string): {
  routine: GetRoutineForDateRes | undefined
  isLoadingRoutine: boolean
  isFetchingRoutine: boolean
  isErrorRoutine: boolean
  refetchRoutine: UseQueryResult<GetRoutineForDateRes, ApiError | Error>['refetch']
} {
  const { getToken } = useAuth()
  const query = useQuery<GetRoutineForDateRes, ApiError | Error>({
    queryKey: queryKeys.routine.byDate(date),
    queryFn: () => getRoutineForDate(getToken, date),
    enabled: Boolean(date),
  })

  useErrorToast(query.error, query.isError)

  return {
    routine: query.data,
    isLoadingRoutine: query.isLoading,
    isFetchingRoutine: query.isFetching,
    isErrorRoutine: query.isError,
    refetchRoutine: query.refetch,
  }
}

export function useGetRoutineCalendar(params: GetRoutineCalendarProps): {
  routineCalendar: GetRoutineCalendarRes | undefined
  isLoadingRoutineCalendar: boolean
  isFetchingRoutineCalendar: boolean
  isErrorRoutineCalendar: boolean
  refetchRoutineCalendar: UseQueryResult<GetRoutineCalendarRes, ApiError | Error>['refetch']
} {
  const { getToken } = useAuth()
  const { from, to, anchorDate } = params
  const query = useQuery<GetRoutineCalendarRes, ApiError | Error>({
    queryKey: queryKeys.routineCalendar.range(from, to, anchorDate),
    queryFn: () => getRoutineCalendar(getToken, params),
    enabled: Boolean(from && to && anchorDate),
  })

  useErrorToast(query.error, query.isError)

  return {
    routineCalendar: query.data,
    isLoadingRoutineCalendar: query.isLoading,
    isFetchingRoutineCalendar: query.isFetching,
    isErrorRoutineCalendar: query.isError,
    refetchRoutineCalendar: query.refetch,
  }
}
