import { RAW_PRODUCT_CHECKS_KEYS } from '@/hooks/useInfiniteProductChecksBase'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useErrorToast } from '@/hooks/useErrorToast'
import type { ApiError } from '@/services/api/errors'
import type {
  CreateRoutineEntryProps,
  GetRoutineForDateRes,
  MutationSuccessRes,
} from '@/services/routine'
import {
  createRoutineEntry,
  deleteRoutineEntriesByProductCheckID,
  deleteRoutineEntry,
} from '@/services/routine'
import { analyticsEvents } from '@/utils/analytics'
import type { ProductEngagementSource } from '@/utils/analytics'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { useAuth } from '@clerk/expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  type CreateRoutineEntryMutationContext,
  optimisticallyMarkProductInSkincare,
  optimisticallyRemoveProductFromSkincare,
  type RemoveProductFromSkincareMutationContext,
  restoreQueryBackups,
  type RoutineMutationContext,
  updateRoutineCalendarCaches,
} from '../cache'
import { calendarDayFromRoutine, removeRoutineItem } from '../model'

export function useCreateRoutineEntry() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    MutationSuccessRes,
    ApiError | Error,
    CreateRoutineEntryProps,
    CreateRoutineEntryMutationContext
  >({
    mutationFn: async (routineEntry) => {
      if (!isLoaded || !isSignedIn) throw new Error('errors.unauthorized')
      return createRoutineEntry(getToken, routineEntry)
    },
    onMutate: (routineEntry) =>
      optimisticallyMarkProductInSkincare(queryClient, routineEntry.productCheckID),
    onError: (_error, _variables, context) =>
      restoreQueryBackups(queryClient, context?.productCheckBackups),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.routine.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.routineCalendar.all })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.productCheck.byId(variables.productCheckID),
      })
      await Promise.all(
        Object.values(RAW_PRODUCT_CHECKS_KEYS).map((root) =>
          queryClient.invalidateQueries({ queryKey: [root] }),
        ),
      )
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    createRoutineEntry: mutation.mutate,
    createRoutineEntryAsync: mutation.mutateAsync,
    isCreatingRoutineEntry: mutation.isPending,
  }
}

export function useDeleteRoutineEntry() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    MutationSuccessRes,
    ApiError | Error,
    { id: string; date: string; productCheckID: string },
    RoutineMutationContext
  >({
    mutationFn: async ({ id }) => {
      if (!isLoaded || !isSignedIn) throw new Error('errors.unauthorized')
      return deleteRoutineEntry(getToken, id)
    },
    onMutate: async (variables) => {
      const key = queryKeys.routine.byDate(variables.date)
      await queryClient.cancelQueries({ queryKey: key })
      const previousRoutine = queryClient.getQueryData<GetRoutineForDateRes>(key)

      if (previousRoutine) {
        const nextRoutine = removeRoutineItem(previousRoutine, variables.id)
        queryClient.setQueryData<GetRoutineForDateRes>(key, nextRoutine)
        updateRoutineCalendarCaches(queryClient, variables.date, (day) =>
          calendarDayFromRoutine(day, nextRoutine),
        )
      }

      return { previousRoutine }
    },
    onError: (_error, variables, context) => {
      if (context?.previousRoutine) {
        queryClient.setQueryData(queryKeys.routine.byDate(variables.date), context.previousRoutine)
      }
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.routine.byDate(variables.date) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.routineCalendar.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.productCheck.byId(variables.productCheckID),
        }),
      ])
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    deleteRoutineEntry: mutation.mutate,
    deleteRoutineEntryAsync: mutation.mutateAsync,
    isDeletingRoutineEntry: mutation.isPending,
  }
}

export function useRemoveProductFromSkincareMutation() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const analytics = useAnalytics()
  const mutation = useMutation<
    MutationSuccessRes,
    ApiError | Error,
    { id: string; source: ProductEngagementSource },
    RemoveProductFromSkincareMutationContext
  >({
    mutationFn: async ({ id }) => {
      if (!isLoaded || !isSignedIn) throw new Error('errors.unauthorized')
      return deleteRoutineEntriesByProductCheckID(getToken, id)
    },
    onMutate: ({ id }) => optimisticallyRemoveProductFromSkincare(queryClient, id),
    onError: (_error, _variables, context) => restoreQueryBackups(queryClient, context?.backups),
    onSuccess: (_data, variables) => {
      analytics.capture(analyticsEvents.productCollectionChanged, {
        action: 'removed',
        collection: 'skincare',
        source: variables.source,
      })
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.routine.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.routineCalendar.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.productCheck.byId(variables.id) })
      await Promise.all(
        Object.values(RAW_PRODUCT_CHECKS_KEYS).map((root) =>
          queryClient.invalidateQueries({ queryKey: [root] }),
        ),
      )
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    removeProductFromSkincare: mutation.mutate,
    removeProductFromSkincareAsync: mutation.mutateAsync,
    isRemovingProductFromSkincare: mutation.isPending,
  }
}
