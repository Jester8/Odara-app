import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

const GetStarted = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });

  const buttonScale = useRef(new Animated.Value(1)).current;
  const contentPosition = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        Animated.timing(contentPosition, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fontsLoaded]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('Slides');
    });
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container} onLayout={onLayoutRootView}>
      <ImageBackground
        source={require('../assets/img/blog1.png')}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay}>
          <Animated.View 
            style={[
              styles.content,
              {
                transform: [{ translateY: contentPosition }],
                opacity: opacity,
              }
            ]}
          >
            <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
              BY AFRICANS, FOR AFRICANS
            </Text>
            <Text style={styles.subtitle}>
              Find it here, buy it now!
            </Text>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8} 
                onPress={handlePress}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '300px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    paddingBottom: 20, // Adjust this value as needed
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'BricolageGrotesque_700Bold',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#f2f2f2',
    fontFamily: 'BricolageGrotesque_400Regular',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: '#3D0075',
    paddingVertical: 16,
    paddingHorizontal: 70,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'BricolageGrotesque_600SemiBold',
    letterSpacing: 0.5,
  },
});