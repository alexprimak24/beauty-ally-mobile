import { PixelRatio, useWindowDimensions } from 'react-native'

const REF = 402
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))

export type BP = 'phone' | 'tablet' | 'large'
const getBP = (w: number): BP => (w >= 1024 ? 'large' : w >= 600 ? 'tablet' : 'phone')

export function useResponsive() {
  const { width, height } = useWindowDimensions()
  const shortest = Math.min(width, height)
  const raw = shortest / REF
  const curved = raw ** 0.6
  const factor = clamp(curved, 0.9, 1.35)

  const px = (v: number, m = 1) => PixelRatio.roundToNearestPixel(v * m)

  // scale factors
  const fontF = factor
  const spaceF = 0.85 + (factor - 1) * 0.7
  const radiusF = 0.8 + (factor - 1) * 0.5
  const sizeF = 0.9 + (factor - 1) * 0.6

  // scaling fns
  const scaleFont = (v: number) => px(v, fontF)
  const scaleSpace = (v: number) => px(v, spaceF)
  const scaleRadius = (v: number) => px(v, radiusF)
  const scaleSize = (v: number) => px(v, sizeF)

  // layout helpers
  const bp = getBP(shortest)
  const containerMaxW = bp === 'phone' ? undefined : bp === 'tablet' ? 640 : 760
  const gutterX =
    bp === 'phone' ? scaleSpace(16) : bp === 'tablet' ? scaleSpace(20) : scaleSpace(24)
  const gutterY = scaleSpace(12)
  const footerH = px(64, sizeF) // nominal sticky footer/CTA height (excl. safe-area)

  return {
    bp,
    containerMaxW,
    gutterX,
    gutterY,
    footerH,
    scaleFont,
    scaleSpace,
    scaleRadius,
    scaleSize,
  }
}
