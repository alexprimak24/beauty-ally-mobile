import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { scanDetailsText } from '../constants'

interface ScanDetailsFieldsProps {
  link: string
  name: string
  onLinkChange: (value: string) => void
  onNameChange: (value: string) => void
  onOpenLinkInfo: () => void
  shouldHighlightUrl: boolean
}

export function ScanDetailsFields({
  link,
  name,
  onLinkChange,
  onNameChange,
  onOpenLinkInfo,
  shouldHighlightUrl,
}: ScanDetailsFieldsProps) {
  const { t } = useTranslation(main)

  return (
    <>
      <View
        className="rounded-[24px] border border-lightBg bg-white px-5 py-3"
        style={styles.field}
      >
        <Text className="mb-1 font-quicksandMedium text-xs text-darkDisabled">
          {t(scanDetailsText.inputs.nameLabel)}
        </Text>
        <TextInput
          maxLength={120}
          onChangeText={onNameChange}
          placeholder={t(scanDetailsText.inputs.namePlaceholder)}
          placeholderTextColor="rgba(33,37,41,0.4)"
          value={name}
          className="p-0 font-quicksandBold text-dark"
          style={{ fontSize: scale(16) }}
        />
      </View>

      <View
        className={`rounded-[24px] border bg-white px-5 py-3 ${shouldHighlightUrl ? 'border-lightBlue' : 'border-lightBg'}`}
        style={shouldHighlightUrl ? styles.highlightedField : styles.field}
      >
        <View className="mb-1 flex-row items-center justify-between">
          <Text
            className={`${shouldHighlightUrl ? 'text-dark' : 'text-darkDisabled'} font-quicksandMedium text-xs`}
          >
            {t(scanDetailsText.inputs.linkLabel)}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onOpenLinkInfo}
          >
            <Ionicons
              name="information-circle-outline"
              size={scale(18)}
              color="#212529"
              style={{ opacity: 0.6 }}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          onChangeText={onLinkChange}
          placeholder={t(scanDetailsText.inputs.linkPlaceholder)}
          placeholderTextColor="rgba(33,37,41,0.4)"
          value={link}
          autoCapitalize="none"
          keyboardType="url"
          className="p-0 font-quicksandBold text-dark"
          style={{ fontSize: scale(16) }}
        />
      </View>
    </>
  )
}

const styles = {
  field: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  highlightedField: {
    shadowColor: '#def2ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 1,
  },
} as const
