import { useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { useSharedValue } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

import type { btnVariant } from '@/constants/btnVariants'
import { scale } from '@/design/responsiveNew'
import type { ProductChecksEntry } from '@/types/scanEntry'
import { useProductCheckCardActions } from '../hooks/useProductCheckCardActions'
import { useProductCheckCardGesture } from '../hooks/useProductCheckCardGesture'
import { ProductCheckCardContent } from './ProductCheckCardContent'
import { ProductCheckCardSwipeActions } from './ProductCheckCardSwipeActions'
import { productCheckCardColors as colors } from './productCheckCardTheme'

interface ProductCheckCardBaseProps {
  entry: ProductChecksEntry
  variant?: btnVariant
}

interface SelectableProductCheckCardProps extends ProductCheckCardBaseProps {
  onSelect: (entry: ProductChecksEntry) => void
}

interface ActionableProductCheckCardProps extends ProductCheckCardBaseProps {
  onConfigureRoutine?: (product: ProductChecksEntry) => void
  onDelete: () => void
  onDeleteDisabled: boolean
  onToggleFavorites: () => void
  onToggleFavoritesDisabled: boolean
  onToggleSkincare: () => void
  onToggleSkincareDisabled: boolean
}

type ProductCheckCardProps = SelectableProductCheckCardProps | ActionableProductCheckCardProps

function cardStyle(entry: ProductChecksEntry) {
  return {
    backgroundColor: colors.card,
    borderColor: entry.inSkincare ? colors.lightBlueBorder : colors.defaultBorder,
    borderRadius: scale(24),
    borderWidth: scale(1.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.04,
    shadowRadius: scale(10),
  } as const
}

function SelectableProductCheckCard({
  entry,
  onSelect,
  variant = 'primary',
}: SelectableProductCheckCardProps) {
  const showFavorites = variant === 'secondary'

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onSelect(entry)
      }}
      style={styles.wrapper}
    >
      <View pointerEvents="none" style={cardStyle(entry)}>
        <ProductCheckCardContent
          entry={entry}
          onFavoritePress={() => undefined}
          onPress={() => undefined}
          onPurchasePress={() => undefined}
          showFavorites={showFavorites}
          toggleFavoritesDisabled
        />
      </View>
    </TouchableOpacity>
  )
}

function ActionableProductCheckCard({
  entry,
  onConfigureRoutine,
  onDelete,
  onDeleteDisabled,
  onToggleFavorites,
  onToggleFavoritesDisabled,
  onToggleSkincare,
  onToggleSkincareDisabled,
  variant = 'primary',
}: ActionableProductCheckCardProps) {
  const translateX = useSharedValue(0)
  const isSwipingRef = useRef(false)
  const actions = useProductCheckCardActions({
    entry,
    isSwipingRef,
    onConfigureRoutine,
    onDelete,
    onDeleteDisabled,
    onToggleFavorites,
    onToggleFavoritesDisabled,
    onToggleSkincare,
    onToggleSkincareDisabled,
    translateX,
  })
  const {
    applyIconStyle,
    cardStyle: animatedCardStyle,
    gesture,
  } = useProductCheckCardGesture({
    isSwipingRef,
    onApply: actions.toggleSkincare,
    translateX,
  })

  return (
    <View style={styles.wrapper}>
      <View style={styles.actionContainer}>
        <ProductCheckCardSwipeActions
          applyIconStyle={applyIconStyle}
          onDelete={actions.deleteEntry}
          onEdit={actions.openEditor}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View style={[cardStyle(entry), animatedCardStyle]}>
            <ProductCheckCardContent
              entry={entry}
              onFavoritePress={actions.toggleFavorite}
              onPress={actions.openDetails}
              onPurchasePress={actions.openPurchase}
              showFavorites={variant === 'secondary'}
              toggleFavoritesDisabled={onToggleFavoritesDisabled}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  )
}

export default function ProductCheckCard(props: ProductCheckCardProps) {
  if ('onSelect' in props) return <SelectableProductCheckCard {...props} />
  return <ActionableProductCheckCard {...props} />
}

const styles = {
  actionContainer: { position: 'relative' },
  wrapper: { marginBottom: scale(16), width: '100%' },
} as const
