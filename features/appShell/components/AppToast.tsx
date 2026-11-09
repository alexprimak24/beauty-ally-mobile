import { Dimensions, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { BaseToastProps, ToastConfig } from 'react-native-toast-message'
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message'

const baseToastContentStyle = { paddingHorizontal: 15, paddingVertical: 8 }
const text1Style = {
  fontSize: 15,
  fontWeight: '400' as const,
  fontFamily: 'Quicksand-Medium',
}
const text2Style = { fontFamily: 'Quicksand-Regular' }

function BackendErrorToast(props: BaseToastProps) {
  const width = Dimensions.get('window').width

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderLeftColor: '#ffe5e5',
        borderLeftWidth: 5,
        borderRadius: 35,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: width * 0.05,
        marginTop: 10,
        minHeight: 60,
        maxWidth: width * 0.9,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '400',
          fontFamily: 'Quicksand-Medium',
          color: '#000',
          flexWrap: 'wrap',
          lineHeight: 18,
        }}
      >
        {props.text1}
      </Text>
      {props.text2 ? (
        <Text
          style={{
            fontFamily: 'Quicksand-Regular',
            color: '#555',
            marginTop: 2,
            flexWrap: 'wrap',
          }}
        >
          {props.text2}
        </Text>
      ) : null}
    </View>
  )
}

const toastConfig: ToastConfig = {
  info: (props) => (
    <InfoToast
      {...props}
      contentContainerStyle={baseToastContentStyle}
      style={{ borderLeftColor: '#ffe4b5', borderLeftWidth: 5, borderRadius: 35 }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
  success: (props) => (
    <BaseToast
      {...props}
      contentContainerStyle={baseToastContentStyle}
      style={{ borderLeftColor: '#d6f5d6', borderLeftWidth: 5, borderRadius: 35 }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      contentContainerStyle={baseToastContentStyle}
      style={{ borderLeftColor: '#ffe5e5', borderLeftWidth: 5, borderRadius: 35 }}
      text1Style={text1Style}
      text2Style={text2Style}
    />
  ),
  backErrors: (props) => <BackendErrorToast {...props} />,
}

export function AppToast() {
  const insets = useSafeAreaInsets()

  return <Toast config={toastConfig} topOffset={Math.max(60, insets.top + 20)} />
}
