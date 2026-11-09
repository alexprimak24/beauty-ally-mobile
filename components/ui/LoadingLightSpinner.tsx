import LottieView from 'lottie-react-native'
import React from 'react'
import { useRTokens } from '@/design/useRTokens'

export default function LoadingLightSpinner() {
  const { sizes } = useRTokens()
  return (
    <LottieView
      source={require(`@/assets/animations/loading.json`)}
      autoPlay
      loop
      colorFilters={[
        { keypath: 'icon', color: '#f4f6f8' }, // bright blue
        { keypath: 'icon 2', color: '#f4f6f8' }, // second layer
      ]}
      style={{ width: sizes.spinner2, height: sizes.spinner2 }}
    />
  )
}
