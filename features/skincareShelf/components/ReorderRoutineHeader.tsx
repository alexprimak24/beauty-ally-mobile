import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'
import { reorderRoutineText, skincareShelfColors } from '../constants'

interface ReorderRoutineHeaderProps {
  canSave: boolean
  isSaving: boolean
  onBack: () => void
  onSave: () => void
}

export function ReorderRoutineHeader({
  canSave,
  isSaving,
  onBack,
  onSave,
}: ReorderRoutineHeaderProps) {
  const { t } = useTranslation(main)

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.6} onPress={onBack} style={styles.backButton}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={skincareShelfColors.dark}
          style={{ marginRight: 2 }}
        />
      </TouchableOpacity>

      <View pointerEvents="none" style={styles.titleContainer}>
        <Text style={styles.title}>{t(reorderRoutineText.headerTitle)}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!canSave || isSaving}
        onPress={onSave}
        style={[styles.saveButton, { backgroundColor: canSave ? '#212529' : '#D1D1D6' }]}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Ionicons name="checkmark" size={scale(24)} color="#FFF" />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(12),
    backgroundColor: skincareShelfColors.lightBg,
    zIndex: 100,
  },
  backButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: scale(22),
    fontFamily: 'Quicksand-Bold',
    color: skincareShelfColors.dark,
    letterSpacing: -0.5,
  },
  saveButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
})
