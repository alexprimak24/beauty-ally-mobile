import { productChecksEntrySchema } from '@/types/scanEntry'
import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'

const productChecksResponseSchema = z.object({
  entries: z.array(productChecksEntrySchema),
  page: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  totalItems: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
})

export type ProductChecksResponse = z.infer<typeof productChecksResponseSchema>

export function getProductCheckById(
  getToken: GetToken,
  scanId: string,
  includeRoutineConfig = false,
) {
  const query = includeRoutineConfig ? '?includeRoutineConfig=true' : ''

  return apiRequest(getToken, `/v1/scans/${encodeURIComponent(scanId)}${query}`, {
    method: 'GET',
    schema: productChecksEntrySchema,
    timeoutMs: 9000,
  })
}

export function getProductChecks(
  getToken: GetToken,
  pageParam = 1,
  search: string,
  matchSummary: string,
  favoritesOnly: boolean,
  skincareOnly: boolean,
  skincareExcluded: boolean,
): Promise<ProductChecksResponse> {
  return apiRequest(getToken, '/v1/scans', {
    method: 'POST',
    json: {
      matchSummary,
      search,
      page: pageParam,
      pageSize: 3,
      favoritesOnly,
      skincareOnly,
      skincareExcluded,
    },
    schema: productChecksResponseSchema,
  })
}
