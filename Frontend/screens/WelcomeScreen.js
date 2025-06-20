import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold
} from '@expo-google-fonts/bricolage-grotesque';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const WelcomeScreen = ({ navigation }) => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });
  
  // Create animated value for button press effect
  const animatedScale = new Animated.Value(1);
  
  // Hide splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }
  
  const handlePress = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Navigate to Signup after animation completes
      navigation.navigate('Login');
    });
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Image 
        source={require('../assets/img/odara.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.spacer} />
        
        <Text style={styles.title}>Welcome to Our Store</Text>
        <Text style={styles.subtitle}>Discover amazing products at great prices</Text>
        
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handlePress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with 50% opacity
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // center vertically
    paddingHorizontal: 20,
  },
  spacer: {
    height: 0, // effectively disables the spacer
  },
  
  title: {
    fontSize: 32,
    fontFamily: 'BricolageGrotesque_700Bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: '#f0f0f0',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50, // Full border radius for pill shape
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'BricolageGrotesque_600SemiBold',
  },
});

export default WelcomeScreen;