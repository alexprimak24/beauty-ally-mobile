import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { scanDetailsText } from '../constants'

interface PurchaseLinkInfoModalProps {
  onClose: () => void
  visible: boolean
}

export function PurchaseLinkInfoModal({ onClose, visible }: PurchaseLinkInfoModalProps) {
  const { t } = useTranslation(main)

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center">
        <BlurView intensity={40} tint="dark" className="absolute inset-0" />
        <Pressable accessibilityRole="button" className="absolute inset-0" onPress={onClose} />
        <View className="m-6 w-[85%] items-center rounded-[32px] bg-white p-6 shadow-xl">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-lightBlue">
            <Ionicons name="link" size={28} color="#212529" />
          </View>
          <Text className="mb-3 text-center font-quicksandBold text-xl text-dark">
            {t(scanDetailsText.modal.title)}
          </Text>
          <Text
            className="mb-6 text-center font-quicksandMedium text-darkDisabled"
            style={{ fontSize: scale(15), lineHeight: scale(22) }}
          >
            {t(scanDetailsText.modal.description)}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="w-full items-center rounded-full bg-dark py-4"
          >
            <Text className="font-quicksandBold text-white" style={{ fontSize: scale(16) }}>
              {t(scanDetailsText.modal.button)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
