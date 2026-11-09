import { StyleSheet, Text, View } from 'react-native'

import { scale } from '@/design/responsiveNew'

const ACTIVE_COLOR = '#d6f5d6'
const TEXT_MAIN = '#212529'
const TEXT_SUB = '#6B7280'

interface PaymentReceiptCardProps {
  isActive: boolean
  plan: string
  statusActive: string
  statusLabel: string
  statusPending: string
  subscriptionLabel: string
}

export function PaymentReceiptCard({
  isActive,
  plan,
  statusActive,
  statusLabel,
  statusPending,
  subscriptionLabel,
}: PaymentReceiptCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>{statusLabel}</Text>
        <View style={[styles.badge, !isActive && styles.pendingBadge]}>
          <Text style={[styles.badgeText, !isActive && styles.pendingBadgeText]}>
            {isActive ? statusActive : statusPending}
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.label}>{subscriptionLabel}</Text>
        <Text style={styles.value}>{plan}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: scale(20),
    paddingHorizontal: scale(20),
    paddingVertical: scale(24),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: scale(15),
    shadowOffset: { width: 0, height: scale(5) },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: scale(16),
  },
  label: {
    flexShrink: 1,
    fontSize: scale(15),
    fontFamily: 'Quicksand-Medium',
    color: TEXT_SUB,
  },
  value: {
    flexShrink: 1,
    fontSize: scale(15),
    fontFamily: 'Quicksand-Bold',
    color: TEXT_MAIN,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: scale(16),
  },
  badge: {
    flexShrink: 0,
    backgroundColor: ACTIVE_COLOR,
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(8),
  },
  pendingBadge: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
    color: TEXT_MAIN,
  },
  pendingBadgeText: {
    color: TEXT_SUB,
  },
})
