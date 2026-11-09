/// <reference types="jest" />

import type { GetToken } from '../auth'
import { z } from 'zod'
import { apiRequest } from '../client'

const originalFetch = globalThis.fetch
const originalBaseUrl = process.env.EXPO_PUBLIC_BACKEND_ENDPOINT
const responseSchema = z.object({ value: z.string() })

function mockResponse(body: string, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: jest.fn().mockResolvedValue(body),
  } as unknown as Response
}

function tokenProvider(token: string | null = 'test-token'): GetToken {
  return jest.fn().mockResolvedValue(token) as unknown as GetToken
}

describe('apiRequest', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_BACKEND_ENDPOINT = 'https://api.beauty.test/'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
    if (originalBaseUrl === undefined) delete process.env.EXPO_PUBLIC_BACKEND_ENDPOINT
    else process.env.EXPO_PUBLIC_BACKEND_ENDPOINT = originalBaseUrl
  })

  it('authenticates, serializes JSON, and validates the response', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(mockResponse(JSON.stringify({ value: 'validated' })))
    globalThis.fetch = fetchMock

    await expect(
      apiRequest(tokenProvider(), '/v1/example', {
        method: 'POST',
        json: { input: 'hello' },
        schema: responseSchema,
      }),
    ).resolves.toEqual({ value: 'validated' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = init.headers as Headers
    expect(url).toBe('https://api.beauty.test/v1/example')
    expect(init.body).toBe(JSON.stringify({ input: 'hello' }))
    expect(headers.get('Authorization')).toBe('Bearer test-token')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('preserves canonical backend error metadata', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      mockResponse(
        JSON.stringify({
          error: {
            code: 'RATE_LIMITED',
            http_status: 429,
            key: 'errors.rateLimited',
            params: { retryAfter: 30 },
          },
          meta: { requestId: 'request-123' },
        }),
        429,
      ),
    )

    await expect(
      apiRequest(tokenProvider(), '/v1/example', {
        schema: responseSchema,
      }),
    ).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      httpStatus: 429,
      key: 'errors.rateLimited',
      params: { retryAfter: 30 },
      requestId: 'request-123',
    })
  })

  it('rejects successful HTTP responses that violate their Zod contract', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(mockResponse(JSON.stringify({ value: 42 })))

    await expect(
      apiRequest(tokenProvider(), '/v1/example', {
        schema: responseSchema,
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_API_RESPONSE',
      httpStatus: 200,
      details: expect.objectContaining({ reason: 'schema_mismatch' }),
    })
  })

  it('distinguishes malformed JSON from a schema mismatch', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(mockResponse('{not-json'))

    await expect(
      apiRequest(tokenProvider(), '/v1/example', {
        schema: responseSchema,
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_API_RESPONSE',
      details: { reason: 'invalid_json' },
    })
  })

  it('supports validated empty responses such as HTTP 204 deletes', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(mockResponse('', 204))

    await expect(
      apiRequest(tokenProvider(), '/v1/example', {
        method: 'DELETE',
        emptyResponse: true,
        schema: z.literal(true),
      }),
    ).resolves.toBe(true)
  })

  it('fails before making a request when the auth token is missing', async () => {
    const fetchMock = jest.fn()
    globalThis.fetch = fetchMock

    await expect(
      apiRequest(tokenProvider(null), '/v1/example', {
        schema: responseSchema,
      }),
    ).rejects.toMatchObject({
      code: 'AUTH_TOKEN_MISSING',
      httpStatus: 401,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('normalizes token-provider failures into a typed auth error', async () => {
    const cause = new Error('Clerk is unavailable')
    const failingTokenProvider = jest.fn().mockRejectedValue(cause) as unknown as GetToken

    await expect(
      apiRequest(failingTokenProvider, '/v1/example', {
        schema: responseSchema,
      }),
    ).rejects.toMatchObject({
      code: 'AUTH_TOKEN_ERROR',
      httpStatus: 401,
      key: 'errors.unauthorized',
      cause,
    })
  })

  it('normalizes transport failures into a network ApiError', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'))

    await expect(
      apiRequest(tokenProvider(), '/v1/example', {
        schema: responseSchema,
      }),
    ).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
      httpStatus: 0,
      details: 'Network request failed',
    })
  })

  it('normalizes an expired request into a timeout ApiError', async () => {
    globalThis.fetch = jest.fn(
      (_url: string, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => {
              const error = new Error('Aborted')
              error.name = 'AbortError'
              reject(error)
            },
            { once: true },
          )
        }),
    ) as typeof fetch

    await expect(
      apiRequest(tokenProvider(), '/v1/example', {
        schema: responseSchema,
        timeoutMs: 5,
      }),
    ).rejects.toMatchObject({
      code: 'REQUEST_TIMEOUT',
      httpStatus: 0,
      details: { timeoutMs: 5 },
    })
  })
})
