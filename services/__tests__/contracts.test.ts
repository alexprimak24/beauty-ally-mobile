/// <reference types="jest" />

import type { GetToken } from '../api/auth'
import { markAsRead } from '../alerts'
import { checkPro } from '../entitlements'
import { getRoutineCalendar } from '../routine'
import { getScanJobStatus } from '../scanStatus'
import { getUserProfile } from '../userOperations'

const originalFetch = globalThis.fetch
const originalBaseUrl = process.env.EXPO_PUBLIC_BACKEND_ENDPOINT
const getToken = jest.fn().mockResolvedValue('test-token') as unknown as GetToken

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response
}

describe('backend response contracts', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_BACKEND_ENDPOINT = 'https://api.beauty.test'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
    if (originalBaseUrl === undefined) delete process.env.EXPO_PUBLIC_BACKEND_ENDPOINT
    else process.env.EXPO_PUBLIC_BACKEND_ENDPOINT = originalBaseUrl
  })

  it('normalizes the current mark-as-read Go DTO into the app notification model', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      jsonResponse({
        ID: 'alert-1',
        Title: 'Routine reminder',
        Subtitle: null,
        Type: 'info',
        LinkUrl: '/(protected)/skincareShelf',
        ActiveFrom: '2026-11-05T08:00:00Z',
        ActiveTo: null,
        CreatedAt: '2026-11-05T07:00:00Z',
        Read: true,
      }),
    )

    await expect(markAsRead('alert-1', getToken)).resolves.toEqual({
      id: 'alert-1',
      title: 'Routine reminder',
      subtitle: undefined,
      type: 'info',
      linkUrl: '/(protected)/skincareShelf',
      activeFrom: '2026-11-05T08:00:00Z',
      activeTo: undefined,
      createdAt: '2026-11-05T07:00:00Z',
      read: true,
    })
  })

  it('accepts a pending scan with no error message', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      jsonResponse({
        status: 'PENDING',
        stage: 'FRONT_RECEIVED',
        error: null,
      }),
    )

    await expect(getScanJobStatus(getToken, 'scan-1')).resolves.toEqual({
      status: 'PENDING',
      stage: 'FRONT_RECEIVED',
      error: null,
    })
  })

  it('accepts nullable expiry dates for an inactive entitlement', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      jsonResponse({
        user_id: 'user-1',
        entitlement: {
          key: 'pro',
          active: false,
          expires_at: null,
          grace_expires_at: null,
        },
      }),
    )

    await expect(checkPro(getToken)).resolves.toMatchObject({
      entitlement: {
        active: false,
        expires_at: null,
        grace_expires_at: null,
      },
    })
  })

  it('normalizes a missing profile while preserving the backend exists flag', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(jsonResponse({ exists: false }))

    await expect(getUserProfile(getToken)).resolves.toEqual({
      exists: false,
      profile: {},
      userId: '',
    })
  })

  it('sends the routine calendar anchor date required by the backend', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      jsonResponse({
        current_streak: 0,
        max_streak: 0,
        days: [],
      }),
    )
    globalThis.fetch = fetchMock

    await getRoutineCalendar(getToken, {
      from: '2026-11-01',
      to: '2026-11-30',
      anchorDate: '2026-11-05',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.beauty.test/v1/routine/calendar?from=2026-11-01&to=2026-11-30&anchorDate=2026-11-05',
      expect.any(Object),
    )
  })
})
