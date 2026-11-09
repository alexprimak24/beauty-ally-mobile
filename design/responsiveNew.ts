import { Dimensions, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')

export const SCREEN_WIDTH = width
export const SCREEN_HEIGHT = height
export const isTablet = width > 768

// CHANGE: Base width is now 402 (iPhone 16 Pro) instead of 375
const BASE_WIDTH = 402

export function scale(size: number) {
  const scaleFactor = width / BASE_WIDTH
  // Cap the scale at 1.25 on tablets to keep UI elements from looking "clownishly" large
  // On a 375px phone, this will return approx 0.93x (scaling down)
  const cappedScale = Math.min(scaleFactor, 1.25)
  return Math.round(PixelRatio.roundToNearestPixel(size * cappedScale))
}

export const PAYWALL_VIDEO_HEIGHT = height * (isTablet ? 0.35 : 0.4)
