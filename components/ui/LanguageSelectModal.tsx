import type { Language } from '@/types/onboardingDataTypes'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { languageOptions } from '@/constants/onboarding/onboardingData'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import LoadingSpinner from './LoadingIndicator'

export interface LanguageSelectModalProps {
  visible: boolean
  selected?: string // language code
  languages?: Language[]
  onSelect?: (code: string) => void
  onClose?: () => void
  title?: string
}

// ---------- A pretty, soft row for each language
function LanguageRow({
  item,
  isSelected,
  onPress,
}: {
  item: Language
  isSelected: boolean
  onPress: () => void
}) {
  const { type } = useRTokens()

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    onPress()
  }
  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      className={`my-2 w-full rounded-2xl ${
        isSelected ? 'bg-dark' : 'border border-lightBlueBorder bg-whiteSemi dark:border-white/10'
      }`}
      style={{ overflow: 'hidden' }}
    >
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text
          style={{ fontSize: type.lg }}
          className={`font-iSansSB text-base ${isSelected ? 'text-white' : 'text-dark'}`}
        >
          {item.local}
        </Text>
        <Text
          style={{ fontSize: type.xl2 }}
          className={`${isSelected ? 'opacity-100' : 'opacity-90'}`}
        >
          {item.flag ?? '🌐'}
        </Text>
      </View>
    </Pressable>
  )
}

// ---------- The Modal
export const LanguageSelectModal: React.FC<
  LanguageSelectModalProps & {
    /** proportion of screen height the card can take (0..1) */
    maxHeightPct?: number
    /** iOS blur config */
    iosBlurIntensity?: number
    iosBlurTint?: 'light' | 'default' | 'dark'
    /** Android overlay color */
    androidOverlayColor?: string
    isUpdating?: boolean
  }
> = ({
  visible,
  selected = 'en',
  languages = languageOptions,
  onSelect,
  onClose,
  maxHeightPct = 0.54,
  iosBlurIntensity = 24,
  iosBlurTint = 'light',
  androidOverlayColor = 'rgba(33,37,41,0.25)',
  isUpdating,
}) => {
  const { type, sizes } = useRTokens()
  const { t } = useTranslation(components)
  // Animations
  const fade = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.92)).current
  const { height } = useWindowDimensions()
  const MAX_CARD_HEIGHT = Math.min(height * maxHeightPct, 620)

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, { toValue: 0.92, duration: 120, useNativeDriver: true }),
      ]).start()
    }
  }, [fade, scale, visible])

  const handleClose = () => {
    onClose?.()
  }

  const renderItem = ({ item }: { item: Language }) => (
    <LanguageRow
      item={item}
      isSelected={item.code === selected}
      onPress={() => onSelect?.(item.longCode)}
    />
  )

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Overlay (blur on iOS, color on Android) with fade */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={iosBlurIntensity}
            tint={iosBlurTint}
            style={{ flex: 1 }}
            // reducedTransparencyFallbackColor="rgba(250,250,250,0.95)"
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: androidOverlayColor }} />
        )}
      </Animated.View>

      {/* Tap outside to close */}
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />

      {/* Centered content */}
      <View className="flex-1 items-center justify-center">
        <Animated.View
          className="w-[88%] rounded-3xl bg-white/95"
          style={{ transform: [{ scale }], maxHeight: MAX_CARD_HEIGHT, overflow: 'hidden' }}
        >
          {/* Header */}
          <SafeAreaView className="mb-4 ">
            <View className="px-5 pb-2 pt-4">
              <Text style={{ fontSize: type.xl }} className=" font-iSansSB text-dark">
                {t('selectLanguage')}
              </Text>
            </View>

            {/* Close */}
            <Pressable
              onPress={handleClose}
              style={{ width: sizes.closeIconLng, height: sizes.closeIconLng }}
              className="absolute right-3 top-2.5 items-center justify-center rounded-full bg-black/5"
            >
              <Text style={{ fontSize: type.xl2 }}>×</Text>
            </Pressable>
          </SafeAreaView>

          {/* List */}
          <View className="px-4 pb-3" style={{ maxHeight: MAX_CARD_HEIGHT - 64 }}>
            <FlatList
              data={languages}
              renderItem={renderItem}
              keyExtractor={(language) => language.code}
              bounces={false}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              style={{ maxHeight: MAX_CARD_HEIGHT - 80 }}
              contentContainerStyle={{ paddingVertical: 6 }}
              keyboardShouldPersistTaps="handled"
            />

            {/* Footer hint */}
            <Text
              style={{ fontSize: type.xs }}
              className=" mb-1 mt-1 text-center font-iSansI text-dark/60"
            >
              {t('languageChangeNotice')}
            </Text>
          </View>

          {/* Blur + Loading overlay */}
          {isUpdating && (
            <View
              style={StyleSheet.absoluteFill}
              className="items-center justify-center bg-white/60"
            >
              <LoadingSpinner />
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}
