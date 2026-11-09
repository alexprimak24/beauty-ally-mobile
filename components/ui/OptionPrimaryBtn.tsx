import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { clsx } from 'clsx'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

interface OptionPrimaryBtnProps {
  onPress: () => void
  focused: boolean
  text: string
  btnHeight?: number
  roundness?: number
  textSize?: number
  explanation?: string | null
  marginBtm?: number
  accessibilityLabel?: string
  disabled?: boolean
}

function OptionPrimaryBtn({
  onPress,
  focused,
  text,
  explanation,
  marginBtm = 28,
  btnHeight = 78,
  roundness = 20,
  accessibilityLabel,
  disabled = false,
}: OptionPrimaryBtnProps) {
  const { type } = useRTokens()

  const handleOnPress = () => {
    if (disabled) return
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      activeOpacity={0.9}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? text}
      className={clsx(
        focused ? 'bg-dark' : 'bg-lightBg',
        disabled && 'opacity-60',
        'w-full flex-col items-center justify-center',
      )}
      style={{
        height: scale(btnHeight),
        borderRadius: scale(roundness),
        marginBottom: scale(marginBtm),
      }}
    >
      <Text
        className={clsx(
          focused ? 'text-white' : 'text-dark',
          'text-center font-iSansM font-medium',
        )}
        style={{ fontSize: type.xl2 }}
      >
        {text}
      </Text>

      {!!explanation && (
        <Text
          className={focused ? 'text-white/70' : 'text-darkDisabled'}
          style={{ fontSize: type.xs }}
        >
          {explanation}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export default OptionPrimaryBtn
