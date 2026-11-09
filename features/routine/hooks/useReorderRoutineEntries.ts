import { useErrorToast } from '@/hooks/useErrorToast'
import type { ApiError } from '@/services/api/errors'
import type { MutationSuccessRes, ReorderRoutineEntriesProps } from '@/services/routine'
import { reorderRoutineEntries } from '@/services/routine'
import { queryKeys } from '@/utils/tanstack/queryKeys'
import { useAuth } from '@clerk/expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useReorderRoutineEntries() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation<MutationSuccessRes, ApiError | Error, ReorderRoutineEntriesProps>({
    mutationFn: async (payload) => {
      if (!isLoaded || !isSignedIn) throw new Error('errors.unauthorized')
      return reorderRoutineEntries(getToken, payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.routine.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.routineCalendar.all })
    },
  })

  useErrorToast(mutation.error, mutation.isError)

  return {
    reorderRoutineEntries: mutation.mutate,
    reorderRoutineEntriesAsync: mutation.mutateAsync,
    isReorderingRoutineEntries: mutation.isPending,
  }
}
