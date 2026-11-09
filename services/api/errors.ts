import { z } from 'zod'

const apiErrorPayloadSchema = z.object({
  code: z.string(),
  http_status: z.number().int(),
  key: z.string().optional().default('errors.generic'),
  params: z.record(z.string(), z.unknown()).optional(),
  details: z.unknown().optional(),
})

export const apiErrorEnvelopeSchema = z.object({
  error: apiErrorPayloadSchema,
  meta: z
    .object({
      requestId: z.string().optional(),
      ts: z.string().optional(),
    })
    .optional(),
})

export type ApiErrorPayload = z.infer<typeof apiErrorPayloadSchema>
export type ApiErrorEnvelope = z.infer<typeof apiErrorEnvelopeSchema>

export class ApiError extends Error {
  readonly code: string
  readonly httpStatus: number
  readonly key: string
  readonly params?: Record<string, unknown>
  readonly details?: unknown
  readonly requestId?: string
  readonly cause?: unknown

  constructor(error: ApiErrorPayload, options: { cause?: unknown; requestId?: string } = {}) {
    super(error.key)
    this.name = 'ApiError'
    this.code = error.code
    this.httpStatus = error.http_status
    this.key = error.key
    this.params = error.params
    this.details = error.details
    this.requestId = options.requestId
    this.cause = options.cause
  }

  static fromEnvelope(envelope: ApiErrorEnvelope, cause?: unknown) {
    return new ApiError(envelope.error, {
      cause,
      requestId: envelope.meta?.requestId,
    })
  }

  static invalidResponse(status: number, details: unknown, cause?: unknown) {
    return new ApiError(
      {
        code: 'INVALID_API_RESPONSE',
        http_status: status,
        key: 'errors.generic',
        details,
      },
      { cause },
    )
  }

  static invalidRequest(details?: unknown, key = 'errors.generic') {
    return new ApiError({
      code: 'INVALID_REQUEST',
      http_status: 0,
      key,
      details,
    })
  }

  static network(cause: unknown) {
    return new ApiError(
      {
        code: 'NETWORK_ERROR',
        http_status: 0,
        key: 'errors.generic',
        details: cause instanceof Error ? cause.message : cause,
      },
      { cause },
    )
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
