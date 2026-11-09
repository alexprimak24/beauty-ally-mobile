import type { ConsentRecord } from '@/context/consentContext'
import type { UserData } from '@/types/userEntry'
import type { GetToken } from './api/auth'
import { z } from 'zod'
import { apiRequest } from './api/client'

const optionalProfilePictureSchema = z.preprocess(
  (value) => (value === null ? undefined : value),
  z.string().optional(),
)

const userDataSchema = z.object({
  name: z.string().optional(),
  gender: z.string().optional(),
  language: z.string().optional(),
  profilePicture: optionalProfilePictureSchema,
  skinType: z.string().optional(),
  allergies: z.string().optional(),
  skinConcerns: z.string().optional(),
  activeTreatment: z.string().optional(),
  sunscreenUsage: z.string().optional(),
  climate: z.string().optional(),
}) satisfies z.ZodType<UserData>

const upsertUserResponseSchema = z.object({
  profile: userDataSchema,
})

const userProfileSchema = z
  .discriminatedUnion('exists', [
    z.object({
      exists: z.literal(true),
      profile: userDataSchema,
      userId: z.string(),
    }),
    z.object({
      exists: z.literal(false),
      profile: userDataSchema.optional(),
      userId: z.string().optional(),
    }),
  ])
  .transform((result) => ({
    ...result,
    profile: result.profile ?? {},
    userId: result.userId ?? '',
  }))

const consentResultSchema = z.object({
  deactivated: z.number().int().nonnegative(),
  inserted: z.number().int().nonnegative(),
})

const upsertConsentResponseSchema = z.object({ result: consentResultSchema })
const upsertConsentsResponseSchema = z.object({
  results: z.array(
    z.object({
      Deactivated: z.number().int().nonnegative(),
      Inserted: z.number().int().nonnegative(),
    }),
  ),
})
const withdrawnConsentSchema = z.object({ withdrawn: z.boolean() })
const consentStatusSchema = z.object({ has_required_consents: z.boolean() })
const consentByTypeSchema = z.object({ hasConsent: z.boolean() })
const deleteUserResponseSchema = z.literal(true)

export type UpsertUserResponse = z.infer<typeof upsertUserResponseSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
export type GetConsentByTypeResponse = z.infer<typeof consentByTypeSchema>
export type WithdrawnConsent = z.infer<typeof withdrawnConsentSchema>
export type Status = z.infer<typeof consentStatusSchema>
export type UpsertConsentResponse = z.infer<typeof upsertConsentResponseSchema>
export type UpsertConsentsResponse = z.infer<typeof upsertConsentsResponseSchema>

export type ConsentType = 'health_data' | 'terms_privacy'

export function upsertConsents(
  consentData: ConsentRecord[],
  getToken: GetToken,
): Promise<UpsertConsentsResponse> {
  return apiRequest(getToken, '/v1/consents/batch', {
    method: 'PUT',
    json: { consents: consentData },
    schema: upsertConsentsResponseSchema,
    timeoutMs: 12000,
  })
}

export function upsertConsent(
  consentData: ConsentRecord[],
  getToken: GetToken,
): Promise<UpsertConsentResponse> {
  const consent = consentData[0]
  if (!consent) throw new Error('At least one consent record is required')

  return apiRequest(getToken, '/v1/consents/upsert', {
    method: 'PUT',
    json: consent,
    schema: upsertConsentResponseSchema,
    timeoutMs: 12000,
  })
}

export function withdrawConsent(type: ConsentType, getToken: GetToken): Promise<WithdrawnConsent> {
  return apiRequest(getToken, `/v1/consents/${type}/withdraw`, {
    method: 'PUT',
    schema: withdrawnConsentSchema,
    timeoutMs: 12000,
  })
}

export function getConsentsStatus(getToken: GetToken): Promise<Status> {
  return apiRequest(getToken, '/v1/consents/status', {
    method: 'GET',
    schema: consentStatusSchema,
    timeoutMs: 8000,
  })
}

export function getConsentByType(
  type: ConsentType,
  getToken: GetToken,
): Promise<GetConsentByTypeResponse> {
  return apiRequest(getToken, `/v1/consents/${type}/status`, {
    method: 'GET',
    schema: consentByTypeSchema,
  })
}

export function upsertUserProfile(
  profileData: Partial<UserData>,
  getToken: GetToken,
): Promise<UpsertUserResponse> {
  return apiRequest(getToken, '/v1/me', {
    method: 'PUT',
    json: profileData,
    schema: upsertUserResponseSchema,
    timeoutMs: 11000,
  })
}

export function getUserProfile(getToken: GetToken): Promise<UserProfile> {
  return apiRequest(getToken, '/v1/me', {
    method: 'GET',
    schema: userProfileSchema,
  })
}

export function getRawUserProfile(getToken: GetToken): Promise<UserProfile> {
  return apiRequest(getToken, '/v1/me/raw', {
    method: 'GET',
    schema: userProfileSchema,
  })
}

export function deleteUserProfile(getToken: GetToken): Promise<true> {
  return apiRequest(getToken, '/v1/me', {
    method: 'DELETE',
    emptyResponse: true,
    schema: deleteUserResponseSchema,
    timeoutMs: 12000,
  })
}
