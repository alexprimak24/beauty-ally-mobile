import { icons } from '@/constants/icons'
import { useRTokens } from '@/design/useRTokens'
import { BlurView } from 'expo-blur'
import { Tabs, useRouter } from 'expo-router'
import type { ComponentProps } from 'react'
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { TabBarIcon } from './TabBarIcon'
import { TabBarScanButton } from './TabBarScanButton'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 35,
    left: 20,
    right: 20,
    overflow: 'visible',
    zIndex: 10,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 39,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

type ExpoRouterTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0]

export function MainTabBar({ state, navigateToTab }: ExpoRouterTabBarProps) {
  const currentRoute = state.routes[state.index].name
  const router = useRouter()
  const { sizes } = useRTokens()

  const navigateToRoute = (routeName: string) => {
    const route = state.routes.find((item) => item.name === routeName)
    if (route) navigateToTab(route.key)
  }

  return (
    <View style={[{ height: sizes.navbarH, borderRadius: sizes.navbarRound }, styles.wrapper]}>
      {Platform.OS === 'android' ? (
        <View
          style={[
            styles.blurContainer,
            { backgroundColor: '#FFF', borderRadius: sizes.navbarRound },
          ]}
        >
          {/* Home */}
          <TouchableOpacity style={styles.tab} onPress={() => navigateToRoute('index')}>
            <TabBarIcon
              focused={currentRoute === 'index'}
              icon={icons.homeInactive}
              activeIcon={icons.homeActive}
            />
          </TouchableOpacity>

          {/* Spacer for Scan */}
          <View style={{ width: sizes.spacer, marginHorizontal: sizes.spacerM }} />

          {/* Profile */}
          <TouchableOpacity style={styles.tab} onPress={() => navigateToRoute('profile')}>
            <TabBarIcon
              focused={currentRoute === 'profile'}
              icon={icons.userInactive}
              activeIcon={icons.userActive}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <BlurView
          intensity={45}
          tint="light"
          blurReductionFactor={2}
          style={[styles.blurContainer, { borderRadius: sizes.navbarRound }]}
          blurMethod="dimezisBlurView"
        >
          {/* Home */}
          <TouchableOpacity style={styles.tab} onPress={() => navigateToRoute('index')}>
            <TabBarIcon
              focused={currentRoute === 'index'}
              icon={icons.homeInactive}
              activeIcon={icons.homeActive}
            />
          </TouchableOpacity>

          {/* Spacer for Scan */}
          <View style={{ width: sizes.spacer, marginHorizontal: sizes.spacerM }} />
          {/* Profile */}
          <TouchableOpacity style={styles.tab} onPress={() => navigateToRoute('profile')}>
            <TabBarIcon
              focused={currentRoute === 'profile'}
              icon={icons.userInactive}
              activeIcon={icons.userActive}
            />
          </TouchableOpacity>
        </BlurView>
      )}

      <TabBarScanButton
        onPress={() => router.push({ pathname: '/scan', params: { side: 'front' } })}
      >
        <Image source={icons.scan} style={{ width: sizes.scanBtnImg, height: sizes.scanBtnImg }} />
      </TabBarScanButton>
    </View>
  )
}
