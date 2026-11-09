import type { GetToken } from './api/auth'
import { apiRequest } from './api/client'
import { ApiError } from './api/errors'
import { appendImageFile } from './api/formData'
import { scanIdResponseSchema } from './api/schemas'

export async function uploadFastScanPhoto(getToken: GetToken, uri: string | null | undefined) {
  if (!uri) throw ApiError.invalidRequest({ reason: 'missing_fast_scan_image' })

  const formData = new FormData()
  await appendImageFile(formData, 'new_image', uri, 'new_image')

  return apiRequest(getToken, '/v1/scans/fast', {
    method: 'POST',
    body: formData,
    schema: scanIdResponseSchema,
    timeoutMs: 12000,
  })
}
