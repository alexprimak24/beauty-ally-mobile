/// <reference types="jest" />

import type { ProductChecksResponse } from '@/services/productChecks'
import { flattenProductCollectionPages, shouldLoadInitialNextPage } from '../model'

function page(ids: string[], hasNextPage: boolean): ProductChecksResponse {
  return {
    entries: ids.map((id) => ({ id })) as ProductChecksResponse['entries'],
    hasNextPage,
    page: 1,
    totalItems: ids.length,
    totalPages: 1,
  }
}

describe('product collection model', () => {
  it('flattens paginated product entries', () => {
    const entries = flattenProductCollectionPages([
      page(['first', 'second'], true),
      page(['third'], false),
    ])

    expect(entries.map((entry) => entry.id)).toEqual(['first', 'second', 'third'])
  })

  it('loads the second page once the first page settles with more data', () => {
    expect(
      shouldLoadInitialNextPage({
        isFetchingNextPage: false,
        isLoading: false,
        pages: [page(['first'], true)],
      }),
    ).toBe(true)

    expect(
      shouldLoadInitialNextPage({
        isFetchingNextPage: true,
        isLoading: false,
        pages: [page(['first'], true)],
      }),
    ).toBe(false)
  })
})
