import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import QRReader from './src/screens/QRReader';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TabBarNavigation from './src/navigators/TabBarNavigation';
import Orientation from 'react-native-orientation-locker';
import { Provider } from 'react-redux';
import store from './src/store/store';
import UploadScreen from './src/screens/UploadScreen';
import Loader from './src/components/Loader';

const Stack = createNativeStackNavigator()

const App = () => {
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(true)

  const handleDynamicLink = link => {
    if (link) {
      dynamicLinks().getInitialLink().then(() => {
        setLink(link.url)
      });
    }
  }

  useEffect(() => {
    Orientation.lockToLandscapeLeft();
    dynamicLinks().getInitialLink().then(link => {
      if (link && link.url) {
        setLink(link.url)
      }
    });

    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, [])

  setTimeout(() => {
    setLoading(false)
  }, 300)

  if (loading) return <Loader />

  return <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureDirection: 'vertical',
          unmountOnBlur: true,
        }}>
          {
            link ?
              <>
                <Stack.Screen name='Tabs' component={TabBarNavigation} initialParams={{ link }} />
                <Stack.Screen name='Upload' component={UploadScreen} initialParams={{ link }}/>
              </>
              : <>
                <Stack.Screen name='QR' component={QRReader} />
                <Stack.Screen name='Tabs' component={TabBarNavigation} />
                <Stack.Screen name='Upload' component={UploadScreen} initialParams={{ link }} />
              </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  </GestureHandlerRootView>
}

export default App