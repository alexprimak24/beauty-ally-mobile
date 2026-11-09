import type { ImageSourcePropType } from 'react-native'

export interface ResultCardConfig {
  image: ImageSourcePropType
  title: string
  value: string
  frequency?: string
  backgroundColor: string
}

export type ResultVerdictConfig = {
  color: string
  icon: ImageSourcePropType
  textColor: string
}
