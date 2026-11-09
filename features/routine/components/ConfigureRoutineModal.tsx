import LoadingDarkSpinner from '@/components/ui/LoadingIndicator'
import { scale } from '@/design/responsiveNew'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { analyticsEvents } from '@/utils/analytics'
import type { ProductEngagementSource } from '@/utils/analytics'
import { components } from '@/utils/i18n/keyConstants'
import {
  markSkincareReminderPermissionPromptSeenAsync,
  requestSkincareReminderPermissionAsync,
  shouldShowSkincareReminderPermissionPromptAsync,
} from '@/utils/notifications/skincareShelfReminders'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'
import Animated, {
  Easing,
  LinearTransition,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { useCreateRoutineEntry } from '../hooks/useRoutineEntryMutations'
import { useRoutineSchedule } from '../hooks/useRoutineSchedule'
import {
  buildRoutineEntryPayloads,
  createNewRoutineSchedule,
  isRoutineScheduleInvalid,
} from '../schedule'
import RoutineConfigCard from './RoutineConfigCard'

const CONFIGURE_ROUTINE_MODAL_TEXT = {
  fallbackProductName: 'routine.productNameFallback',
  configureRoutine: 'routine.configureRoutine',
  addToRoutine: 'routine.addToRoutine',
  addedToRoutine: 'routine.addedToRoutine',
  failedToAdd: 'routine.failedToAdd',
  notificationPromptTitle: 'routine.notificationPrompt.title',
  notificationPromptMessage: 'routine.notificationPrompt.message',
  notificationPromptAllow: 'routine.notificationPrompt.allow',
  notificationPromptNotNow: 'routine.notificationPrompt.notNow',
} as const

const COLORS = {
  dark: '#212529',
  inactiveBorder: '#E5E5EA',
}

interface ConfigureRoutineModalProps {
  analyticsSource: ProductEngagementSource
  product: ProductChecksEntry | null
  onClose: () => void
}

export default function ConfigureRoutineModal({
  analyticsSource,
  product,
  onClose,
}: ConfigureRoutineModalProps) {
  const { height } = useWindowDimensions()
  const { createRoutineEntryAsync } = useCreateRoutineEntry()
  const analytics = useAnalytics()
  const { t } = useTranslation(components)

  const [isSaving, setIsSaving] = useState(false)
  const { resetSchedule, schedule, setFrequency, togglePeriod, toggleWeekday } = useRoutineSchedule(
    createNewRoutineSchedule(),
  )

  useEffect(() => {
    if (product) {
      resetSchedule(createNewRoutineSchedule())
    }
  }, [product, resetSchedule])

  const maybeAskForReminderPermission = async () => {
    const shouldShowPrompt = await shouldShowSkincareReminderPermissionPromptAsync()
    if (!shouldShowPrompt) return

    Alert.alert(
      t(CONFIGURE_ROUTINE_MODAL_TEXT.notificationPromptTitle),
      t(CONFIGURE_ROUTINE_MODAL_TEXT.notificationPromptMessage),
      [
        {
          text: t(CONFIGURE_ROUTINE_MODAL_TEXT.notificationPromptNotNow),
          style: 'cancel',
          onPress: () => {
            markSkincareReminderPermissionPromptSeenAsync().catch(() => undefined)
          },
        },
        {
          text: t(CONFIGURE_ROUTINE_MODAL_TEXT.notificationPromptAllow),
          onPress: () => {
            requestSkincareReminderPermissionAsync().catch(() => undefined)
          },
        },
      ],
    )
  }

  const handleSaveToRoutine = async () => {
    if (!product?.id) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setIsSaving(true)

    try {
      const routineEntries = buildRoutineEntryPayloads(product.id, schedule)

      for (const routineEntry of routineEntries) await createRoutineEntryAsync(routineEntry)

      analytics.capture(analyticsEvents.productCollectionChanged, {
        action: 'added',
        collection: 'skincare',
        routine_periods: routineEntries.map((entry) => entry.routineType),
        source: analyticsSource,
      })

      Toast.show({
        type: 'success',
        position: 'top',
        text1: t(CONFIGURE_ROUTINE_MODAL_TEXT.addedToRoutine),
        topOffset: scale(70),
      })

      onClose()
      setTimeout(() => {
        maybeAskForReminderPermission().catch(() => undefined)
      }, 350)
    } catch (err) {
      console.error('Failed to save routine:', err)

      Toast.show({
        type: 'error',
        position: 'top',
        text1: t(CONFIGURE_ROUTINE_MODAL_TEXT.failedToAdd),
        topOffset: scale(70),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isNothingSelected = !schedule.morning.isSelected && !schedule.evening.isSelected
  const isSaveDisabled = isSaving || isNothingSelected || isRoutineScheduleInvalid(schedule)

  return (
    <Modal visible={!!product} transparent animationType="fade">
      <View
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(33, 37, 41, 0.4)' }}
      >
        <TouchableWithoutFeedback onPress={() => !isSaving && onClose()}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        {!!product && (
          <Animated.View
            entering={SlideInDown.duration(300).easing(Easing.out(Easing.cubic))}
            exiting={SlideOutDown.duration(200)}
            layout={LinearTransition.duration(250).easing(Easing.out(Easing.ease))}
            style={{
              backgroundColor: '#FFF',
              paddingBottom: scale(40),
              paddingTop: scale(24),
              paddingHorizontal: scale(24),
              borderTopLeftRadius: scale(32),
              borderTopRightRadius: scale(32),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: scale(-10) },
              shadowOpacity: 0.05,
              shadowRadius: scale(20),
              maxHeight: height * 0.85,
            }}
          >
            <View
              style={{
                width: scale(40),
                height: scale(5),
                backgroundColor: COLORS.inactiveBorder,
                borderRadius: scale(3),
                alignSelf: 'center',
                marginBottom: scale(20),
              }}
            />

            <Text
              style={{
                fontFamily: 'Quicksand-Bold',
                fontSize: scale(20),
                color: COLORS.dark,
                textAlign: 'center',
                marginBottom: scale(4),
              }}
              numberOfLines={1}
            >
              {product.productName || t(CONFIGURE_ROUTINE_MODAL_TEXT.fallbackProductName)}
            </Text>

            <Text
              style={{
                fontFamily: 'Quicksand-Medium',
                fontSize: scale(14),
                color: '#8E8E93',
                textAlign: 'center',
                marginBottom: scale(24),
              }}
            >
              {t(CONFIGURE_ROUTINE_MODAL_TEXT.configureRoutine)}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: scale(16) }}
            >
              <RoutineConfigCard
                type="morning"
                isSelected={schedule.morning.isSelected}
                onToggleSelect={() => togglePeriod('morning')}
                frequency={schedule.morning.frequency}
                onFrequencyChange={(frequency) => setFrequency('morning', frequency)}
                weekdaysMask={schedule.morning.weekdaysMask}
                onToggleWeekday={(weekday) => toggleWeekday('morning', weekday)}
                style={{ marginBottom: scale(16) }}
              />

              <RoutineConfigCard
                type="evening"
                isSelected={schedule.evening.isSelected}
                onToggleSelect={() => togglePeriod('evening')}
                frequency={schedule.evening.frequency}
                onFrequencyChange={(frequency) => setFrequency('evening', frequency)}
                weekdaysMask={schedule.evening.weekdaysMask}
                onToggleWeekday={(weekday) => toggleWeekday('evening', weekday)}
                style={{ marginBottom: scale(24) }}
              />
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveToRoutine}
              disabled={isSaveDisabled}
              style={{
                height: scale(56),
                backgroundColor: isSaveDisabled ? COLORS.inactiveBorder : COLORS.dark,
                borderRadius: scale(28),
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: isSaveDisabled ? 0 : 0.1,
                shadowRadius: scale(16),
                shadowOffset: { width: 0, height: scale(6) },
                elevation: isSaveDisabled ? 0 : 4,
              }}
            >
              {isSaving ? (
                <View style={{ position: 'absolute' }}>
                  <LoadingDarkSpinner />
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: 'Quicksand-Bold',
                    fontSize: scale(16),
                    color: isSaveDisabled ? '#9CA3AF' : '#FFF',
                  }}
                >
                  {t(CONFIGURE_ROUTINE_MODAL_TEXT.addToRoutine)}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Modal>
  )
}
