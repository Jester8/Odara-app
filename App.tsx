import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from './screens/src/store/useAuthStore.js';

import Slides from './screens/Slides';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import Congrats from './screens/auth/Congrats';
import Confirm from './screens/auth/Confirm';
import EmailCongrats from './screens/auth/EmailCongrats';
import ForgotPassword from './screens/auth/ForgotPassword';
import GetStarted from './screens/GetStarted';
import Navigation from './screens/navigation/Navigation';
import OtpScreen from './screens/auth/OtpScreen.js';
import ResetPassword from './screens/auth/ResetPassword';
import GuestProfile from './screens/home/GuestProfile.js';
import UserProfile from './screens/home/UserProfile.js';
import EditUserProfile from './screens/home/EditUserProfile';
import ViewProduct from './screens/home/product/ViewProduct.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const initialRoute = useAuthStore((state) => state.initialRoute);

  useEffect(() => {
    fetchUser(); 
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d0033" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="Slides" component={Slides} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={RegisterScreen} />
        <Stack.Screen name="Congrats" component={Congrats} />
        <Stack.Screen name="Confirm" component={Confirm} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="navigation" component={Navigation} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="GuestProfile" component={GuestProfile} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
        <Stack.Screen name="EmailCongrats" component={EmailCongrats} /> 
        <Stack.Screen name="ViewProduct" component={ViewProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
