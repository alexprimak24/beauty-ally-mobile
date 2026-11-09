import { icons } from '@/constants/icons'

export function selectPfpType(gender: string) {
  if (gender === 'female') {
    return icons.mockPfpFemale
  } else if (gender === 'male') {
    return icons.mockPfpMale
  } else {
    return icons.mockPfpFemale
  }
}
