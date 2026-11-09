import type { ScanStatus } from '@/services/scanStatus'
import type { ScanAccess } from './types'

interface ResolveScanAccessOptions {
  freeCheckFailed: boolean
  freeCheckLoading: boolean
  isPro: boolean
  remaining?: number | null
}

export function resolveScanAccess({
  freeCheckFailed,
  freeCheckLoading,
  isPro,
  remaining,
}: ResolveScanAccessOptions): ScanAccess {
  if (isPro) return { ok: true, pro: true }

  if (freeCheckLoading || freeCheckFailed || remaining == null) return { ok: false }

  return { ok: true, pro: false, remaining: Number(remaining) }
}

export function getLargestPictureSize(sizes: string[]): string | undefined {
  let largestSize: string | undefined
  let largestArea = 0

  for (const size of sizes) {
    const [widthValue, heightValue] = size.split('x')
    const width = Number(widthValue)
    const height = Number(heightValue)

    if (!Number.isFinite(width) || !Number.isFinite(height)) continue

    const area = width * height
    if (area > largestArea) {
      largestArea = area
      largestSize = size
    }
  }

  return largestSize
}

export function getFreeScanStatusColor(remaining: number): string {
  if (remaining > 3) return '#4ade80'
  if (remaining > 1) return '#2dd4bf'
  return '#9fadbf'
}

export type ScanPollingOutcome = 'completed' | 'failed' | 'pending'

export function getScanPollingOutcome(
  status: ScanStatus | undefined,
  queryFailed: boolean,
): ScanPollingOutcome {
  if (queryFailed) return 'failed'
  if (status?.status === 'COMPLETED') return 'completed'
  if (status?.error || status?.status === 'FAILED') return 'failed'
  return 'pending'
}
