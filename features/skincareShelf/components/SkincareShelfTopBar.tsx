import { scale } from '@/design/responsiveNew'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { skincareShelfColors } from '../constants'
import { StreakIndicator } from './StreakIndicator'

interface SkincareShelfTopBarProps {
  dateLabel: string
  onAddProduct: () => void
  onBack: () => void
  onJumpToToday: () => void
  streak: number
}

export function SkincareShelfTopBar({
  dateLabel,
  onAddProduct,
  onBack,
  onJumpToToday,
  streak,
}: SkincareShelfTopBarProps) {
  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingTop: scale(12),
        paddingBottom: scale(12),
        backgroundColor: skincareShelfColors.lightBg,
        zIndex: 100,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onBack}
        style={{
          width: scale(44),
          height: scale(44),
          borderRadius: scale(22),
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={skincareShelfColors.dark}
          style={{ marginRight: 2 }}
        />
      </TouchableOpacity>

      <View
        style={{
          ...StyleSheet.absoluteFill,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
        pointerEvents="box-none"
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }} pointerEvents="auto">
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onJumpToToday}
            style={{ marginRight: scale(6) }}
          >
            <Text
              style={{
                fontSize: scale(22),
                fontFamily: 'Quicksand-Bold',
                color: skincareShelfColors.dark,
                letterSpacing: -0.5,
              }}
            >
              {dateLabel}
            </Text>
          </TouchableOpacity>
          <StreakIndicator
            streak={streak}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onAddProduct}
        style={{
          width: scale(44),
          height: scale(44),
          borderRadius: scale(22),
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="add" size={scale(26)} color={skincareShelfColors.dark} />
      </TouchableOpacity>
    </View>
  )
}
