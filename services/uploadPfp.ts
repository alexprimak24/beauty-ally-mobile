import type { GetToken } from './api/auth'
import { apiRequest } from './api/client'
import { ApiError } from './api/errors'
import { appendImageFile } from './api/formData'
import { mutationSuccessSchema } from './api/schemas'

export async function uploadPfp(getToken: GetToken, uri: string | null | undefined) {
  if (!uri) throw ApiError.invalidRequest({ reason: 'missing_profile_image' })

  const formData = new FormData()
  await appendImageFile(formData, 'pfp', uri, 'newPfp')

  return apiRequest(getToken, '/v1/me/pfp', {
    method: 'PUT',
    body: formData,
    schema: mutationSuccessSchema,
    timeoutMs: 12000,
  })
}
