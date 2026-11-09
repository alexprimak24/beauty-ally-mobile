/// <reference types="jest" />

import type { RoutineItem } from '@/services/routine'
import { enUS } from 'date-fns/locale'
import {
  buildCalendarWeeks,
  buildReorderRoutinePayload,
  getRoutineOrderSignature,
  getStreakPalette,
  hasRoutineOrderChanged,
  resolveInitialReorderSection,
  toReorderRoutineEntries,
  toShelfItems,
} from '../model'

const translate = (key: string) => key

describe('skincare shelf model', () => {
  it('builds five stable Monday-to-Sunday calendar weeks', () => {
    const weeks = buildCalendarWeeks(new Date(2026, 10, 2), enUS, translate)

    expect(weeks).toHaveLength(5)
    expect(weeks.every((week) => week.days.length === 7)).toBe(true)
    expect(weeks[0].id).toBe('week-0')
    expect(weeks[0].days.slice(0, 2)).toEqual([
      expect.objectContaining({ id: '2026-11-02', dayIndex: 0 }),
      expect.objectContaining({ id: '2026-11-03', dayIndex: 1 }),
    ])
    expect(weeks[4].days[6].id).toBe('2026-12-06')
  })

  it('sorts API routine items and maps them to UI entries', () => {
    const items: RoutineItem[] = [
      {
        routine_entry_id: 'second',
        product_check_id: 'product-2',
        product_name: 'Second',
        is_favorites: false,
        position: 1,
        frequency_type: 'selected_weekdays',
        status: 'pending',
      },
      {
        routine_entry_id: 'first',
        product_check_id: 'product-1',
        product_name: 'First',
        is_favorites: true,
        front_image: 'front.jpg',
        purchase_link: 'https://example.com',
        position: 0,
        frequency_type: 'daily',
        status: 'done',
      },
    ]

    expect(toShelfItems(items, 'morning', translate)).toEqual([
      expect.objectContaining({
        id: 'first',
        appliedToday: true,
        isFavorites: true,
        stepNumber: 1,
        routineType: 'morning',
      }),
      expect.objectContaining({
        id: 'second',
        appliedToday: false,
        frontImage: '',
        purchaseLink: '',
        stepNumber: 2,
      }),
    ])
  })

  it.each([
    [0, '#8E8E93'],
    [1, '#F43F5E'],
    [8, '#F97316'],
    [14, '#F59E0B'],
    [30, '#0EA5E9'],
    [90, '#6366F1'],
    [365, '#8B5CF6'],
  ])('maps a %i-day streak to its visual tier', (streak, color) => {
    expect(getStreakPalette(streak).color).toBe(color)
  })

  it('maps API entries into stable sorted reorder entries', () => {
    const items: RoutineItem[] = [
      {
        routine_entry_id: 'second',
        product_check_id: 'product-2',
        product_name: 'Second',
        is_favorites: false,
        position: 1,
        frequency_type: 'daily',
        status: 'pending',
      },
      {
        routine_entry_id: 'first',
        product_check_id: 'product-1',
        product_name: 'First',
        is_favorites: false,
        front_image: 'first.jpg',
        position: 0,
        frequency_type: 'daily',
        status: 'pending',
      },
    ]

    const entries = toReorderRoutineEntries(items, 'morning')

    expect(entries.map((entry) => entry.id)).toEqual(['first', 'second'])
    expect(entries[0]).toEqual(
      expect.objectContaining({ frontImage: 'first.jpg', routineType: 'morning' }),
    )
    expect(getRoutineOrderSignature(entries)).toBe('first,second')
  })

  it('builds API reorder positions across both routine sections', () => {
    const morning = toReorderRoutineEntries(
      [
        {
          routine_entry_id: 'morning-entry',
          product_check_id: 'morning-product',
          product_name: 'Morning',
          is_favorites: false,
          position: 0,
          frequency_type: 'daily',
          status: 'pending',
        },
      ],
      'morning',
    )
    const evening = toReorderRoutineEntries(
      [
        {
          routine_entry_id: 'evening-entry',
          product_check_id: 'evening-product',
          product_name: 'Evening',
          is_favorites: false,
          position: 0,
          frequency_type: 'daily',
          status: 'pending',
        },
      ],
      'evening',
    )

    expect(buildReorderRoutinePayload(morning, evening).items).toEqual([
      { position: 0, routineEntryID: 'morning-entry', routineType: 'morning' },
      { position: 0, routineEntryID: 'evening-entry', routineType: 'evening' },
    ])
    expect(hasRoutineOrderChanged(morning, evening, 'morning-entry', 'evening-entry')).toBe(false)
    expect(hasRoutineOrderChanged([...morning].reverse(), evening, 'other', 'evening-entry')).toBe(
      true,
    )
  })

  it('falls back to the section that contains entries', () => {
    const evening = toReorderRoutineEntries(
      [
        {
          routine_entry_id: 'evening-entry',
          product_check_id: 'evening-product',
          product_name: 'Evening',
          is_favorites: false,
          position: 0,
          frequency_type: 'daily',
          status: 'pending',
        },
      ],
      'evening',
    )

    expect(resolveInitialReorderSection('morning', evening, [])).toBe('morning')
    expect(resolveInitialReorderSection('evening', [], evening)).toBe('evening')
    expect(resolveInitialReorderSection('morning', [], evening)).toBe('evening')
    expect(resolveInitialReorderSection('evening', [], [])).toBe('morning')
  })
})
