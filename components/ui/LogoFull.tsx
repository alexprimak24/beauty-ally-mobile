import { icons } from '@/constants/icons'
import { useRTokens } from '@/design/useRTokens'
import React from 'react'
import { Image, Text, View } from 'react-native'

function LogoFull() {
  const { type, sizes } = useRTokens()
  return (
    <View className="flex-row items-center gap-3">
      <Image
        source={icons.splashFull}
        tintColor="#212529"
        style={{ width: sizes.logoSize, height: sizes.logoSize }}
      />
      <Text className="font-quicksandBold" style={{ fontSize: type.lg }}>
        Beauty Ally
      </Text>
    </View>
  )
}

export default LogoFull
