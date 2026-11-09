import LottieView from 'lottie-react-native'
import React from 'react'
import { useRTokens } from '@/design/useRTokens'

export default function LoadingSecondarySpinner() {
  const { sizes } = useRTokens()
  return (
    <LottieView
      source={require(`@/assets/animations/loading-secondary.json`)}
      autoPlay
      loop
      style={{ width: sizes.lottieLoadingSeconary, height: sizes.lottieLoadingSeconary }}
    />
  )
}
