import { getScanJobStatus } from '@/services/scanStatus'
import { useAuth } from '@clerk/expo'
import { useQuery } from '@tanstack/react-query'

export const scan_qk = 'scan_status'
const refetchInterval = 2000

export function useScanStatus(scanId: string | null, enabled: boolean) {
  const { getToken, userId } = useAuth()

  return useQuery({
    queryKey: [scan_qk, userId, scanId],
    queryFn: () => {
      if (!scanId) throw new Error('scanId is required')
      return getScanJobStatus(getToken, scanId)
    },
    enabled: !!userId && !!scanId && enabled,
    refetchInterval: enabled ? refetchInterval : false,
    refetchOnWindowFocus: true,
    retry: 1,
  })
}
