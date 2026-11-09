import { icons } from '@/constants/icons'

export function detectEntryStyle(matchSummaryResult: string) {
  let result = { icon: icons.success, color: '#e7faeb', textColor: '#218837' }
  switch (matchSummaryResult) {
    case 'Generally Suitable':
      return result
    case 'Might Not Align':
      result = { icon: icons.warn, color: '#fff7da', textColor: '#B67D00' }
      return result
    case 'Low Match':
      result = { icon: icons.cancel, color: '#ffe6e6', textColor: '#CC2626' }
      return result
    default:
      return result
  }
}
