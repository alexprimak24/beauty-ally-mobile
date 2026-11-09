import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { scale } from '@/design/responsiveNew'
import type { SelectableSubscriptionPlan } from '../model'
import { paywallTheme } from '../theme'

interface PaywallPlanCardProps {
  billingText: string
  currentBadgeText: string
  equivalent?: string | null
  equivalentPeriod?: string
  hasIntro?: boolean
  isCurrent: boolean
  isSelected: boolean
  mainPrice: string
  name: string
  onSelect: (plan: SelectableSubscriptionPlan) => void
  period: string
  plan: SelectableSubscriptionPlan
  specialBadgeText?: string
}

export function PaywallPlanCard({
  billingText,
  currentBadgeText,
  equivalent,
  equivalentPeriod,
  hasIntro = false,
  isCurrent,
  isSelected,
  mainPrice,
  name,
  onSelect,
  period,
  plan,
  specialBadgeText,
}: PaywallPlanCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      onPress={() => onSelect(plan)}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      {isCurrent ? (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>{currentBadgeText}</Text>
        </View>
      ) : null}

      {hasIntro && specialBadgeText ? (
        <View style={styles.specialBadge}>
          <Ionicons name="sparkles" size={scale(10)} color={paywallTheme.textMain} />
          <Text style={styles.specialBadgeText}>{specialBadgeText}</Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <Text style={[styles.name, isSelected && styles.selectedName]}>{name}</Text>
        <View style={styles.priceWrapper}>
          <Text style={styles.mainPrice}>{mainPrice}</Text>
          <Text style={styles.period}>{period}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {equivalent && equivalentPeriod ? (
          <View style={styles.equivalentContainer}>
            <Text style={styles.equivalentText}>
              {equivalent} /{equivalentPeriod}
            </Text>
          </View>
        ) : null}
        <Text style={styles.billingText}>{billingText}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F3F5',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  selectedCard: {
    borderColor: paywallTheme.accent,
    backgroundColor: '#F6FDFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    flexShrink: 1,
    fontSize: scale(16),
    color: paywallTheme.textMuted,
    fontFamily: 'Quicksand-SemiBold',
  },
  selectedName: {
    color: paywallTheme.textMain,
    fontFamily: 'Quicksand-Bold',
  },
  priceWrapper: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mainPrice: {
    color: paywallTheme.textMain,
    fontSize: scale(22),
    fontFamily: 'Quicksand-Bold',
    letterSpacing: -0.4,
  },
  period: {
    color: paywallTheme.textMuted,
    fontSize: scale(14),
    fontFamily: 'Quicksand-Medium',
    marginLeft: 4,
  },
  footer: {
    marginTop: 8,
  },
  equivalentContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#DDF7F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  equivalentText: {
    color: paywallTheme.textMain,
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
  },
  billingText: {
    color: paywallTheme.textMuted,
    fontSize: scale(13),
    fontFamily: 'Quicksand-Medium',
  },
  specialBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: paywallTheme.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialBadgeText: {
    color: paywallTheme.textMain,
    fontFamily: 'Quicksand-Bold',
    fontSize: scale(10),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: scale(10),
    fontFamily: 'Quicksand-Bold',
    color: paywallTheme.textMain,
    textTransform: 'uppercase',
  },
})
