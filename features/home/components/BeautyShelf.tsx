import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import MyBeautyShelfTitle from './MyBeautyShelfTitle'
import MyFavoritesBtn from './MyFavoritesBtn'
import MySkincareBtn from './MySkincareBtn'

function BeautyShelf() {
  const router = useRouter()
  function handleFavoritesPress() {
    router.push('/favorites')
  }

  function handleSkincarePress() {
    router.push('/skincareShelf')
  }

  return (
    <View className="mt-5 w-full">
      <MyBeautyShelfTitle />
      <View className="mt-4 w-full flex-row gap-5">
        <MySkincareBtn onPress={handleSkincarePress} />
        <MyFavoritesBtn onPress={handleFavoritesPress} />
      </View>
    </View>
  )
}

export default BeautyShelf
