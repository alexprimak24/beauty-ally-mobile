import { clsx } from 'clsx'
import React, { useEffect, useRef } from 'react'
import {
  ActivityIndicator,
  Animated,
  Easing,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native'
import { useRTokens } from '@/design/useRTokens'

interface PrimaryBtnProps {
  onPress: () => void
  text: string
  btnHeight?: number
  roundness?: number
  disabled?: boolean
  loading?: boolean
  testID?: string
  accessibilityLabel?: string
  keyboardOffset?: number // if you actually want to move with keyboard
}

function PrimaryBtn({
  onPress,
  text,
  btnHeight = 60,
  roundness = 9999,
  disabled = false,
  loading = false,
  testID,
  accessibilityLabel,
  keyboardOffset = 0,
}: PrimaryBtnProps) {
  const translateY = useRef(new Animated.Value(0)).current
  const { type } = useRTokens()

  useEffect(() => {
    if (!keyboardOffset) return
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvt, () => {
      Animated.timing(translateY, {
        toValue: -keyboardOffset,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start()
    })
    const hideSub = Keyboard.addListener(hideEvt, () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start()
    })
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [keyboardOffset, translateY])

  const handleOnPress = () => {
    if (disabled || loading) return
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    onPress()
  }

  const isDisabled = disabled || loading

  return (
    <Animated.View style={{ transform: [{ translateY }], width: '100%' }}>
      <TouchableOpacity
        onPress={handleOnPress}
        className={clsx(isDisabled && 'opacity-50', 'w-full items-center justify-center bg-dark')}
        style={{ height: btnHeight, borderRadius: roundness }}
        disabled={isDisabled}
        testID={testID}
        accessibilityLabel={accessibilityLabel ?? text}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="font-iSansSB text-white" style={{ fontSize: type.xl }}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export default PrimaryBtn
