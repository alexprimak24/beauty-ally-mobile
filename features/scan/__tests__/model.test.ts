/// <reference types="jest" />

import {
  getFreeScanStatusColor,
  getLargestPictureSize,
  getScanPollingOutcome,
  resolveScanAccess,
} from '../model'

describe('scan model', () => {
  it('resolves paid, free, and pending access states', () => {
    expect(
      resolveScanAccess({ isPro: true, freeCheckLoading: true, freeCheckFailed: true }),
    ).toEqual({ ok: true, pro: true })
    expect(
      resolveScanAccess({
        isPro: false,
        freeCheckLoading: false,
        freeCheckFailed: false,
        remaining: 2,
      }),
    ).toEqual({ ok: true, pro: false, remaining: 2 })
    expect(
      resolveScanAccess({
        isPro: false,
        freeCheckLoading: false,
        freeCheckFailed: false,
        remaining: 0,
      }),
    ).toEqual({ ok: true, pro: false, remaining: 0 })
    expect(
      resolveScanAccess({ isPro: false, freeCheckLoading: true, freeCheckFailed: false }),
    ).toEqual({ ok: false })
    expect(
      resolveScanAccess({ isPro: false, freeCheckLoading: false, freeCheckFailed: true }),
    ).toEqual({ ok: false })
    expect(
      resolveScanAccess({ isPro: false, freeCheckLoading: false, freeCheckFailed: false }),
    ).toEqual({ ok: false })
  })

  it('selects the largest valid camera picture size', () => {
    expect(getLargestPictureSize(['1920x1080', '4032x3024', '1280x720'])).toBe('4032x3024')
    expect(getLargestPictureSize(['invalid', '100xnope'])).toBeUndefined()
    expect(getLargestPictureSize([])).toBeUndefined()
  })

  it.each([
    [4, '#4ade80'],
    [3, '#2dd4bf'],
    [2, '#2dd4bf'],
    [1, '#9fadbf'],
    [0, '#9fadbf'],
  ])('maps %i remaining scans to the status color', (remaining, color) => {
    expect(getFreeScanStatusColor(remaining)).toBe(color)
  })

  it('resolves polling outcomes without requiring a response on query failure', () => {
    expect(getScanPollingOutcome(undefined, true)).toBe('failed')
    expect(
      getScanPollingOutcome({ status: 'FAILED', stage: 'WORKER_STARTED', error: null }, false),
    ).toBe('failed')
    expect(
      getScanPollingOutcome(
        { status: 'PROCESSING', stage: 'WORKER_STARTED', error: 'Worker stopped' },
        false,
      ),
    ).toBe('failed')
    expect(
      getScanPollingOutcome({ status: 'COMPLETED', stage: 'WORKER_FINISHED', error: null }, false),
    ).toBe('completed')
    expect(
      getScanPollingOutcome(
        { status: 'COMPLETED', stage: 'WORKER_FINISHED', error: 'Stale error' },
        false,
      ),
    ).toBe('completed')
    expect(
      getScanPollingOutcome({ status: 'PROCESSING', stage: 'WORKER_STARTED', error: null }, false),
    ).toBe('pending')
    expect(getScanPollingOutcome(undefined, false)).toBe('pending')
  })
})
