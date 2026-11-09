import type { RoutineCalendarDay } from '@/services/routine'
import { scale } from '@/design/responsiveNew'
import { forwardRef, useEffect } from 'react'
import type { FlatListProps } from 'react-native'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { skincareShelfColors } from '../constants'
import type { CalendarDayItem, CalendarWeekItem } from '../types'

function CompletionAura({ size }: { size: number }) {
  const pulse = useSharedValue(0)

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(0.2, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    )
  }, [pulse])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0.2, 1], [0.4, 0.9]),
    transform: [{ scale: interpolate(pulse.value, [0.2, 1], [0.98, 1.1]) }],
  }))

  return (
    <View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        zIndex: -1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: skincareShelfColors.lightBlue,
            shadowColor: '#dadffa',
            shadowOpacity: 0.4,
            shadowRadius: scale(4),
          },
          animatedStyle,
        ]}
      />
    </View>
  )
}

interface RoutineCalendarProps {
  completionDays?: RoutineCalendarDay[]
  onDayPress: (id: string, dayIndex: number) => void
  onViewableItemsChanged: NonNullable<FlatListProps<CalendarWeekItem>['onViewableItemsChanged']>
  selectedDate: string
  viewabilityConfig: FlatListProps<CalendarWeekItem>['viewabilityConfig']
  weeks: CalendarWeekItem[]
  width: number
}

export const RoutineCalendar = forwardRef<FlatList<CalendarWeekItem>, RoutineCalendarProps>(
  (
    {
      completionDays,
      onDayPress,
      onViewableItemsChanged,
      selectedDate,
      viewabilityConfig,
      weeks,
      width,
    },
    ref,
  ) => {
    const dayWidth = width / 7

    const renderDay = (item: CalendarDayItem) => {
      const isSelected = item.id === selectedDate
      const circleSize = scale(40)
      const calendarDay = completionDays?.find((day) => day.date === item.id)
      const isComplete = calendarDay?.day_completed
      const isPartial = calendarDay?.any_completed && !isComplete

      let circleBackgroundColor = 'transparent'
      let numberColor: string = skincareShelfColors.inactiveText

      if (isComplete) {
        circleBackgroundColor = '#BAE6FD'
        numberColor = skincareShelfColors.dark
      } else if (isPartial) {
        circleBackgroundColor = '#E0F2FE'
        numberColor = skincareShelfColors.dark
      } else if (isSelected) {
        circleBackgroundColor = '#FFFFFF'
        numberColor = skincareShelfColors.dark
      }

      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => onDayPress(item.id, item.dayIndex)}
          style={{
            width: dayWidth,
            alignItems: 'center',
            paddingVertical: scale(16),
            position: 'relative',
          }}
        >
          {isSelected && (
            <View
              style={{
                position: 'absolute',
                top: scale(8),
                bottom: scale(10),
                width: scale(46),
                backgroundColor: 'rgba(200, 233, 255, 0.3)',
                borderRadius: scale(24),
              }}
            />
          )}
          <Text
            style={{
              fontFamily:
                isSelected || isComplete || isPartial ? 'Quicksand-Bold' : 'Quicksand-Medium',
              color:
                isSelected || isComplete || isPartial
                  ? skincareShelfColors.dark
                  : skincareShelfColors.inactiveText,
              fontSize: scale(14),
              marginBottom: scale(12),
              zIndex: 2,
            }}
          >
            {item.dayStr}
          </Text>
          <View
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: circleBackgroundColor,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
              shadowColor: isSelected && !isComplete && !isPartial ? '#000' : 'transparent',
              shadowOpacity: isSelected && !isComplete && !isPartial ? 0.04 : 0,
              shadowRadius: scale(4),
              elevation: isSelected && !isComplete && !isPartial ? 1 : 0,
            }}
          >
            {isComplete && <CompletionAura size={circleSize} />}
            <Text style={{ fontFamily: 'Quicksand-Bold', color: numberColor, fontSize: scale(16) }}>
              {item.dateNum}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <FlatList
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={weeks}
        renderItem={({ item }) => (
          <View style={{ width, flexDirection: 'row' }}>{item.days.map(renderDay)}</View>
        )}
        keyExtractor={(item) => item.id}
        initialScrollIndex={2}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={width}
      />
    )
  },
)

RoutineCalendar.displayName = 'RoutineCalendar'
