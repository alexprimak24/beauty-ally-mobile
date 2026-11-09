import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

import LoadingOverlay from '@/components/ui/LoadingOverlay'
import type { RevenueCatContextValue } from './types'
import { useRevenueCatController } from './useRevenueCatController'

const RevenueCatContext = createContext<RevenueCatContextValue | null>(null)

export function useRevenueCat(): RevenueCatContextValue {
  const value = useContext(RevenueCatContext)
  if (!value) throw new Error('useRevenueCat must be used within RevenueCatProvider')
  return value
}

export function RevenueCatProvider({ children }: PropsWithChildren) {
  const value = useRevenueCatController()

  if (!value.identity.isReady) return <LoadingOverlay visible />

  return <RevenueCatContext value={value}>{children}</RevenueCatContext>
}
