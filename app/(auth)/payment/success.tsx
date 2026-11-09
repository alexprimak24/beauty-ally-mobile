import { scale } from '@/design/responsiveNew'
import { PaymentReceiptCard } from '@/features/subscription/components/PaymentReceiptCard'
import { usePaymentSuccessController } from '@/features/subscription/hooks/usePaymentSuccessController'
import { onboarding } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const ACCENT_COLOR = '#d6f5d6'
const TEXT_MAIN = '#212529'
const TEXT_SUB = '#6B7280'

export default function PaymentSuccessScreen() {
  const controller = usePaymentSuccessController()
  const { t } = useTranslation(onboarding)
  const planDisplay = controller.planSuffixKey
    ? `${t('paymentSuccessPage.receipt.planNameBase')} ${t(controller.planSuffixKey)}`
    : t('paymentSuccessPage.receipt.fallback')

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.exitOverlay, controller.overlayStyle]}
      />

      <Animated.View style={[styles.animatedContent, controller.contentStyle]}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            accessibilityLiveRegion="polite"
            entering={FadeInDown.delay(100).springify()}
            style={styles.centerWrapper}
          >
            <Animated.View style={[styles.iconContainer, controller.iconStyle]}>
              <LinearGradient colors={[ACCENT_COLOR, '#fff']} style={StyleSheet.absoluteFill} />
              <Ionicons color={TEXT_MAIN} name="checkmark" size={scale(64)} />
            </Animated.View>

            <Text style={styles.title}>{t('paymentSuccessPage.title')}</Text>
            <Text style={styles.subtitle}>{t('paymentSuccessPage.subtitle')}</Text>
            <PaymentReceiptCard
              isActive={controller.isActive}
              plan={planDisplay}
              statusActive={t('paymentSuccessPage.receipt.statusActive')}
              statusLabel={t('paymentSuccessPage.receipt.statusLabel')}
              statusPending={t('paymentSuccessPage.receipt.statusPending')}
              subscriptionLabel={t('paymentSuccessPage.receipt.subscriptionLabel')}
            />
          </Animated.View>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              disabled={controller.isExiting}
              onPress={controller.startExit}
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            >
              <Text style={styles.ctaText}>{t('actions.celebration')}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  exitOverlay: { zIndex: 1, backgroundColor: '#fff' },
  animatedContent: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: scale(40),
    paddingHorizontal: scale(30),
    paddingTop: scale(52),
    paddingBottom: scale(20),
  },
  centerWrapper: { alignItems: 'center', width: '100%' },
  iconContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(30),
    shadowColor: ACCENT_COLOR,
    shadowOpacity: 0.6,
    shadowRadius: scale(30),
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  title: {
    fontSize: scale(32),
    fontFamily: 'Quicksand-Bold',
    color: TEXT_MAIN,
    textAlign: 'center',
    marginBottom: scale(12),
  },
  subtitle: {
    fontSize: scale(16),
    fontFamily: 'Quicksand-Medium',
    color: TEXT_SUB,
    textAlign: 'center',
    marginBottom: scale(40),
    lineHeight: scale(24),
  },
  footer: { width: '100%' },
  ctaButton: {
    backgroundColor: TEXT_MAIN,
    minHeight: scale(60),
    width: '100%',
    borderRadius: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: scale(14),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: scale(10),
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaButtonPressed: { opacity: 0.85 },
  ctaText: {
    color: '#FFFFFF',
    fontSize: scale(19),
    fontFamily: 'Quicksand-Bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
})
