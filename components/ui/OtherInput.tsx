import { scale } from '@/design/responsiveNew'
import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Easing, Keyboard, TextInput } from 'react-native'

interface OtherInputProps {
  val: string
  onChange: (val: string) => void
  pHolder?: string
  minH?: number
}

function OtherInput({ val, onChange, pHolder, minH = 120 }: OtherInputProps) {
  const { type } = useRTokens()
  const { t } = useTranslation(components)
  const animatedHeight = useRef(new Animated.Value(120)).current

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardWillShow', () => {
      Animated.timing(animatedHeight, {
        toValue: 180,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start()
    })

    const hideSub = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(animatedHeight, {
        toValue: 120,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start()
    })

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [animatedHeight])

  const placeholder = pHolder ?? t('otherInput.placeholder')

  return (
    <Animated.View style={{ height: animatedHeight, marginTop: 16, marginBottom: 24 }}>
      <TextInput
        placeholder={placeholder}
        value={val}
        onChangeText={onChange}
        multiline
        numberOfLines={4}
        maxLength={120}
        textAlignVertical="top"
        className="h-[25%] bg-lightBg px-6 py-4"
        placeholderTextColor="#212529"
        style={{
          borderRadius: scale(20),
          minHeight: scale(minH),
          fontSize: type.base,
        }}
      />
    </Animated.View>
  )
}

export default OtherInput
