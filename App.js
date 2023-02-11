import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import QRReader from './src/screens/QRReader';
import Camera from './src/screens/Camera';
import Test from './src/screens/Test';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';


const App = () => {

  const {width, height} = useWindowDimensions()
  const [openedFromUrl, setOpenedFromUrl] = useState(false)
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(true)

  const handleDynamicLink = link => {
    if (link) {
      setLink(link.url)
      dynamicLinks()
        .getInitialLink()
        .then(() => {
          setOpenedFromUrl(true)
        });
    }
  }

  useEffect(() => {

    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && link.url) {
          setLink(link.url)
          setOpenedFromUrl(true)
        }
      });

    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, [])

  setTimeout(()=>{
    setLoading(false)
  },300)

  if (loading) {
    return <View style={{width,height, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} />
    </View>
  }

  return <GestureHandlerRootView style={{ flex: 1 }}>

    {
      openedFromUrl ? <Camera link={link} /> : <QRReader setLink={setLink} />
    }

    {/* <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,

      }}>
        <Stack.Screen name='QR' component={QRReader} />
        <Stack.Screen name='Test' component={Test} />
      </Stack.Navigator>
    </NavigationContainer> */}

  </GestureHandlerRootView>
}

export default App
{/* <Stack.Screen name='Welcome' component={Welcome} /> */ }
{/* <Stack.Screen name='Camera' component={Camera} /> */ }