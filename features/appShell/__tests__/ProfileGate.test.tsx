/// <reference types="jest" />

import { fireEvent, render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { useUser } from '@/hooks/useGetUser'
import { ProfileGate } from '../components/ProfileGate'

jest.mock('@/hooks/useGetUser', () => ({ useUser: jest.fn() }))
jest.mock('expo-router', () => {
  const { Text: MockText } = jest.requireActual('react-native')
  return { Redirect: ({ href }: { href: string }) => <MockText>{href}</MockText> }
})
jest.mock('../components/LayoutGateState', () => {
  const { Pressable: MockPressable, Text: MockText } = jest.requireActual('react-native')
  return {
    LayoutGateState: ({ onRetry, variant }: { onRetry?: () => void; variant: string }) => (
      <MockPressable onPress={onRetry} testID="gate-state">
        <MockText>{variant}</MockText>
      </MockPressable>
    ),
  }
})

const mockUseUser = jest.mocked(useUser)

describe('ProfileGate', () => {
  it('retries the profile request from the error state', async () => {
    const refetch = jest.fn()
    mockUseUser.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      isRefetching: false,
      refetch,
    } as never)

    const { getByTestId, getByText } = await render(
      <ProfileGate>
        <Text>Protected content</Text>
      </ProfileGate>,
    )

    expect(getByText('error')).toBeTruthy()
    await fireEvent.press(getByTestId('gate-state'))
    expect(refetch).toHaveBeenCalledTimes(1)
  })

  it('shows the loading state while the profile is unavailable', async () => {
    mockUseUser.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
      isRefetching: false,
      refetch: jest.fn(),
    } as never)

    const { getByText } = await render(
      <ProfileGate>
        <Text>Protected content</Text>
      </ProfileGate>,
    )

    expect(getByText('loading')).toBeTruthy()
  })

  it('redirects users whose backend profile does not exist', async () => {
    mockUseUser.mockReturnValue({
      data: { exists: false },
      isError: false,
      isLoading: false,
      isRefetching: false,
      refetch: jest.fn(),
    } as never)

    const { getByText } = await render(
      <ProfileGate>
        <Text>Protected content</Text>
      </ProfileGate>,
    )

    expect(getByText('/(auth)/onboarding/welcome')).toBeTruthy()
  })

  it('renders protected content when the profile exists', async () => {
    mockUseUser.mockReturnValue({
      data: { exists: true },
      isError: false,
      isLoading: false,
      isRefetching: false,
      refetch: jest.fn(),
    } as never)

    const { getByText } = await render(
      <ProfileGate>
        <Text>Protected content</Text>
      </ProfileGate>,
    )

    expect(getByText('Protected content')).toBeTruthy()
  })
})
