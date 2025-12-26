import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

import useAuthStore from './screens/src/store/useAuthStore';
import { useOnboardingStore } from './screens/src/store/onboardingStore';

// Auth Screens
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import Congrats from './screens/auth/Congrats';
import EmailCongrats from './screens/auth/EmailCongrats';
import ConfirmEmail from './screens/auth/Confirm';
import OtpScreen from './screens/auth/OtpScreen';
import ForgotPassword from './screens/auth/ForgotPassword';
import ResetPassword from './screens/auth/ResetPassword';

// Onboarding Screens
import GetStarted from './screens/GetStarted';
import Slides from './screens/Slides';

// App Screens (Protected)
import Navigation from './screens/navigation/Navigation';
import GuestProfile from './screens/home/GuestProfile';
import UserProfile from './screens/home/UserProfile';
import EditUserProfile from './screens/home/EditUserProfile';
import ViewProduct from './screens/home/product/ViewProduct';

SplashScreen.preventAutoHideAsync();

type RootStackParamList = {
  // Onboarding
  GetStarted: undefined;
  Slides: undefined;
  
  // Auth
  Login: undefined;
  Signup: undefined;
  Congrats: { email: string };
  Confirm: { email: string };
  EmailCongrats: undefined;
  OtpScreen: { email: string; type: 'verification' | 'reset' };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  
  // App (Protected)
  Home: undefined;
  UserProfile: undefined;
  EditUserProfile: undefined;
  GuestProfile: undefined;
  ViewProduct: { productId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <ActivityIndicator size="large" color="#1c0032" />
  </View>
);

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GetStarted" component={GetStarted} />
    <Stack.Screen name="Slides" component={Slides} />
  </Stack.Navigator>
);

const AuthStack = ({ initialScreen }: { initialScreen: 'Login' | 'Signup' }) => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animationEnabled: true,
    }}
    initialRouteName={initialScreen}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen}
      options={{ animationEnabled: false }}
    />
    <Stack.Screen 
      name="Signup" 
      component={RegisterScreen}
    />
    <Stack.Screen 
      name="Congrats" 
      component={Congrats}
      options={{ animationEnabled: false }}
    />
    <Stack.Screen 
      name="Confirm" 
      component={ConfirmEmail}
    />
    <Stack.Screen 
      name="EmailCongrats" 
      component={EmailCongrats}
      options={{ animationEnabled: false }}
    />
    <Stack.Screen 
      name="OtpScreen" 
      component={OtpScreen}
    />
    <Stack.Screen 
      name="ForgotPassword" 
      component={ForgotPassword}
    />
    <Stack.Screen 
      name="ResetPassword" 
      component={ResetPassword}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={Navigation}
      options={{ animationEnabled: false }}
    />
    <Stack.Screen 
      name="UserProfile" 
      component={UserProfile}
    />
    <Stack.Screen 
      name="EditUserProfile" 
      component={EditUserProfile}
    />
    <Stack.Screen 
      name="GuestProfile" 
      component={GuestProfile}
    />
    <Stack.Screen 
      name="ViewProduct" 
      component={ViewProduct}
    />
  </Stack.Navigator>
);

export default function App(): React.ReactElement {
  const { 
    isLoading: authLoading, 
    isAuthenticated, 
    initializeAuth 
  } = useAuthStore();

  const { 
    onboardingCompleted, 
    initialAuthScreen, 
    isLoading: onboardingLoading, 
    initializeOnboarding 
  } = useOnboardingStore();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Initialize both stores
        await initializeOnboarding();
        await initializeAuth();
      } catch (error) {
        console.error('Bootstrap error:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    bootstrap();
  }, []);

  // Show loading while checking auth
  if (onboardingLoading || authLoading) {
    return <LoadingScreen />;
  }

  // Determine which stack to show
  if (!onboardingCompleted) {
    return (
      <NavigationContainer>
        <OnboardingStack />
      </NavigationContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthStack initialScreen={initialAuthScreen} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}