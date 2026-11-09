/// <reference types="jest" />

import { getNotificationTheme, resolveNotificationDestination } from '../model'

describe('notifications model', () => {
  it.each([
    ['warning', '#FEE2E2', '#fdebf6'],
    ['update', '#DBEAFE', '#def2ff'],
    ['info', '#E5E7EB', '#d6f5d6'],
  ] as const)('maps %s notifications to a visual theme', (type, borderColor, unreadColor) => {
    expect(getNotificationTheme(type)).toEqual({ borderColor, unreadColor })
  })

  it('resolves internal, external, and missing destinations', () => {
    expect(resolveNotificationDestination('/history')).toEqual({
      kind: 'internal',
      href: '/history',
    })
    expect(resolveNotificationDestination(' https://beautyai.site/help ')).toEqual({
      kind: 'external',
      url: 'https://beautyai.site/help',
    })
    expect(resolveNotificationDestination('  ')).toEqual({ kind: 'none' })
    expect(resolveNotificationDestination(undefined)).toEqual({ kind: 'none' })
  })
})
