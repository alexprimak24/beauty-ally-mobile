import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Animated, {
  cancelAnimation,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { isTablet, scale } from '@/design/responsiveNew'
import { onboarding } from '@/utils/i18n/keyConstants'
import { getPaymentPlanSuffixKey, type SubscriptionPlan } from '../model'
import { paywallTheme } from '../theme'

const HOME_ROUTE = '/(protected)/(tabs)' as const

interface SubscribedViewProps {
  activePlan: SubscriptionPlan
  onManage: () => void
}

export function SubscribedView({ activePlan, onManage }: SubscribedViewProps) {
  const scaleValue = useSharedValue(1)
  const router = useRouter()
  const { t } = useTranslation(onboarding)
  const suffixKey = getPaymentPlanSuffixKey(activePlan)
  const planDisplay = suffixKey
    ? `${t('paymentPage.subscribed.planNameBase')} ${t(suffixKey)}`
    : t('paymentPage.subscribed.fallback')

  useEffect(() => {
    scaleValue.value = withRepeat(withSpring(1.05, { damping: 6 }), -1, true)
    return () => cancelAnimation(scaleValue)
  }, [scaleValue])

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }))

  const goHome = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.replace(HOME_ROUTE)
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInDown.delay(180).springify()} style={styles.content}>
          <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
            <LinearGradient
              colors={[paywallTheme.accent, '#fff']}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="checkmark" size={scale(64)} color={paywallTheme.textMain} />
          </Animated.View>

          <Text style={styles.title}>{t('paymentPage.subscribed.title')}</Text>
          <Text style={styles.subtitle}>{t('paymentPage.subscribed.subtitle')}</Text>

          <View style={styles.planCard}>
            <Text style={styles.planLabel}>{t('paymentPage.subscribed.currentPlanLabel')}</Text>
            <Text style={styles.planValue}>{planDisplay}</Text>
          </View>
        </Animated.View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={goHome}
            style={({ pressed }) => [styles.ctaButton, pressed && styles.pressedButton]}
          >
            <Text style={styles.ctaText}>{t('paymentPage.subscribed.goHome')}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={onManage}
            style={styles.manage}
          >
            <Text style={styles.manageText}>{t('paymentPage.subscribed.manage')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paywallTheme.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(40),
    paddingHorizontal: scale(30),
    paddingTop: scale(60),
    paddingBottom: scale(30),
  },
  content: {
    width: isTablet ? '60%' : '100%',
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: scale(34),
    fontFamily: 'Quicksand-Bold',
    color: paywallTheme.textMain,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(15),
    fontFamily: 'Quicksand-SemiBold',
    color: paywallTheme.textMuted,
    textAlign: 'center',
    marginBottom: 36,
  },
  planCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  planLabel: {
    flexShrink: 1,
    fontSize: scale(14),
    fontFamily: 'Quicksand-Medium',
    color: paywallTheme.textMuted,
  },
  planValue: {
    flexShrink: 1,
    fontSize: scale(14),
    fontFamily: 'Quicksand-Bold',
    color: paywallTheme.textMain,
    textAlign: 'right',
  },
  actions: {
    width: isTablet ? '50%' : '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    minHeight: scale(54),
    backgroundColor: paywallTheme.textMain,
    borderRadius: scale(29),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: scale(12),
  },
  pressedButton: {
    opacity: 0.85,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: scale(17),
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
  },
  manage: {
    marginTop: 20,
    padding: 10,
  },
  manageText: {
    color: '#9CA3AF',
    fontSize: scale(13),
    fontFamily: 'Quicksand-SemiBold',
  },
})
