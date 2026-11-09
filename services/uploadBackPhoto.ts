import type { GetToken } from './api/auth'
import { apiRequest } from './api/client'
import { ApiError } from './api/errors'
import { appendImageFile } from './api/formData'
import { scanIdResponseSchema } from './api/schemas'

export interface UploadBackPhotoResponse {
  success: true
  data: {
    scan_id: string
  }
}

export async function uploadBackPhoto(
  getToken: GetToken,
  uri: string | null | undefined,
  side: 'back',
  scanId?: string | null,
): Promise<UploadBackPhotoResponse> {
  if (!uri) throw ApiError.invalidRequest({ reason: 'missing_back_image' })

  const formData = new FormData()
  await appendImageFile(formData, 'image', uri, `${side}-product`)
  formData.append(
    'payload',
    JSON.stringify({
      lang: 'auto',
      source: 'vision',
      requested_version: 'v1',
    }),
  )

  const searchParams = new URLSearchParams()
  if (scanId) searchParams.set('scanId', scanId)

  const query = searchParams.toString()
  const data = await apiRequest(getToken, `/v1/scans/back${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: formData,
    schema: scanIdResponseSchema,
    timeoutMs: 16000,
  })

  return { success: true, data }
}
