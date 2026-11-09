// components/WelcomeUser.tsx
import type { ReactNode } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { useRTokens } from '@/design/useRTokens'
import { useUser } from '@/hooks/useGetUser'
import { getComplimentRotated, mapProfileGenderToKey } from '@/utils/getCompliment'

interface WelcomeUserProps {
  startText: string
  className?: string
  containerClassName?: string
  right?: ReactNode
  children?: ReactNode
  variant?: 'primary' | 'secondary'
}

function WelcomeUser({
  startText,
  className,
  containerClassName,
  right,
  children,
  variant = 'primary',
}: WelcomeUserProps) {
  const { data: user } = useUser()
  const { t } = useTranslation('main')
  const { type } = useRTokens()

  // pull name & gender from your profile object (adjust paths if needed)
  const name = user?.profile?.name ?? ''
  const genderKey = mapProfileGenderToKey(user?.profile?.gender)

  const compliment = getComplimentRotated(t, genderKey)

  const welcomeUserStyles = {
    primary: { fontSize: type.xl },
    secondary: { fontSize: type.xl2 },
  }
  const { fontSize } = welcomeUserStyles[variant] ?? welcomeUserStyles.primary

  return (
    <View className={`mt-8 w-full flex-row items-start ${containerClassName || ''}`}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text
          numberOfLines={3}
          className={`${className || ''} font-quicksandBold leading-tight text-dark`}
          style={{ fontSize }}
        >
          {startText}{' '}
          <Text className="font-quicksandBold">
            {compliment} {name}!
          </Text>
        </Text>
      </View>

      {/* <View style={{ width: 48, alignItems: 'flex-end', justifyContent: 'center' }}> */}
      {right ?? children}
      {/* </View> */}
    </View>
  )
}

export default WelcomeUser
