import LottieView from 'lottie-react-native'
import React from 'react'
import { useRTokens } from '@/design/useRTokens'

export default function LoadingSpinner({ isBig }: { isBig?: boolean }) {
  const { sizes } = useRTokens()
  return (
    <LottieView
      source={require(`@/assets/animations/loading.json`)}
      autoPlay
      loop
      style={{
        width: isBig ? sizes.spinner2 : sizes.spinner,
        height: isBig ? sizes.spinner2 : sizes.spinner,
      }}
    />
  )
}
