import { getRawUserProfile, getUserProfile } from '@/services/userOperations'
import { ONE_HOUR } from '@/utils/tanstack/queryClient'
import { useAuth } from '@clerk/expo'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export const USER_KEYS = {
  profile: (userId?: string | null) => ['userProfile', userId],
  raw: (userId?: string | null) => ['rawProfile', userId],
}

export function useUser() {
  const { isLoaded, isSignedIn, getToken, userId } = useAuth()

  return useQuery({
    queryKey: USER_KEYS.profile(userId),
    queryFn: () => getUserProfile(getToken),
    staleTime: ONE_HOUR,
    enabled: isLoaded && isSignedIn && !!userId,
  })
}

export function useRawUser() {
  const { isLoaded, isSignedIn, getToken, userId } = useAuth()

  return useQuery({
    queryKey: USER_KEYS.raw(userId),
    queryFn: () => getRawUserProfile(getToken),
    staleTime: ONE_HOUR,
    enabled: isLoaded && isSignedIn && !!userId,
  })
}

/**
 * Same for raw.
 */
export function useRawUserProfile() {
  const qc = useQueryClient()
  const { getToken, userId } = useAuth()

  const getRawUser = useCallback(async () => {
    if (!userId) throw new Error('No userId')

    return qc.fetchQuery({
      queryKey: USER_KEYS.raw(userId),
      queryFn: () => getRawUserProfile(getToken),
      staleTime: ONE_HOUR,
    })
  }, [getToken, qc, userId])

  return { getRawUser }
}
