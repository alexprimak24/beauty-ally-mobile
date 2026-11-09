import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { GlassCloseButton } from '@/components/ui/GlassCloseButton'
import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { scanDetailsText } from '../constants'

export function ScanDetailsHeader() {
  const { t } = useTranslation(main)

  return (
    <View
      className="relative mb-6 mt-2 w-full items-center justify-center"
      style={{ height: scale(46) }}
    >
      <View className="absolute left-0 z-10">
        <GlassCloseButton zIndex={100} />
      </View>
      <Text className="text-center font-quicksandBold text-dark" style={{ fontSize: scale(22) }}>
        {t(scanDetailsText.headerTitle)}
      </Text>
    </View>
  )
}
