import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'
import { mutationSuccessSchema } from './api/schemas'

export type ProductCheckMutationSuccess = z.infer<typeof mutationSuccessSchema>

export function deleteProductCheck(getToken: GetToken, scanId: string): Promise<true> {
  return apiRequest(getToken, `/v1/scans/${encodeURIComponent(scanId)}`, {
    method: 'DELETE',
    emptyResponse: true,
    schema: z.literal(true),
    timeoutMs: 12000,
  })
}

export function addToFavoritesProductCheck(
  getToken: GetToken,
  scanId: string,
): Promise<ProductCheckMutationSuccess> {
  return apiRequest(getToken, `/v1/scans/${encodeURIComponent(scanId)}/favorites`, {
    method: 'PUT',
    schema: mutationSuccessSchema,
    timeoutMs: 12000,
  })
}
