import { useAuth, useUser } from '@clerk/expo'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases'

import type { RevenueCatIdentity } from './types'

const iosKey = process.env.EXPO_PUBLIC_RC_IOS_KEY!
const androidKey = process.env.EXPO_PUBLIC_RC_ANDROID_KEY!

function isAnonymous(id?: string | null) {
  return !id || id.startsWith('$RCAnonymousID')
}

function hasPurchaseErrorCode(error: unknown, code: PURCHASES_ERROR_CODE) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code
}

/**
 * Identity-only Revenuecat bootstrap
 * - Configure Purchases once
 * - Ensure RC user mapping the same as Clerk auth state:
 *    - signed in -> Purchases.logIn(clerkUserId)
 *    - signed out -> Purchases.logOut() if RC is non-anonymous
 *
 * Does NOT:
 * - fetch offerings
 * - store customerInfo
 * - attach customerInfo listeners (this lives in entitlements provider)
 */
export function useRevenueCatIdentity(): RevenueCatIdentity {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()

  const configureRef = useRef(false)
  const inFlightRef = useRef(false)

  const [state, setState] = useState<RevenueCatIdentity>({
    isReady: false,
    rcAppUserId: null,
    error: null,
  })

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    let canceled = false

    const init = async () => {
      // Prevent overlapping runs when Clerk state changes quickly
      if (inFlightRef.current) return
      inFlightRef.current = true

      try {
        // 1) Configuring once
        if (!configureRef.current) {
          Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN)
          const apiKey = Platform.OS === 'ios' ? iosKey : androidKey
          await Purchases.configure({ apiKey })
          configureRef.current = true
        }

        // 2) Set current RC user
        let currentId: string | null = null
        try {
          currentId = await Purchases.getAppUserID()
        } catch (e) {
          if (__DEV__) console.warn('RC getAppUserID error: ', e)
        }

        // 3) Map identity based on Clerk state
        if (isSignedIn && user?.id) {
          // be sure RC is logged in as Clerk user
          if (currentId !== user.id) {
            try {
              await Purchases.logIn(user.id)
              currentId = await Purchases.getAppUserID()
            } catch (e: unknown) {
              // if another login/logout op is in progress, do not ruin the whole init
              if (
                !hasPurchaseErrorCode(e, PURCHASES_ERROR_CODE.OPERATION_ALREADY_IN_PROGRESS_ERROR)
              ) {
                throw e
              }
            }
          }

          // Optional attributes (don’t block readiness if this fails)
          // try {
          //   await Purchases.setAttributes({
          //     clerk_user_id: user.id,
          //     email: user.primaryEmailAddress?.emailAddress ?? '',
          //   })
          // }
          // catch (e) {
          //   if (__DEV__)
          // }
        } else {
          // Signed out: ensure RC isn't stuck on a non-anon id
          if (currentId && !isAnonymous(currentId)) {
            try {
              await Purchases.logOut()
            } catch (e: unknown) {
              if (
                !hasPurchaseErrorCode(e, PURCHASES_ERROR_CODE.OPERATION_ALREADY_IN_PROGRESS_ERROR)
              ) {
                throw e
              }
            }
          }
          // read new anon id
          try {
            currentId = await Purchases.getAppUserID()
          } catch {
            currentId = null
          }
        }
        if (!canceled) {
          setState({
            isReady: true,
            rcAppUserId: currentId ?? null,
            error: null,
          })
        }
      } catch (e) {
        if (!canceled) {
          setState((prev) => ({
            ...prev,
            isReady: false,
            error: e,
          }))
        }
      } finally {
        inFlightRef.current = false
      }
    }
    init()
    return () => {
      canceled = true
    }
  }, [isLoaded, isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress])

  return state
}
