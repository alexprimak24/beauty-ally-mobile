import { useAnalytics } from '@/hooks/useAnalytics'
import { scan_qk, useScanStatus } from '@/hooks/useScanStatus'
import { getProductCheckById } from '@/services/productChecks'
import { analyticsEvents } from '@/utils/analytics'
import { ERROR_KEYS_OBJ, showErrorToast, showRequestErrorToast } from '@/utils/showErrorToast'
import { useAuth } from '@clerk/expo'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import type { RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { getScanPollingOutcome } from '../model'
import type { ScanAttemptContext } from '../types'

interface UseScanPollingOptions {
  attemptRef: RefObject<ScanAttemptContext>
  backUri: string | null
  frontUri: string | null
  onFailed: () => void
  resetAttempt: () => void
}

export function useScanPolling({
  attemptRef,
  backUri,
  frontUri,
  onFailed,
  resetAttempt,
}: UseScanPollingOptions) {
  const { getToken, userId } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const analytics = useAnalytics()
  const [scanId, setScanId] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)
  const { data: scanStatus, isError } = useScanStatus(scanId, enabled)

  const startPolling = useCallback(
    (nextScanId: string, resetCachedStatus = false) => {
      if (resetCachedStatus) {
        queryClient.removeQueries({ queryKey: [scan_qk, userId, nextScanId] })
      }
      setScanId(nextScanId)
      setEnabled(true)
    },
    [queryClient, userId],
  )

  useEffect(() => {
    if (!enabled) return

    const outcome = getScanPollingOutcome(scanStatus, isError)
    if (outcome === 'completed') {
      setEnabled(false)

      const { source, mode } = attemptRef.current
      analytics.capture(analyticsEvents.scanCompleted, {
        source: source ?? 'unknown',
        mode: mode ?? 'unknown',
      })
      queryClient.invalidateQueries({ queryKey: ['productChecks'] })
      queryClient.invalidateQueries({ queryKey: ['checkFree', userId] })
      resetAttempt()

      const fetchAndNavigate = async () => {
        try {
          await queryClient.fetchQuery({
            queryKey: ['productCheck', scanId, { includeRoutineConfig: false }],
            queryFn: () => getProductCheckById(getToken, scanId ?? '', false),
            staleTime: 0,
          })
          router.replace({
            pathname: '/(protected)/result/[scanId]',
            params: {
              scanId: scanId ?? '',
              frontUri: frontUri ?? '',
              backUri: backUri ?? '',
              haptics: 'true',
            },
          })
        } catch (error) {
          showRequestErrorToast(error)
        }
      }

      void fetchAndNavigate()
      return
    }

    if (outcome !== 'failed') return

    setEnabled(false)
    onFailed()
    const { source, mode } = attemptRef.current
    analytics.capture(analyticsEvents.scanFailed, {
      reason: isError ? 'polling_error' : scanStatus?.error ? 'processing_error' : 'scan_failed',
      source: source ?? 'unknown',
      mode: mode ?? 'unknown',
    })
    showErrorToast(scanStatus?.error || ERROR_KEYS_OBJ.generic)

    if (scanId) queryClient.removeQueries({ queryKey: [scan_qk, userId, scanId] })
    setScanId(null)
    resetAttempt()
  }, [
    analytics,
    attemptRef,
    backUri,
    enabled,
    frontUri,
    getToken,
    isError,
    onFailed,
    queryClient,
    resetAttempt,
    router,
    scanId,
    scanStatus,
    userId,
  ])

  return { startPolling }
}
