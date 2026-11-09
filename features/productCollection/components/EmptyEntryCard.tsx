import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import { images } from '@/constants/images'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import PressEffectWrapper from '@/components/ui/PressEffectWrapper'

interface EmptyEntryCardProps {
  isSearch?: boolean
  query?: string
}

export default function EmptyEntryCard({ isSearch = false, query = '' }: EmptyEntryCardProps) {
  const router = useRouter()
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(components)

  return (
    <View className="mb-4 mt-6 flex-1 items-center justify-start px-6">
      <Image
        source={images.entryEmpty}
        style={{ marginBottom: 24, width: sizes.emtryCardW, height: sizes.emtryCardH }}
        resizeMode="contain"
      />

      <Text
        className="mb-4 text-center font-quicksandSemiBold text-dark"
        style={{ fontSize: type.lg }}
      >
        {isSearch ? t('emptyEntry.titleSearch', { query }) : t('emptyEntry.titleNone')}
      </Text>

      {isSearch ? (
        <Text
          className="mb-4 text-center font-quicksand text-dark/70"
          style={{ fontSize: type.base }}
        >
          {t('emptyEntry.hintSearch')}
        </Text>
      ) : (
        <>
          <Text
            className="mb-4 text-center font-quicksand text-dark/70"
            style={{ fontSize: type.base }}
          >
            {t('emptyEntry.hintNone')}
          </Text>
          <PressEffectWrapper
            onPress={() => router.push('/scan?side=front')}
            containerClassName="bg-dark px-6 py-4 rounded-full flex-row items-center"
            className="flex-row items-center justify-center"
            fillAll={false}
          >
            <Ionicons name="scan" size={sizes.scanIcon} color="#fff" />
            <Text
              className="ml-2 font-quicksandSemiBold text-white"
              style={{ fontSize: type.base }}
            >
              {t('emptyEntry.startScan')}
            </Text>
          </PressEffectWrapper>
        </>
      )}
    </View>
  )
}
