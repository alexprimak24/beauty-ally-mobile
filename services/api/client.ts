import type { GetToken } from './auth'
import type { z } from 'zod'
import { ApiError, apiErrorEnvelopeSchema } from './errors'

interface ApiRequestOptions<TSchema extends z.ZodType> extends Omit<RequestInit, 'body'> {
  schema: TSchema
  body?: BodyInit
  emptyResponse?: z.input<TSchema>
  json?: unknown
  timeoutMs?: number
}

function getApiBaseUrl(): string {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_BACKEND_ENDPOINT
  if (!configuredBaseUrl) throw ApiError.invalidRequest({ reason: 'missing_api_base_url' })

  return configuredBaseUrl.replace(/\/+$/, '')
}

function parseResponseJson(raw: string): { data?: unknown; parseError?: unknown } {
  if (!raw) return {}

  try {
    return { data: JSON.parse(raw) as unknown }
  } catch (parseError) {
    return { parseError }
  }
}

function httpError(status: number, payload: unknown, cause?: unknown) {
  const parsedError = apiErrorEnvelopeSchema.safeParse(payload)
  if (parsedError.success) return ApiError.fromEnvelope(parsedError.data, cause)

  return new ApiError(
    {
      code: `HTTP_${status}`,
      http_status: status,
      key: 'errors.generic',
      details: payload,
    },
    { cause },
  )
}

export async function apiRequest<TSchema extends z.ZodType>(
  getToken: GetToken,
  path: string,
  options: ApiRequestOptions<TSchema>,
): Promise<z.output<TSchema>> {
  const {
    body,
    emptyResponse,
    headers: suppliedHeaders,
    json,
    schema,
    signal: callerSignal,
    timeoutMs = 10000,
    ...requestInit
  } = options

  let token: string | null
  try {
    token = await getToken()
  } catch (cause) {
    throw new ApiError(
      {
        code: 'AUTH_TOKEN_ERROR',
        http_status: 401,
        key: 'errors.unauthorized',
      },
      { cause },
    )
  }

  if (!token) {
    throw new ApiError({
      code: 'AUTH_TOKEN_MISSING',
      http_status: 401,
      key: 'errors.unauthorized',
    })
  }

  if (body !== undefined && json !== undefined) {
    throw ApiError.invalidRequest({
      reason: 'body_and_json_are_mutually_exclusive',
    })
  }

  const headers = new Headers(suppliedHeaders)
  headers.set('Authorization', `Bearer ${token}`)

  const requestBody = json === undefined ? body : JSON.stringify(json)
  if (json !== undefined && !headers.has('Content-Type'))
    headers.set('Content-Type', 'application/json')

  const timeoutController = new AbortController()
  let didTimeout = false
  const timeoutId = setTimeout(() => {
    didTimeout = true
    timeoutController.abort()
  }, timeoutMs)
  const onCallerAbort = () => timeoutController.abort()

  try {
    if (callerSignal) {
      if (callerSignal.aborted) timeoutController.abort()
      else callerSignal.addEventListener('abort', onCallerAbort, { once: true })
    }

    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...requestInit,
      body: requestBody,
      headers,
      signal: timeoutController.signal,
    })

    const raw = await response.text()
    const { data, parseError } = parseResponseJson(raw)

    if (!response.ok) throw httpError(response.status, data, parseError)

    const errorEnvelope = apiErrorEnvelopeSchema.safeParse(data)
    if (errorEnvelope.success) throw ApiError.fromEnvelope(errorEnvelope.data)

    if (parseError)
      throw ApiError.invalidResponse(response.status, { reason: 'invalid_json' }, parseError)

    const payload = data === undefined ? emptyResponse : data
    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      throw ApiError.invalidResponse(
        response.status,
        {
          reason: 'schema_mismatch',
          issues: parsed.error.issues,
        },
        parsed.error,
      )
    }

    return parsed.data
  } catch (error) {
    if (error instanceof ApiError) throw error

    if (didTimeout) {
      throw new ApiError(
        {
          code: 'REQUEST_TIMEOUT',
          http_status: 0,
          key: 'errors.generic',
          details: { timeoutMs },
        },
        { cause: error },
      )
    }

    if (error instanceof Error && error.name === 'AbortError') throw error

    throw ApiError.network(error)
  } finally {
    clearTimeout(timeoutId)
    callerSignal?.removeEventListener('abort', onCallerAbort)
  }
}
