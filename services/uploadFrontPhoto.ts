import type { GetToken } from './api/auth'
import { apiRequest } from './api/client'
import { ApiError } from './api/errors'
import { appendImageFile } from './api/formData'
import { scanIdResponseSchema } from './api/schemas'

export interface UploadFrontPhotoResponse {
  success: true
  data: {
    scan_id: string
  }
}

export async function uploadFrontPhoto(
  getToken: GetToken,
  uri: string | null | undefined,
  side: 'front',
  scanId?: string | null,
): Promise<UploadFrontPhotoResponse> {
  if (!uri) throw ApiError.invalidRequest({ reason: 'missing_front_image' })

  const formData = new FormData()
  await appendImageFile(formData, 'image', uri, `${side}-product`)

  const searchParams = new URLSearchParams()
  if (scanId) searchParams.set('scanId', scanId)

  const query = searchParams.toString()
  const data = await apiRequest(getToken, `/v1/scans/front${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: formData,
    schema: scanIdResponseSchema,
    timeoutMs: 18000,
  })

  return { success: true, data }
}
