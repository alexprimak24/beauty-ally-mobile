import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

import ErrorCard from '@/components/ui/ErrorCard'
import { SearchInput } from '@/components/ui/SearchInput'
import { scale } from '@/design/responsiveNew'
import { main } from '@/utils/i18n/keyConstants'

const addToRoutineText = {
  headerTitle: 'addToRoutine.headerTitle',
  loadingError: 'addToRoutine.loadingError',
  searchPlaceholder: 'addToRoutine.searchPlaceholder',
} as const

interface AddToRoutineHeaderProps {
  onBack: () => void
}

interface AddToRoutineSearchHeaderProps {
  hasError: boolean
  onQueryChange: (query: string) => void
}

export function AddToRoutineHeader({ onBack }: AddToRoutineHeaderProps) {
  const { t } = useTranslation(main)

  return (
    <View className="z-[100] bg-lightBg pb-3 pt-4">
      <View className="flex-row items-center justify-between px-4">
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.6}
          onPress={onBack}
          className="items-center justify-center border border-white bg-white/90"
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={scale(22)}
            color="#212529"
            style={{ marginRight: 2 }}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{t(addToRoutineText.headerTitle)}</Text>
        <View style={{ width: scale(40) }} />
      </View>
    </View>
  )
}

export function AddToRoutineSearchHeader({
  hasError,
  onQueryChange,
}: AddToRoutineSearchHeaderProps) {
  const { t } = useTranslation(main)

  return (
    <View className="px-4">
      <SearchInput
        placeholder={t(addToRoutineText.searchPlaceholder)}
        onQueryChange={onQueryChange}
        containerClassName="bg-white my-4"
        iconColor="#212529"
      />
      {hasError ? <ErrorCard message={t(addToRoutineText.loadingError)} /> : null}
    </View>
  )
}

const styles = {
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: scale(4),
    shadowOffset: { width: 0, height: scale(2) },
    elevation: 2,
  },
  title: {
    fontSize: scale(20),
    fontFamily: 'Quicksand-Bold',
    color: '#212529',
    letterSpacing: -0.5,
  },
} as const
