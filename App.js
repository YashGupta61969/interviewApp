import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Camera from './src/screens/Camera';
import QRReader from './src/screens/QRReader';

const Stack = createNativeStackNavigator();

const App = () => {
  return <NavigationContainer>
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='QR' component={QRReader}/>
      <Stack.Screen name='Camera' component={Camera} />
    </Stack.Navigator>
  </NavigationContainer>
}

export default App