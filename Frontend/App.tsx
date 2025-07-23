import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './screens/SplashScreen';
import Slides from './screens/Slides';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import Congrats from './screens/auth/Congrats';
import Confirm from './screens/auth/Confirm';
import ForgotPassword from './screens/auth/ForgotPassword';
import GetStarted from './screens/GetStarted';
import Navigation from './screens/navigation/Navigation';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      setInitialRoute(isLoggedIn === 'true' ? 'navigation' : 'Splash');
    };

    checkLoginStatus();
  }, []);

  if (!initialRoute) return null; 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="Slides" component={Slides} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={RegisterScreen} />
        <Stack.Screen name="Congrats" component={Congrats} />
        <Stack.Screen name="Confirm"  component= {Confirm} />

        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="navigation" component={Navigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
