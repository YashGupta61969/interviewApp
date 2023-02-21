import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import QRReader from './src/screens/QRReader';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
// import Welcome from './src/screens/Welcome';
import TabBarNavigation from './src/navigators/TabBarNavigation';
import Orientation from 'react-native-orientation-locker';

const Stack = createNativeStackNavigator()

const App = () => {

  const { width, height } = useWindowDimensions()
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(true)

  const handleDynamicLink = link => {
    if (link) {
      dynamicLinks()
        .getInitialLink()
        .then(() => {
          setLink(link.url)
        });
    }
  }

  useEffect(() => {
    Orientation.lockToLandscape();

    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && link.url) {
          setLink(link.url)
        }
      });
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, [])

  setTimeout(() => {
    setLoading(false)
  }, 300)

  if (loading) {
    return <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} />
    </View>
  }

  // return <Camera/>

  return <GestureHandlerRootView style={{ flex: 1 }}>

    <NavigationContainer>
      <Stack.Navigator ges screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureDirection: 'vertical',
        unmountOnBlur: true,
      }}>
        {
          link ? <>
            <Stack.Screen name='Tabs' component={TabBarNavigation} initialParams={{ link }} />
          </> : <>
            <Stack.Screen name='QR' component={QRReader} initialParams={{ setLink: setLink }} />
            {/* <Stack.Screen name='Welcome' component={Welcome} initialParams={{ link }} /> */}
            <Stack.Screen name='Tabs' component={TabBarNavigation} initialParams={{ link }} />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>

  </GestureHandlerRootView>
}

export default App