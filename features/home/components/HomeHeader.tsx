import React from 'react'
import { View } from 'react-native'
import LogoFull from '@/components/ui/LogoFull'
import ProfilePicture from '@/components/ui/ProfilePicture'

function HomeHeader({ isRedirect }: { isRedirect?: boolean }) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <LogoFull />
      <ProfilePicture isRedirect={isRedirect} />
    </View>
  )
}

export default HomeHeader
