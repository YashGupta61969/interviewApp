import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Camera from './src/screens/Camera';
import QRReader from './src/screens/QRReader';
import Welcome from './src/screens/Welcome';

const Stack = createNativeStackNavigator();

const App = () => {
  return <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        {/* <Stack.Screen name='Welcome' component={Welcome} /> */}
        <Stack.Screen name='Camera' component={Camera} />
        <Stack.Screen name='QR' component={QRReader} />
      </Stack.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>
}

export default App