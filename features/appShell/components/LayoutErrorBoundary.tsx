import type { ErrorBoundaryProps } from 'expo-router'

import { LayoutGateState } from './LayoutGateState'

export function LayoutErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <LayoutGateState onRetry={retry} variant="error" />
}
