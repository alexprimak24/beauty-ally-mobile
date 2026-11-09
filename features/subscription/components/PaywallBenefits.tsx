import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeIn } from 'react-native-reanimated'

import { scale } from '@/design/responsiveNew'
import type { SelectableSubscriptionPlan } from '../model'
import { paywallTheme } from '../theme'

interface PaywallBenefitsProps {
  benefits: string[]
  loadingText: string
  packagesReady: boolean
  plan: SelectableSubscriptionPlan
}

export function PaywallBenefits({
  benefits,
  loadingText,
  packagesReady,
  plan,
}: PaywallBenefitsProps) {
  return (
    <View style={styles.container}>
      {benefits.map((benefit, index) => (
        <Animated.View
          entering={FadeIn.delay(index * 90)}
          key={`${benefit}-${plan}`}
          style={styles.row}
        >
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={scale(12)} color={paywallTheme.textMain} />
          </View>
          <Text style={styles.text}>{benefit}</Text>
        </Animated.View>
      ))}
      {!packagesReady ? <Text style={styles.loadingText}>{loadingText}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    backgroundColor: '#FAFAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F3F5',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: paywallTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flexShrink: 1,
    color: '#374151',
    fontSize: scale(14),
    fontFamily: 'Quicksand-SemiBold',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: scale(13),
    marginTop: 6,
    fontFamily: 'Quicksand-Medium',
  },
})
