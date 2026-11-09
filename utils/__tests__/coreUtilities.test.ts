/// <reference types="jest" />

import { isSafeHttpUrl } from '../isSafeHttpUrl'
import { mapVerdict, verdictFromApi } from '../mapVerdict'
import { yearlySavingsPct } from '../paywallHelpers'
import { replaceSemicolonsWithCommas } from '../replaceSemicolonsWithCommas'
import { sanitizePatch, sanitizeValue } from '../sanitizeProfile'

describe('scan verdict mapping', () => {
  it.each([
    ['Generally Suitable', 'generally'],
    ['Might Not Align', 'mightNotAlign'],
    ['Low Match', 'lowMatch'],
  ] as const)('maps %s to the stable UI key', (input, expectedKey) => {
    const verdict = verdictFromApi(input)

    expect(verdict).not.toBeNull()
    expect(mapVerdict({ verdict: verdict! }).key).toBe(expectedKey)
  })

  it('normalizes known near-miss responses and rejects unrelated values', () => {
    expect(verdictFromApi('generally a suitable match')).toBe('Generally Suitable')
    expect(verdictFromApi('this might not work')).toBe('Might Not Align')
    expect(verdictFromApi('low compatibility')).toBe('Low Match')
    expect(verdictFromApi('unknown')).toBeNull()
    expect(verdictFromApi(null)).toBeNull()
  })
})

describe('profile sanitization', () => {
  it('trims strings and removes empty or duplicate selections', () => {
    expect(sanitizeValue('  combination  ')).toBe('combination')
    expect(sanitizeValue([' dry ', '', 'dry', 'sensitive '])).toEqual(['dry', 'sensitive'])
  })

  it('sanitizes every value in a profile patch', () => {
    expect(sanitizePatch({ name: '  Alex ', concerns: [' acne ', 'acne'] })).toEqual({
      name: 'Alex',
      concerns: ['acne'],
    })
  })
})

describe('shared business utilities', () => {
  it('calculates yearly subscription savings without dividing by zero', () => {
    expect(yearlySavingsPct(10, 90)).toBe(25)
    expect(yearlySavingsPct(0, 90)).toBe(0)
  })

  it('normalizes semicolon-delimited ingredient text', () => {
    expect(replaceSemicolonsWithCommas('water ; glycerin;niacinamide')).toBe(
      'water, glycerin, niacinamide',
    )
  })

  it.each(['https://beauty.example/product', 'http://localhost:8080/debug'])(
    'allows safe HTTP links: %s',
    (url) => {
      expect(isSafeHttpUrl(url)).toBe(true)
    },
  )

  it.each(['javascript:alert(1)', 'file:///private/data', 'not a url', '   '])(
    'rejects unsafe or malformed links: %s',
    (url) => {
      expect(isSafeHttpUrl(url)).toBe(false)
    },
  )
})
