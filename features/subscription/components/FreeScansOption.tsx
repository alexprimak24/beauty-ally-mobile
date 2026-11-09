import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { isTablet, scale } from '@/design/responsiveNew'
import { paywallTheme } from '../theme'

interface FreeScansOptionProps {
  activated: boolean
  disabled: boolean
  offerText: string
  onChange: (selected: boolean) => void
  selected: boolean
  usedText: string
}

export function FreeScansOption({
  activated,
  disabled,
  offerText,
  onChange,
  selected,
  usedText,
}: FreeScansOptionProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={() => onChange(!selected)}
      style={[styles.container, activated && styles.disabledContainer]}
    >
      <View style={styles.textContainer}>
        <View style={[styles.iconBackground, activated && styles.disabledIconBackground]}>
          <Ionicons
            name={activated ? 'alert-circle' : 'gift'}
            size={scale(18)}
            color={activated ? '#9CA3AF' : paywallTheme.accentText}
          />
        </View>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          numberOfLines={1}
          style={[styles.text, activated && styles.disabledText]}
        >
          {activated ? usedText : offerText}
        </Text>
      </View>

      <Switch
        accessible={false}
        disabled={disabled}
        ios_backgroundColor="#E5E7EB"
        pointerEvents="none"
        thumbColor={selected ? paywallTheme.accent : '#fff'}
        trackColor={{ false: '#E5E7EB', true: paywallTheme.textMain }}
        value={selected}
        style={[styles.switch, activated && styles.disabledSwitch]}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFB',
    borderWidth: 1,
    borderColor: '#E7EAF0',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  disabledContainer: {
    backgroundColor: '#F3F4F6',
    opacity: 0.85,
    borderColor: paywallTheme.borderInactive,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  iconBackground: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(20),
    backgroundColor: paywallTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  disabledIconBackground: {
    backgroundColor: '#E5E7EB',
  },
  text: {
    color: paywallTheme.textMain,
    fontFamily: 'Quicksand-SemiBold',
    fontSize: scale(15),
    lineHeight: scale(18),
    letterSpacing: -0.1,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  switch: {
    transform: [{ scale: isTablet ? 1.2 : 0.9 }],
  },
  disabledSwitch: {
    opacity: 0.55,
  },
})
