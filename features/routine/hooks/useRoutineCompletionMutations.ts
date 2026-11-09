import { useErrorToast } from '@/hooks/useErrorToast'
import type { ApiError } from '@/services/api/errors'
import type {
  CompleteRoutineDayProps,
  CompleteRoutineGroupProps,
  GetRoutineForDateRes,
  MutationSuccessRes,
  ToggleRoutineEntryDoneProps,
} from '@/services/routine'
import {
  completeRoutineDay,
  completeRoutineGroup,
  toggleRoutineEntryDone,
} from '@/services/routine'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { useAuth } from '@clerk/expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { RoutineMutationContext } from '../cache'
import { updateRoutineCalendarCaches } from '../cache'
import {
  calendarDayFromRoutine,
  completedCalendarDay,
  completeRoutineDayInState,
  completeRoutineGroupInState,
  isTodayDate,
  toggleRoutineItem,
} from '../model'

function restoreRoutine(
  queryClient: ReturnType<typeof useQueryClient>,
  date: string,
  context: RoutineMutationContext | undefined,
) {
  if (context?.previousRoutine) {
    queryClient.setQueryData(queryKeys.routine.byDate(date), context.previousRoutine)
  }
}

async function settleRoutine(queryClient: ReturnType<typeof useQueryClient>, date: string) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.routine.byDate(date) })
  await queryClient.invalidateQueries({ queryKey: queryKeys.routineCalendar.all })
}

export function useToggleRoutineEntryDone() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    MutationSuccessRes,
    ApiError | Error,
    ToggleRoutineEntryDoneProps,
    RoutineMutationContext
  >({
    mutationFn: async (payload) => {
      if (!isLoaded || !isSignedIn) throw new Error('errors.unauthorized')
      return toggleRoutineEntryDone(getToken, payload)
    },
    onMutate: async (variables) => {
      const key = queryKeys.routine.byDate(variables.date)
      await queryClient.cancelQueries({ queryKey: key })
      const previousRoutine = queryClient.getQueryData<GetRoutineForDateRes>(key)

      if (previousRoutine && isTodayDate(variables.date)) {
        const nextRoutine = toggleRoutineItem(previousRoutine, variables.routineEntryID)
        queryClient.setQueryData<GetRoutineForDateRes>(key, nextRoutine)
        updateRoutineCalendarCaches(queryClient, variables.date, (day) =>
          calendarDayFromRoutine(day, nextRoutine),
        )
      }

      return { previousRoutine }
    },
    onError: (_error, variables, context) => restoreRoutine(queryClient, variables.date, context),
    onSettled: (_data, _error, variables) => settleRoutine(queryClient, variables.date),
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    toggleRoutineEntryDone: mutation.mutate,
    toggleRoutineEntryDoneAsync: mutation.mutateAsync,
    isTogglingRoutineEntryDone: mutation.isPending,
  }
}

export function useCompleteRoutineGroup() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    MutationSuccessRes,
    ApiError | Error,
    CompleteRoutineGroupProps,
    RoutineMutationContext
  >({
    mutationFn: async (payload) => {
      if (!isLoaded || !isSignedIn) throw new Error('errors.unauthorized')
      return completeRoutineGroup(getToken, payload)
    },
    onMutate: async (variables) => {
      const key = queryKeys.routine.byDate(variables.date)
      await queryClient.cancelQueries({ queryKey: key })
      const previousRoutine = queryClient.getQueryData<GetRoutineForDateRes>(key)

      if (previousRoutine && isTodayDate(variables.date)) {
        const nextRoutine = completeRoutineGroupInState(previousRoutine, variables.routineType)
        queryClient.setQueryData<GetRoutineForDateRes>(key, nextRoutine)
        updateRoutineCalendarCaches(queryClient, variables.date, (day) =>
          calendarDayFromRoutine(day, nextRoutine),
        )
      }

      return { previousRoutine }
    },
    onError: (_error, variables, context) => restoreRoutine(queryClient, variables.date, context),
    onSettled: (_data, _error, variables) => settleRoutine(queryClient, variables.date),
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    completeRoutineGroup: mutation.mutate,
    completeRoutineGroupAsync: mutation.mutateAsync,
    isCompletingRoutineGroup: mutation.isPending,
  }
}

export function useCompleteRoutineDay() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    MutationSuccessRes,
    ApiError | Error,
    CompleteRoutineDayProps,
    RoutineMutationContext
  >({
    mutationFn: async (payload) => {
      if (!isLoaded || !isSignedIn) throw new Error('errors.unauthorized')
      return completeRoutineDay(getToken, payload)
    },
    onMutate: async (variables) => {
      const key = queryKeys.routine.byDate(variables.date)
      await queryClient.cancelQueries({ queryKey: key })
      const previousRoutine = queryClient.getQueryData<GetRoutineForDateRes>(key)

      if (previousRoutine && isTodayDate(variables.date)) {
        const nextRoutine = completeRoutineDayInState(previousRoutine)
        queryClient.setQueryData<GetRoutineForDateRes>(key, nextRoutine)
        updateRoutineCalendarCaches(queryClient, variables.date, completedCalendarDay)
      }

      return { previousRoutine }
    },
    onError: (_error, variables, context) => restoreRoutine(queryClient, variables.date, context),
    onSettled: (_data, _error, variables) => settleRoutine(queryClient, variables.date),
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    completeRoutineDay: mutation.mutate,
    completeRoutineDayAsync: mutation.mutateAsync,
    isCompletingRoutineDay: mutation.isPending,
  }
}
