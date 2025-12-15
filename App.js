import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LanguageSelection from './src/screens/LanguageSelection';
import ChooseAccount from './src/screens/ChooseAccount'; // only if exists
import ProviderSignUp from './src/screens/ProviderSignUp'; // only if exists
import UserSignUp from './src/screens/UserSignUp'; // only if exists
import OTPVerification from './src/screens/OTPVerification'; // only if exists
import HomeScreen from './src/screens/HomeScreen'; // only if exists


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* First screen */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Next screens */}
        <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
        <Stack.Screen name="ChooseAccount" component={ChooseAccount} />
        <Stack.Screen name="ProviderSignUp" component={ProviderSignUp} />
        <Stack.Screen name="UserSignUp" component={UserSignUp} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
