import type { ProductChecksResponse } from '@/services/productChecks'

export function getRecentProductEntries(pages: ProductChecksResponse[] | undefined, limit = 3) {
  if (limit <= 0) return []

  return pages?.flatMap((page) => page.entries).slice(0, limit) ?? []
}
