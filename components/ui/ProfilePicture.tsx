import { useUser as useUserClerk } from '@clerk/expo'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { WARM_BLURHASH } from '@/constants/blurHash'
import { useUser } from '@/hooks/useGetUser'
import { selectPfpType } from '@/utils/selectPfpType'
import PrimaryRoundBtn from './PrimaryRoundBtn'

function ProfilePicture({ isRedirect }: { isRedirect?: boolean }) {
  const router = useRouter()
  const { user: clerkUser } = useUserClerk() // <- get Clerk user
  const { data: user } = useUser()

  const fallbackLocal = selectPfpType('male')

  // Prefer your DB PFP, then Clerk's imageUrl, then local gender-based asset
  const pfpSource = isRedirect
    ? fallbackLocal
    : user?.profile?.profilePicture
      ? { uri: user.profile.profilePicture }
      : clerkUser?.imageUrl
        ? { uri: clerkUser.imageUrl }
        : selectPfpType(user?.profile?.gender ?? '')

  return (
    <PrimaryRoundBtn onPress={() => router.push('/profile')}>
      <Image
        source={pfpSource}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 1000,
          borderWidth: 2,
          borderColor: '#def2ff',
        }}

        className="h-full w-full rounded-full border-2 border-lightBlue"
        contentFit="cover"
        placeholder={WARM_BLURHASH}
        transition={100}
        cachePolicy="memory-disk"
      />
    </PrimaryRoundBtn>
  )
}

export default ProfilePicture
