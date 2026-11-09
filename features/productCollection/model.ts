import type { ProductChecksResponse } from '@/services/productChecks'

export function flattenProductCollectionPages(pages: ProductChecksResponse[] | undefined) {
  return pages?.flatMap((page) => page.entries) ?? []
}

export function shouldLoadInitialNextPage({
  isFetchingNextPage,
  isLoading,
  pages,
}: {
  isFetchingNextPage: boolean
  isLoading: boolean
  pages: ProductChecksResponse[] | undefined
}) {
  return !isLoading && !isFetchingNextPage && pages?.length === 1 && pages[0]?.hasNextPage === true
}
