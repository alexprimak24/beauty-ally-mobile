import type { GetToken } from './api/auth'
import { apiRequest } from './api/client'
import { ApiError } from './api/errors'
import { appendImageFile } from './api/formData'
import { scanIdResponseSchema } from './api/schemas'

export interface UploadBothPhotosResponse {
  success: true
  data: {
    scan_id: string
  }
}

export async function uploadBothPhotos(
  getToken: GetToken,
  frontUri?: string | null,
  backUri?: string | null,
  scanId?: string,
): Promise<UploadBothPhotosResponse> {
  if (!frontUri && !backUri)
    throw ApiError.invalidRequest({ reason: 'missing_scan_images' }, 'errors.bothImagesRequired')

  const formData = new FormData()
  if (frontUri) await appendImageFile(formData, 'front', frontUri, 'front-product')
  if (backUri) await appendImageFile(formData, 'back', backUri, 'back-product')

  const searchParams = new URLSearchParams({ requested_version: 'v1' })
  if (scanId) searchParams.set('scanId', scanId)

  const data = await apiRequest(getToken, `/v1/scans/images?${searchParams.toString()}`, {
    method: 'POST',
    body: formData,
    schema: scanIdResponseSchema,
    timeoutMs: 16000,
  })

  return { success: true, data }
}
