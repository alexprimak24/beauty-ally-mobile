import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'

import { PRIVACY_POLICY, TERMS_OF_USE } from '@/constants/usefulLinks'
import { scale } from '@/design/responsiveNew'
import { paywallTheme } from '../theme'

interface PaywallFooterProps {
  ctaDisabled: boolean
  ctaText: string
  currentPlanSelected: boolean
  legalText: string
  onContinue: () => void
  onRestore: () => void
  privacyText: string
  restoreText: string
  termsText: string
}

function openExternal(url: string) {
  void Linking.openURL(url).catch((error) => {
    if (__DEV__) console.warn('Failed to open paywall link:', error)
  })
}

export function PaywallFooter({
  ctaDisabled,
  ctaText,
  currentPlanSelected,
  legalText,
  onContinue,
  onRestore,
  privacyText,
  restoreText,
  termsText,
}: PaywallFooterProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        disabled={ctaDisabled}
        onPress={onContinue}
        style={[styles.ctaButton, currentPlanSelected && styles.disabledCta]}
      >
        <Text style={[styles.ctaText, currentPlanSelected && styles.disabledCtaText]}>
          {ctaText}
        </Text>
      </Pressable>

      <View style={styles.links}>
        <Pressable accessibilityRole="link" onPress={() => openExternal(TERMS_OF_USE)}>
          <Text style={styles.linkText}>{termsText}</Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => openExternal(PRIVACY_POLICY)}>
          <Text style={styles.linkText}>{privacyText}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onRestore}>
          <Text style={styles.linkText}>{restoreText}</Text>
        </Pressable>
      </View>

      <Text style={styles.legalText}>{legalText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 4,
  },
  ctaButton: {
    minHeight: scale(54),
    width: '100%',
    backgroundColor: paywallTheme.textMain,
    borderRadius: scale(29),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  disabledCta: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: scale(17),
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
  },
  disabledCtaText: {
    color: '#9CA3AF',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 6,
  },
  linkText: {
    color: '#9CA3AF',
    fontSize: scale(13),
    fontFamily: 'Quicksand-SemiBold',
  },
  legalText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: scale(12),
    fontFamily: 'Quicksand-Medium',
  },
})
