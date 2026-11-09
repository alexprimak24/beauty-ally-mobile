/// <reference types="jest" />

import type { PostHog } from 'posthog-react-native'
import { analyticsEvents, analyticsScreenFromSegments, createAnalyticsClient } from '..'

function createTransport() {
  return {
    capture: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
    screen: jest.fn(),
  } as unknown as Pick<PostHog, 'capture' | 'identify' | 'reset' | 'screen'>
}

describe('analytics client', () => {
  it('forwards property-free lifecycle events', () => {
    const transport = createTransport()
    const analytics = createAnalyticsClient(transport)

    analytics.capture(analyticsEvents.appOpened)

    expect(transport.capture).toHaveBeenCalledWith('app_opened', undefined)
  })

  it('forwards only the explicitly typed funnel properties supplied by callers', () => {
    const transport = createTransport()
    const analytics = createAnalyticsClient(transport)

    analytics.capture(analyticsEvents.onboardingStepCompleted, {
      step: 4,
      step_name: 'allergies',
    })
    analytics.capture(analyticsEvents.scanFailed, {
      mode: 'two_step',
      reason: 'processing_error',
      source: 'camera',
    })

    expect(transport.capture).toHaveBeenNthCalledWith(1, 'onboarding_step_completed', {
      step: 4,
      step_name: 'allergies',
    })
    expect(transport.capture).toHaveBeenNthCalledWith(2, 'scan_failed', {
      mode: 'two_step',
      reason: 'processing_error',
      source: 'camera',
    })
  })

  it('forwards privacy-safe product engagement context without product data', () => {
    const transport = createTransport()
    const analytics = createAnalyticsClient(transport)

    analytics.capture(analyticsEvents.collectionOpened, {
      collection: 'favorites',
    })
    analytics.capture(analyticsEvents.productCollectionChanged, {
      action: 'added',
      collection: 'skincare',
      routine_periods: ['morning', 'evening'],
      source: 'scan_result',
    })
    analytics.capture(analyticsEvents.routineCompleted, {
      scope: 'day',
    })
    analytics.capture(analyticsEvents.notificationOpened, {
      destination: 'internal',
      notification_type: 'update',
      was_unread: true,
    })

    expect(transport.capture).toHaveBeenNthCalledWith(1, 'collection_opened', {
      collection: 'favorites',
    })
    expect(transport.capture).toHaveBeenNthCalledWith(2, 'product_collection_changed', {
      action: 'added',
      collection: 'skincare',
      routine_periods: ['morning', 'evening'],
      source: 'scan_result',
    })
    expect(transport.capture).toHaveBeenNthCalledWith(3, 'routine_completed', {
      scope: 'day',
    })
    expect(transport.capture).toHaveBeenNthCalledWith(4, 'notification_opened', {
      destination: 'internal',
      notification_type: 'update',
      was_unread: true,
    })
  })

  it('centralizes identity and reset operations', () => {
    const transport = createTransport()
    const analytics = createAnalyticsClient(transport)

    analytics.identify('user-123')
    analytics.reset()

    expect(transport.identify).toHaveBeenCalledWith('user-123')
    expect(transport.reset).toHaveBeenCalledTimes(1)
  })

  it('uses PostHog screen events with normalized names', () => {
    const transport = createTransport()
    const analytics = createAnalyticsClient(transport)

    analytics.screen('scan_result')

    expect(transport.screen).toHaveBeenCalledWith('scan_result')
  })

  it.each([
    [['(auth)', 'onboarding', 'allergies'], 'onboarding_allergies'],
    [['(auth)', 'payment', 'paywall'], 'paywall'],
    [['(protected)', '(tabs)'], 'home'],
    [['(protected)', '(tabs)', 'history'], 'history'],
    [['(protected)', 'result', '[scanId]'], 'scan_result'],
    [['(protected)', 'skincareShelf', 'addToRoutine'], 'skincare_add_to_routine'],
    [['(protected)', '(modals)', 'edit', 'skin-type'], 'edit_profile'],
  ] as const)('normalizes %j without exposing route parameters', (segments, expected) => {
    expect(analyticsScreenFromSegments(segments)).toBe(expected)
  })

  it('does not capture an unresolved root route', () => {
    expect(analyticsScreenFromSegments([])).toBeNull()
  })
})
