import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'
import { ApiError } from './api/errors'
import { appendImageFile } from './api/formData'
import { mutationSuccessSchema } from './api/schemas'

const updateProductNameSchema = z.object({ productName: z.string() })
const updateProductLinkSchema = z.object({ purchaseLink: z.string() })

export type UpdateProductFrontImageResponse = z.infer<typeof mutationSuccessSchema>
export type UpdateProductNameResponse = z.infer<typeof updateProductNameSchema>
export type UpdateProductLinkResponse = z.infer<typeof updateProductLinkSchema>

export async function updateProductFrontImage(
  getToken: GetToken,
  scanId: string,
  uri: string | null | undefined,
): Promise<UpdateProductFrontImageResponse> {
  if (!uri) throw ApiError.invalidRequest({ reason: 'missing_product_image' })

  const formData = new FormData()
  await appendImageFile(formData, 'new_image', uri, 'new_image')

  return apiRequest(getToken, `/v1/scans/${encodeURIComponent(scanId)}/front`, {
    method: 'PUT',
    body: formData,
    schema: mutationSuccessSchema,
    timeoutMs: 12000,
  })
}

export function updateProductName(
  getToken: GetToken,
  scanId: string,
  productName: string,
): Promise<UpdateProductNameResponse> {
  return apiRequest(getToken, `/v1/scans/${encodeURIComponent(scanId)}/name`, {
    method: 'PUT',
    json: { product_name: productName },
    schema: updateProductNameSchema,
    timeoutMs: 6000,
  })
}

export function updateProductLink(
  getToken: GetToken,
  scanId: string,
  purchaseLink: string,
): Promise<UpdateProductLinkResponse> {
  return apiRequest(getToken, `/v1/scans/${encodeURIComponent(scanId)}/link`, {
    method: 'PUT',
    json: { purchase_link: purchaseLink },
    schema: updateProductLinkSchema,
    timeoutMs: 6000,
  })
}
