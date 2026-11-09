import LottieView from 'lottie-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'

interface AppStartupSplashProps {
  appReady: boolean
  onFinish: () => void
}

const BG = '#F4F6F8'
const LOGO_SIZE = 180

export default function AppStartupSplash({ appReady, onFinish }: AppStartupSplashProps) {
  const [introFinished, setIntroFinished] = useState(false)
  const [showStaticLogo, setShowStaticLogo] = useState(false)

  const overlayOpacity = useRef(new Animated.Value(1)).current
  const pulseScale = useRef(new Animated.Value(1)).current
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null)

  const canClose = useMemo(() => introFinished && appReady, [introFinished, appReady])

  useEffect(() => {
    if (!introFinished) return

    if (appReady) {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish()
      })
      return
    }

    setShowStaticLogo(true)

    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.02,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )

    pulseLoopRef.current.start()

    return () => {
      pulseLoopRef.current?.stop()
    }
  }, [introFinished, appReady, onFinish, overlayOpacity, pulseScale])

  useEffect(() => {
    if (!canClose) return

    pulseLoopRef.current?.stop()
    setShowStaticLogo(false)

    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onFinish()
    })
  }, [canClose, onFinish, overlayOpacity])

  return (
    <Animated.View style={[styles.container, { opacity: overlayOpacity }]}>
      {!showStaticLogo ? (
        <LottieView
          source={require('@/assets/animations/splash.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
          onAnimationFinish={() => {
            setIntroFinished(true)
          }}
        />
      ) : (
        <Animated.Image
          source={require('@/assets/icons/splashFull.png')}
          resizeMode="contain"
          style={[
            styles.staticLogo,
            {
              transform: [{ scale: pulseScale }],
            },
          ]}
        />
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  lottie: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  staticLogo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
})
