import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Image as ExpoImage } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import { WARM_BLURHASH } from '@/constants/blurHash'
import { images } from '@/constants/images'
import { scale } from '@/design/responsiveNew'
import { useTimeAgo } from '@/hooks/useTimeAgo'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { detectEntryStyle } from '@/utils/detectEntryStyle'
import { components, main } from '@/utils/i18n/keyConstants'
import { mapVerdict, verdictFromApi } from '@/utils/mapVerdict'
import { productCheckCardColors as colors } from './productCheckCardTheme'

interface ProductCheckCardContentProps {
  entry: ProductChecksEntry
  onFavoritePress: () => void
  onPress: () => void
  onPurchasePress: () => void
  showFavorites: boolean
  toggleFavoritesDisabled: boolean
}

export function ProductCheckCardContent({
  entry,
  onFavoritePress,
  onPress,
  onPurchasePress,
  showFavorites,
  toggleFavoritesDisabled,
}: ProductCheckCardContentProps) {
  const { t } = useTranslation(components)
  const { t: mainT } = useTranslation(main)
  const timeAgo = useTimeAgo(entry.createdAt)
  const { icon, color, textColor } = detectEntryStyle(entry.matchSummary)
  const verdict = verdictFromApi(entry.matchSummary) ?? 'Low Match'
  const verdictLabel = mainT(mapVerdict({ verdict }).intKey)
  const productName = entry.productName === 'Unknown' ? t('unknownProduct') : entry.productName

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.imageContainer}>
        <ExpoImage
          source={entry.frontImage ? { uri: entry.frontImage } : images.imageNotFoundGreen}
          style={styles.image}
          contentFit="cover"
          placeholder={WARM_BLURHASH}
          transition={250}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.titleButton}>
            <Text numberOfLines={1} style={styles.title}>
              {productName}
            </Text>
          </TouchableOpacity>

          {showFavorites ? (
            <TouchableOpacity
              disabled={toggleFavoritesDisabled}
              hitSlop={10}
              onPress={onFavoritePress}
            >
              <Ionicons
                name={entry.isFavorites ? 'heart' : 'heart-outline'}
                size={scale(22)}
                color={entry.isFavorites ? colors.strongRed : colors.inactiveIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          style={[styles.verdict, { backgroundColor: color }]}
        >
          <View style={styles.verdictLabel}>
            <Image source={icon} style={styles.verdictIcon} />
            <Text numberOfLines={1} style={[styles.verdictText, { color: textColor }]}>
              {verdictLabel}
            </Text>
          </View>

          <View style={styles.rating}>
            <Text style={[styles.ratingText, { color }]}>
              {entry.ingredientMatchRating.toFixed(1)} / 5
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <View style={styles.timeBadge}>
            <Text numberOfLines={1} style={styles.timeText}>
              {timeAgo}
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.6} hitSlop={10} onPress={onPurchasePress}>
            <Ionicons name="bag-handle-outline" size={scale(20)} color={colors.secondaryText} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = {
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(14),
    paddingVertical: scale(18),
  },
  imageContainer: {
    borderRadius: scale(18),
    height: scale(100),
    overflow: 'hidden',
    position: 'relative',
    width: scale(100),
  },
  image: { height: '100%', width: '100%' },
  content: {
    flex: 1,
    height: scale(100),
    justifyContent: 'space-between',
    marginLeft: scale(16),
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleButton: { flex: 1, marginRight: scale(8) },
  title: {
    color: colors.primaryText,
    fontFamily: 'Quicksand-SemiBold',
    fontSize: scale(16),
  },
  verdict: {
    alignItems: 'center',
    borderRadius: scale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    width: '100%',
  },
  verdictLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    marginRight: scale(8),
  },
  verdictIcon: { height: scale(18), resizeMode: 'contain', width: scale(18) },
  verdictText: {
    flexShrink: 1,
    fontFamily: 'Quicksand-Medium',
    fontSize: scale(13),
    marginLeft: scale(6),
  },
  rating: {
    backgroundColor: colors.primaryText,
    borderRadius: scale(16),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
  },
  ratingText: { fontFamily: 'Quicksand-Regular', fontSize: scale(10) },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightBadge,
    borderRadius: scale(6),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
  },
  timeText: {
    color: colors.secondaryText,
    fontFamily: 'Quicksand-SemiBold',
    fontSize: scale(11),
  },
} as const
