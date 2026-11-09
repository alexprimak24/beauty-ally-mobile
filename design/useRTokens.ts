import { useMemo } from 'react'
import { useResponsive } from './scale'
import { fontType, radii, sizes, space } from './tokens' // ⬅️ no 'layout' import

export function useRTokens() {
  const r = useResponsive()

  const type = useMemo(() => mapVals(fontType, r.scaleFont), [r.scaleFont])
  const mSpace = useMemo(() => mapVals(space, r.scaleSpace), [r.scaleSpace])
  const mRadii = useMemo(() => mapVals(radii, r.scaleRadius), [r.scaleRadius])
  const mSizes = useMemo(() => mapVals(sizes, r.scaleSize), [r.scaleSize])

  // Build responsive layout tokens derived from useResponsive
  const layout = useMemo(
    () => ({
      pagePaddingX: r.gutterX,
      pagePaddingY: r.gutterY,
      contentMaxW: r.containerMaxW, // cap width on tablets/large
      stickyFooterH: r.footerH, // nominal CTA bar height (excl. safe-area)
      gapSm: r.scaleSpace(8),
      gapMd: r.scaleSpace(12),
      gapLg: r.scaleSpace(16),
    }),
    [r],
  )

  return {
    bp: r.bp,
    type,
    space: mSpace,
    radii: mRadii,
    sizes: mSizes,
    layout,
  }
}

function mapVals<T extends Record<string, number>>(obj: T, fn: (v: number) => number): T {
  const out: Record<string, number> = {}
  for (const k in obj) out[k] = fn(obj[k])
  return out as T
}
