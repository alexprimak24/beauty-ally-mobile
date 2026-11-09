import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'

const entitlementStatusSchema = z.object({
  active: z.boolean(),
  expires_at: z.string().nullable(),
  grace_expires_at: z.string().nullable(),
  key: z.string(),
})

const proStatsSchema = z.object({
  entitlement: entitlementStatusSchema,
  user_id: z.string(),
})

const remainingSchema = z.object({
  remaining: z.number().int().nonnegative(),
  hasEntry: z.boolean(),
})

const freeInitResponseSchema = z.object({
  granted: z.boolean(),
  remaining: z.number().int().nonnegative(),
})

export type ProStats = z.infer<typeof proStatsSchema>
export type Remaining = z.infer<typeof remainingSchema>
export type FreeInitResponse = z.infer<typeof freeInitResponseSchema>

export function checkPro(getToken: GetToken): Promise<ProStats> {
  return apiRequest(getToken, '/v1/me/entitlement', {
    method: 'GET',
    schema: proStatsSchema,
    timeoutMs: 6000,
  })
}

export function checkFreeRemaining(getToken: GetToken): Promise<Remaining> {
  return apiRequest(getToken, '/v1/me/free/status', {
    method: 'GET',
    schema: remainingSchema,
    timeoutMs: 6000,
  })
}

export function freeInit(getToken: GetToken, email: string): Promise<FreeInitResponse> {
  return apiRequest(getToken, '/v1/me/free/init', {
    method: 'POST',
    json: { email },
    schema: freeInitResponseSchema,
    timeoutMs: 15000,
  })
}
