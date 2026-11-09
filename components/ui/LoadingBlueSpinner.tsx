import { useRTokens } from '@/design/useRTokens'
import LottieView from 'lottie-react-native'
import React from 'react'

export default function LoadingBlueSpinner() {
  const { sizes } = useRTokens()
  return (
    <LottieView
      source={require(`@/assets/animations/loading.json`)}
      autoPlay
      loop
      colorFilters={[
        { keypath: 'icon', color: '#def2ff' }, // bright blue
        { keypath: 'icon 2', color: '#def2ff' }, // second layer
      ]}
      style={{ width: sizes.spinner2, height: sizes.spinner2 }}
    />
  )
}
