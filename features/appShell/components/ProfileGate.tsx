import { useUser } from '@/hooks/useGetUser'
import { Redirect } from 'expo-router'
import type { PropsWithChildren } from 'react'

import { LayoutGateState } from './LayoutGateState'

export function ProfileGate({ children }: PropsWithChildren) {
  const { data, isError, isLoading, isRefetching, refetch } = useUser()

  if (isError) {
    return (
      <LayoutGateState isRetrying={isRefetching} onRetry={() => void refetch()} variant="error" />
    )
  }

  if (isLoading || !data) return <LayoutGateState variant="loading" />
  if (!data.exists) return <Redirect href="/(auth)/onboarding/welcome" />

  return <>{children}</>
}
