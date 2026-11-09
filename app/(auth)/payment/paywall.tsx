import { useTranslation } from 'react-i18next'
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { isTablet, SCREEN_WIDTH } from '@/design/responsiveNew'
import { FreeScansOption } from '@/features/subscription/components/FreeScansOption'
import { PaywallBenefits } from '@/features/subscription/components/PaywallBenefits'
import { PaywallFooter } from '@/features/subscription/components/PaywallFooter'
import { PaywallHero } from '@/features/subscription/components/PaywallHero'
import { PaywallLoadingOverlay } from '@/features/subscription/components/PaywallLoadingOverlay'
import { PaywallPlanCard } from '@/features/subscription/components/PaywallPlanCard'
import { SubscribedView } from '@/features/subscription/components/SubscribedView'
import { usePaywallController } from '@/features/subscription/hooks/usePaywallController'
import { paywallTheme } from '@/features/subscription/theme'
import { onboarding } from '@/utils/i18n/keyConstants'

export default function PaywallScreen() {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation(onboarding)
  const controller = usePaywallController()

  if (controller.isPro && !controller.isManaging) {
    return <SubscribedView activePlan={controller.activePlan} onManage={controller.startManaging} />
  }

  const benefits = controller.isYearly
    ? [
        t('paymentPage.benefits.unlimited'),
        t('paymentPage.benefits.advanced'),
        t('paymentPage.benefits.bestValue'),
      ]
    : [t('paymentPage.benefits.unlimited'), t('paymentPage.benefits.advanced')]

  const ctaText = controller.wantsFreeScans
    ? t('paymentPage.freeScans.claim')
    : controller.isCurrentActivePlan
      ? t('paymentPage.cta.active')
      : controller.isManaging
        ? `${t('paymentPage.cta.switchTo')} ${controller.isYearly ? t('paymentPage.plans.yearly') : t('paymentPage.plans.monthly')}`
        : t('paymentPage.cta.continue')

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <PaywallLoadingOverlay
        message={controller.loadingMessage}
        subMessage={controller.loadingSubMessage}
        visible={controller.loadingState !== null}
      />

      <PaywallHero
        closeTop={insets.top + 10}
        onClose={controller.handleClose}
        subtitle={t('paymentPage.header.subtitle')}
        title={t('paymentPage.header.title')}
      />

      <View style={styles.bottomSection}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 10 },
            isTablet && { paddingHorizontal: SCREEN_WIDTH * 0.2 },
          ]}
        >
          {!controller.isManaging ? (
            <FreeScansOption
              activated={controller.hasActivatedFree}
              disabled={controller.isFreeOptionDisabled}
              offerText={t('paymentPage.freeScans.offer')}
              onChange={controller.selectFreeScans}
              selected={controller.wantsFreeScans}
              usedText={t('paymentPage.freeScans.used')}
            />
          ) : null}

          <Animated.View
            layout={LinearTransition.duration(240)}
            pointerEvents={controller.wantsFreeScans ? 'none' : 'auto'}
            style={controller.interactivePlansStyle}
          >
            <View accessibilityRole="radiogroup" style={styles.plansContainer}>
              <PaywallPlanCard
                billingText={controller.yearlyBillingText}
                currentBadgeText={t('paymentPage.card.currentBadge')}
                equivalent={controller.yearlyPricing.monthlyEquivalent}
                equivalentPeriod={t('paymentPage.plans.monthly').toLowerCase()}
                hasIntro={controller.yearlyPricing.hasIntro}
                isCurrent={controller.isPro && controller.activePlan === 'yearly'}
                isSelected={controller.isYearly}
                mainPrice={controller.yearlyPricing.mainPrice}
                name={t('paymentPage.plans.yearlyPlan')}
                onSelect={controller.selectPlan}
                period={controller.yearlyPeriod}
                plan="yearly"
                specialBadgeText={t('paymentPage.banner.special')}
              />

              <PaywallPlanCard
                billingText={controller.monthlyBillingText}
                currentBadgeText={t('paymentPage.card.currentBadge')}
                isCurrent={controller.isPro && controller.activePlan === 'monthly'}
                isSelected={!controller.isYearly}
                mainPrice={controller.monthlyPricing.mainPrice}
                name={t('paymentPage.plans.monthlyPlan')}
                onSelect={controller.selectPlan}
                period={controller.monthlyPeriod}
                plan="monthly"
              />
            </View>

            <PaywallBenefits
              benefits={benefits}
              loadingText={t('paymentPage.loading.packages')}
              packagesReady={controller.paywallStatus === 'ready'}
              plan={controller.plan}
            />
          </Animated.View>

          <PaywallFooter
            ctaDisabled={
              controller.isCurrentActivePlan || controller.busy || controller.loadingState !== null
            }
            ctaText={ctaText}
            currentPlanSelected={controller.isCurrentActivePlan}
            legalText={
              controller.wantsFreeScans
                ? t('paymentPage.freeScans.noCard')
                : t('paymentPage.cta.noCommit')
            }
            onContinue={controller.handleNextStep}
            onRestore={controller.handleRestore}
            privacyText={t('paymentPage.footer.privacy')}
            restoreText={t('paymentPage.footer.restore')}
            termsText={t('paymentPage.footer.terms')}
          />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paywallTheme.background,
  },
  bottomSection: {
    flex: 1,
    marginTop: -10,
    overflow: 'hidden',
    backgroundColor: paywallTheme.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 16,
  },
})
