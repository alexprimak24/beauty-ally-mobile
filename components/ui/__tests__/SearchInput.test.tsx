/// <reference types="jest" />

import { act, fireEvent, render } from '@testing-library/react-native'
import { SearchInput } from '../SearchInput'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, options?: { defaultValue?: string }) => options?.defaultValue ?? 'Search',
  }),
}))

jest.mock('@/design/useRTokens', () => ({
  useRTokens: () => ({
    sizes: { inputMinH: 48, searchIcon: 20 },
    type: { inputFont: 16 },
  }),
}))

describe('SearchInput', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('emits a trimmed query only after the minimum length and debounce delay', async () => {
    const onQueryChange = jest.fn()
    const { getByPlaceholderText } = await render(
      <SearchInput
        placeholder="Search products"
        debounceDelay={300}
        minLength={3}
        onQueryChange={onQueryChange}
      />,
    )
    onQueryChange.mockClear()

    await fireEvent.changeText(getByPlaceholderText('Search products'), '  serum  ')

    expect(onQueryChange).not.toHaveBeenCalled()
    await act(() => jest.advanceTimersByTime(299))
    expect(onQueryChange).not.toHaveBeenCalled()

    await act(() => jest.advanceTimersByTime(1))
    expect(onQueryChange).toHaveBeenCalledTimes(1)
    expect(onQueryChange).toHaveBeenLastCalledWith('serum')
  })

  it('uses two characters as the default minimum query length', async () => {
    const onQueryChange = jest.fn()
    const { getByPlaceholderText } = await render(
      <SearchInput
        placeholder="Search products"
        debounceDelay={300}
        onQueryChange={onQueryChange}
      />,
    )
    const input = getByPlaceholderText('Search products')
    onQueryChange.mockClear()

    await fireEvent.changeText(input, 'a')
    await act(() => jest.advanceTimersByTime(300))
    expect(onQueryChange).not.toHaveBeenCalled()

    await fireEvent.changeText(input, 'ab')
    await act(() => jest.advanceTimersByTime(300))
    expect(onQueryChange).toHaveBeenCalledWith('ab')
  })

  it('clears an active search when the query becomes too short', async () => {
    const onQueryChange = jest.fn()
    const { getByPlaceholderText } = await render(
      <SearchInput
        placeholder="Search products"
        debounceDelay={300}
        minLength={3}
        onQueryChange={onQueryChange}
      />,
    )
    const input = getByPlaceholderText('Search products')
    onQueryChange.mockClear()

    await fireEvent.changeText(input, 'retinol')
    await act(() => jest.advanceTimersByTime(300))
    await fireEvent.changeText(input, 're')
    await act(() => jest.advanceTimersByTime(300))

    expect(onQueryChange).toHaveBeenNthCalledWith(1, 'retinol')
    expect(onQueryChange).toHaveBeenNthCalledWith(2, '')
  })

  it('cancels stale debounce timers while the user is still typing', async () => {
    const onQueryChange = jest.fn()
    const { getByPlaceholderText } = await render(
      <SearchInput
        placeholder="Search products"
        debounceDelay={300}
        minLength={3}
        onQueryChange={onQueryChange}
      />,
    )
    const input = getByPlaceholderText('Search products')
    onQueryChange.mockClear()

    await fireEvent.changeText(input, 'ret')
    await act(() => jest.advanceTimersByTime(200))
    await fireEvent.changeText(input, 'retinol')
    await act(() => jest.advanceTimersByTime(299))
    expect(onQueryChange).not.toHaveBeenCalled()

    await act(() => jest.advanceTimersByTime(1))
    expect(onQueryChange).toHaveBeenCalledTimes(1)
    expect(onQueryChange).toHaveBeenCalledWith('retinol')
  })
})
