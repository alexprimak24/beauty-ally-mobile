import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'

const scanStatusSchema = z.object({
  status: z.enum(['PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED']),
  stage: z.enum(['INIT', 'FRONT_RECEIVED', 'BOTH_RECEIVED', 'WORKER_STARTED', 'WORKER_FINISHED']),
  error: z.string().nullable(),
})

export type ScanStatus = z.infer<typeof scanStatusSchema>

export function getScanJobStatus(getToken: GetToken, scanId: string): Promise<ScanStatus> {
  return apiRequest(getToken, `/v1/scans/${encodeURIComponent(scanId)}/status`, {
    method: 'GET',
    schema: scanStatusSchema,
  })
}
