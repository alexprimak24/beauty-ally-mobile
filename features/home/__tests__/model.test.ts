/// <reference types="jest" />

import type { ProductChecksResponse } from '@/services/productChecks'
import { getRecentProductEntries } from '../model'

function page(ids: string[]): ProductChecksResponse {
  return {
    entries: ids.map((id) => ({ id })) as ProductChecksResponse['entries'],
    hasNextPage: false,
    page: 1,
    totalItems: ids.length,
    totalPages: 1,
  }
}

describe('home model', () => {
  it('selects the first three entries across pages by default', () => {
    const entries = getRecentProductEntries([page(['first', 'second']), page(['third', 'fourth'])])

    expect(entries.map((entry) => entry.id)).toEqual(['first', 'second', 'third'])
  })

  it('supports a custom limit and empty data', () => {
    expect(getRecentProductEntries([page(['first', 'second'])], 1)).toHaveLength(1)
    expect(getRecentProductEntries(undefined)).toEqual([])
    expect(getRecentProductEntries([page(['first'])], 0)).toEqual([])
  })
})
