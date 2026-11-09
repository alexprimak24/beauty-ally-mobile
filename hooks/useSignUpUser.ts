import type { UpsertUserResponse } from '@/services/userOperations'
import { upsertUserProfile } from '@/services/userOperations'
import type { UserData } from '@/types/userEntry'
import { useAuth } from '@clerk/expo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useSignUpUser() {
  const { getToken, userId } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation<UpsertUserResponse, Error, Partial<UserData>>({
    mutationFn: (data) => upsertUserProfile(data, getToken),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
        queryClient.invalidateQueries({ queryKey: ['rawProfile', userId] }),
      ])
    },
  })

  return {
    signUpUser: mutation.mutateAsync,
    isSigningUpUser: mutation.isPending,
  }
}
