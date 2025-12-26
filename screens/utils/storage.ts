import * as SecureStore from 'expo-secure-store';

export const setOnboardingCompleted = async (completed: boolean) => {
  await SecureStore.setItemAsync('onboardingCompleted', completed.toString());
};

export const isOnboardingCompleted = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync('onboardingCompleted');
  return value === 'true';
};
