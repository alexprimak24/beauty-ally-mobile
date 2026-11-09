import type { Language } from '@/types/onboardingDataTypes'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { languageOptions } from '@/constants/onboarding/onboardingData'
import { useRTokens } from '@/design/useRTokens'
import { LanguageSelectModal } from './LanguageSelectModal'

export function LanguagePickerButton({
  // NEW: allow controlled value (code like "EN", "ES", ...)
  value, // ← controlled prop (optional)
  initial = 'EN', // ← uncontrolled default
  languages = languageOptions,
  onChange, // (longCode: string) => void
  top = 8,
  right = 12,
  showCode = true,
  floating = true,
  isUpdating = false,
}: {
  value?: string // ← add this
  initial?: string
  languages?: Language[]
  onChange?: (longCode: string) => void
  top?: number
  right?: number
  showCode?: boolean
  floating?: boolean
  isUpdating?: boolean
}) {
  const insets = useSafeAreaInsets()
  const { type } = useRTokens()

  // Internal state only used when UNcontrolled
  const [internalCode, setInternalCode] = useState(initial)

  // Keep internal state in sync if initial changes (still uncontrolled)
  useEffect(() => {
    if (value === undefined) setInternalCode(initial)
  }, [initial, value])

  // Decide which code to display (controlled vs uncontrolled)
  const displayedCode = value !== undefined ? value : internalCode

  const current = useMemo(
    () => languages.find((l) => l.code === displayedCode),
    [languages, displayedCode],
  )

  const pressableStyle = floating
    ? {
        position: 'absolute' as const,
        top: insets.top + top,
        right,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }
    : {
        paddingHorizontal: 12,
        paddingVertical: 10,
      }

  const [visible, setVisible] = useState(false)

  function handlePress() {
    setVisible(true)
  }

  function onLanguageSelect(longCode: string) {
    const nextCode = languageOptions.find((lngObj) => lngObj.longCode === longCode)?.code ?? 'EN'

    // Update internal state only if UNcontrolled
    if (value === undefined) setInternalCode(nextCode)

    setVisible(false)
    onChange?.(longCode) // parent handles i18n.changeLanguage, etc.
  }

  return (
    <>
      {/* Trigger */}
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Change language"
        className={`z-50 rounded-full bg-whiteSemi ${floating ? '' : 'self-start'}`}
        style={pressableStyle}
      >
        <View className="flex-row items-center gap-x-2">
          <Text style={{ fontSize: type.base }}>{current?.flag ?? '🌐'}</Text>
          {showCode && (
            <Text
              className="font-quicksandSemiBold uppercase text-dark/90"
              style={{ fontSize: type.xs }}
            >
              {displayedCode}
            </Text>
          )}
        </View>
      </Pressable>

      {/* Modal */}
      <LanguageSelectModal
        visible={visible}
        selected={displayedCode}
        languages={languages}
        onSelect={(c: string) => onLanguageSelect(c)}
        onClose={() => setVisible(false)}
        isUpdating={isUpdating}
      />
    </>
  )
}
