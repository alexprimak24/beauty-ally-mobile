import { Image, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { GlassCloseButton } from '@/components/ui/GlassCloseButton'
import { images } from '@/constants/images'
import { PAYWALL_VIDEO_HEIGHT, scale } from '@/design/responsiveNew'
import { paywallTheme } from '../theme'

interface PaywallHeroProps {
  closeTop: number
  onClose: () => void
  subtitle: string
  title: string
}

export function PaywallHero({ closeTop, onClose, subtitle, title }: PaywallHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={images.skincareBg}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, styles.image]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.55)', '#FFFFFF']}
          locations={[0, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={[styles.closeButton, { top: closeTop }]}>
        <GlassCloseButton zIndex={100} size={scale(22)} onPress={onClose} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: PAYWALL_VIDEO_HEIGHT - scale(40),
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: paywallTheme.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    alignItems: 'center',
    paddingBottom: 22,
  },
  title: {
    color: paywallTheme.textMain,
    fontSize: scale(34),
    lineHeight: scale(40),
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  subtitle: {
    color: paywallTheme.textMuted,
    fontSize: scale(15),
    lineHeight: scale(21),
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    zIndex: 50,
  },
})
