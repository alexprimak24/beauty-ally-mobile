import { useRTokens } from '@/design/useRTokens'
import { components } from '@/utils/i18n/keyConstants'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TextInput } from 'react-native'

interface SearchInputProps {
  placeholder?: string
  onQueryChange?: (query: string) => void
  debounceDelay?: number
  minLength?: number
  containerClassName?: string
  inputClassName?: string
  iconColor?: string
  iconSize?: number
}

export const SearchInput = React.memo(function SearchInput({
  placeholder,
  onQueryChange,
  debounceDelay = 500,
  minLength = 2,
  containerClassName = 'bg-white my-5',
  inputClassName = '',
  iconColor = '#212529',
  iconSize,
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null)
  const { sizes, type } = useRTokens()
  const { t } = useTranslation(components)

  const ph = placeholder ?? t('searchInput.placeholder', { defaultValue: 'Search products…' })

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = query.trim()
      if (trimmed.length >= minLength) setDebouncedQuery(trimmed)
      else setDebouncedQuery('')
    }, debounceDelay)
    return () => clearTimeout(handler)
  }, [query, debounceDelay, minLength])

  useEffect(() => {
    onQueryChange?.(debouncedQuery)
  }, [debouncedQuery, onQueryChange])

  return (
    <Pressable
      accessible={false}
      className={`w-full flex-row items-center rounded-full bg-white px-4 py-2 ${containerClassName}`}
      onPress={() => inputRef.current?.focus()}
      style={{ minHeight: sizes.inputMinH }}
    >
      <Ionicons
        name="search"
        size={iconSize ?? sizes.searchIcon}
        color={iconColor}
        className="mr-2"
      />
      <TextInput
        ref={inputRef}
        className={`flex-1 text-dark ${inputClassName} font-quicksandSemiBold`}
        placeholder={ph}
        style={{ fontSize: type.inputFont }}
        placeholderTextColor="rgba(33, 37, 41, 0.50)"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </Pressable>
  )
})
