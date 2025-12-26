import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface OnboardingState {
  onboardingCompleted: boolean;
  initialAuthScreen: 'Login' | 'Signup';
  isLoading: boolean;
  
  // Actions
  initializeOnboarding: () => Promise<void>;
  completeOnboarding: (screen: 'Login' | 'Signup') => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  onboardingCompleted: false,
  initialAuthScreen: 'Login',
  isLoading: true,

  initializeOnboarding: async () => {
    try {
      const onboarding = await SecureStore.getItemAsync('onboardingCompleted');
      const onboardingDone = onboarding === 'true';

      const screen = (await SecureStore.getItemAsync('initialAuthScreen')) as 'Login' | 'Signup' || 'Login';

      set({
        onboardingCompleted: onboardingDone,
        initialAuthScreen: screen,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error initializing onboarding:', error);
      set({
        onboardingCompleted: false,
        initialAuthScreen: 'Login',
        isLoading: false,
      });
    }
  },

  completeOnboarding: async (screen: 'Login' | 'Signup') => {
    try {
      console.log('Completing onboarding for screen:', screen);
      
      // Save to SecureStore
      await SecureStore.setItemAsync('onboardingCompleted', 'true');
      await SecureStore.setItemAsync('initialAuthScreen', screen);

      // Immediately update state (no polling needed)
      set({
        onboardingCompleted: true,
        initialAuthScreen: screen,
      });

      console.log('Onboarding completed successfully');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  resetOnboarding: async () => {
    try {
      await SecureStore.deleteItemAsync('onboardingCompleted');
      await SecureStore.deleteItemAsync('initialAuthScreen');

      set({
        onboardingCompleted: false,
        initialAuthScreen: 'Login',
      });
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },
}));