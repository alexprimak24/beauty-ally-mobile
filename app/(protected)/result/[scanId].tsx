import ConfigureRoutineModal from '@/features/routine/components/ConfigureRoutineModal'
import { GlassBackButton } from '@/components/ui/GlassBackButton'
import { UpdateProductDataBtns } from '@/components/ui/UpdateProductDataBtns'
import { scale, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/design/responsiveNew'
import { ProgressiveResultImage } from '@/features/scanResult/components/ProgressiveResultImage'
import { ResultPageState } from '@/features/scanResult/components/ResultPageState'
import { ResultActionBar } from '@/features/scanResult/components/ResultActionBar'
import { ResultInsights } from '@/features/scanResult/components/ResultInsights'
import { ResultVerdictCard } from '@/features/scanResult/components/ResultVerdictCard'
import { useScanResultController } from '@/features/scanResult/hooks/useScanResultController'
import { useState } from 'react'
import { RefreshControl, StatusBar, View } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.45
const SHOULD_ANIMATE = true

export default function ResultPage() {
  const result = useScanResultController()
  const insets = useSafeAreaInsets()
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollY = useSharedValue(0)
  const [bottomActionBarHeight, setBottomActionBarHeight] = useState(0)
  const product = result.productCheck

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(scrollY.value, [-IMAGE_HEIGHT, 0], [1.3, 1], Extrapolation.CLAMP),
      },
    ],
  }))

  if (!result.scanId) return <ResultPageState loading={false} />
  if (result.isLoading && !product) {
    return (
      <ResultPageState
        loading
        previewKey={result.scanId}
        previewSource={result.frontPreviewSource}
      />
    )
  }
  if (!product) {
    return <ResultPageState loading={false} onRetry={() => void result.retry()} />
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-white" edges={['left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <GlassBackButton zIndex={10} />
        {!result.hasLocalImages ? (
          <UpdateProductDataBtns scanId={product.id} productLink={product.purchaseLink ?? ''} />
        ) : null}

        <Animated.ScrollView
          horizontal
          bounces={false}
          decelerationRate="fast"
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={[
            {
              height: IMAGE_HEIGHT,
              width: SCREEN_WIDTH,
              position: 'absolute',
              top: 0,
            },
            animatedImageStyle,
          ]}
        >
          <ProgressiveResultImage
            height={IMAGE_HEIGHT}
            key={`${result.scanId}:front:${product.frontImage}`}
            previewSource={result.frontPreviewSource}
            recyclingKey={`${result.scanId}:front`}
            source={result.frontSource}
            width={SCREEN_WIDTH}
          />
          {result.hasBackImage ? (
            <ProgressiveResultImage
              height={IMAGE_HEIGHT}
              key={`${result.scanId}:back:${product.backImage}`}
              previewSource={result.backPreviewSource}
              recyclingKey={`${result.scanId}:back`}
              source={result.backSource}
              width={SCREEN_WIDTH}
            />
          ) : null}
        </Animated.ScrollView>

        <Animated.ScrollView
          ref={scrollRef}
          bounces
          contentContainerStyle={{ paddingBottom: insets.bottom + scale(40) }}
          onScroll={handleScroll}
          refreshControl={
            <RefreshControl refreshing={result.refreshing} onRefresh={result.refresh} />
          }
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: IMAGE_HEIGHT, backgroundColor: 'transparent' }} />
          <View className="bg-white">
            <View
              className="bg-white"
              style={{
                marginTop: -scale(80),
                borderTopRightRadius: scale(46),
                borderTopLeftRadius: scale(46),
              }}
            >
              {result.verdict ? (
                <ResultVerdictCard
                  config={result.verdict.config}
                  factors={product.highlightedFactors ?? []}
                  label={result.verdict.label}
                  shouldAnimate={SHOULD_ANIMATE}
                />
              ) : null}
            </View>

            <Animated.View
              entering={
                SHOULD_ANIMATE
                  ? FadeInDown.delay(600)
                      .duration(600)
                      .easing(Easing.bezier(0.25, 1, 0.5, 1))
                  : undefined
              }
              style={{
                marginTop: scale(18),
                paddingHorizontal: scale(20),
                paddingBottom: bottomActionBarHeight - insets.top + scale(20),
              }}
            >
              <ResultInsights
                bestTime={result.cards.bestTime}
                breakoutRisk={result.cards.breakoutRisk}
                frequency={result.cards.frequency}
                note={product.personalNote ?? ''}
                routineCompatibility={result.cards.routineCompatibility}
                tip={product.tips ?? ''}
              />
            </Animated.View>
          </View>
        </Animated.ScrollView>

        <ResultActionBar
          bottomInset={insets.bottom}
          favoriteDisabled={result.favoritePending}
          inSkincare={Boolean(product.inSkincare)}
          isFavorite={Boolean(product.isFavorites)}
          onFavoritePress={result.toggleFavorite}
          onLayout={(event) =>
            setBottomActionBarHeight(Math.round(event.nativeEvent.layout.height))
          }
          onSkincarePress={result.toggleSkincare}
          shouldAnimate={SHOULD_ANIMATE}
          skincareDisabled={result.removeFromSkincarePending}
        />
      </SafeAreaView>
      <ConfigureRoutineModal
        analyticsSource="scan_result"
        onClose={result.closeRoutineConfiguration}
        product={result.productToConfigure}
      />
    </>
  )
}
