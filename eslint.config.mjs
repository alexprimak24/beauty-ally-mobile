import { defineConfig } from 'eslint/config'
import expoConfig from 'eslint-config-expo/flat.js'

export default defineConfig([
  expoConfig,
  {
    ignores: ['.expo/**', 'coverage/**', 'dist/**'],
  },
  {
    rules: {
      // React Compiler is not enabled yet, and these diagnostics conflict with
      // established React Native Animated/Reanimated patterns.
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@react-navigation/native',
              importNames: ['useFocusEffect', 'useNavigation'],
              message:
                'Use navigation hooks from expo-router so they share the Expo Router navigation context.',
            },
          ],
        },
      ],
    },
  },
])
