import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getInitialMultiSelectState, serializeSelection, toggleExclusiveSelection } from '../model'

interface MultiSelectQuestionConfig {
  exclusiveValue: string
  initial?: string
  knownValues: readonly string[]
  supportsOther?: boolean
}

export function useMultiSelectQuestion({
  exclusiveValue,
  initial,
  knownValues,
  supportsOther = false,
}: MultiSelectQuestionConfig) {
  const getInitialState = useCallback(
    () => getInitialMultiSelectState(initial, knownValues, supportsOther),
    [initial, knownValues, supportsOther],
  )
  const [state, setState] = useState(getInitialState)
  const hasInteracted = useRef(false)

  useEffect(() => {
    if (!initial || hasInteracted.current) return
    setState(getInitialState())
  }, [getInitialState, initial])

  const select = useCallback(
    (value: string) => {
      hasInteracted.current = true
      setState((current) => ({
        other: '',
        selected: toggleExclusiveSelection(current.selected, value, exclusiveValue),
      }))
    },
    [exclusiveValue],
  )

  const setOther = useCallback((other: string) => {
    hasInteracted.current = true
    setState({ other, selected: [] })
  }, [])

  const value = useMemo(
    () => serializeSelection(state.selected, state.other),
    [state.other, state.selected],
  )

  return {
    other: state.other,
    select,
    selected: state.selected,
    setOther,
    value,
  }
}
