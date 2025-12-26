import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import { useOnboardingStore } from '../screens/src/store/onboardingStore';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Choose Products',
    description: 'Browse and select from a rich collection of authentic African fashion, crafts, and lifestyle products.',
    image: require('../assets/img/choose.png'),
  },
  {
    id: '2',
    title: 'Make Payment',
    description: 'Use trusted local and international payment methods to complete your purchase securely.',
    image: require('../assets/img/pay.png'),
  },
  {
    id: '3',
    title: 'Get Your Order',
    description: 'Enjoy fast and reliable delivery right to your doorstep, anywhere in Africa and beyond.',
    image: require('../assets/img/order.png'),
  },
];

const Slides = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });

  const { completeOnboarding } = useOnboardingStore();

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }), []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < slides.length - 1) {
        handleNext(true);
      } else {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleCompleteOnboarding = useCallback(async (screen: 'Login' | 'Signup') => {
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      await completeOnboarding(screen);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsNavigating(false);
    }
  }, [isNavigating, completeOnboarding]);

  const handleSkip = async () => {
    await handleCompleteOnboarding('Login');
  };

  const handleNext = (auto = false) => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (currentIndex < slides.length - 1) {
        animateFade();
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        setCurrentIndex(currentIndex + 1);
      } else if (!auto) {
        handleGetStarted();
      }
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      animateFade();
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const animateFade = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleGetStarted = async () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(async () => {
      await handleCompleteOnboarding('Signup');
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
            <Image source={item.image} resizeMode="cover" style={styles.fullImage} />
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Animated.View>
        )}
      />

      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        <View style={styles.navTextContainer}>
          {currentIndex > 0 && !isNavigating && (
            <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
              <Text style={styles.navText}>Prev</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.navTextContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={currentIndex === slides.length - 1 ? handleGetStarted : () => handleNext()}
              activeOpacity={0.8}
              disabled={isNavigating}
              style={styles.navButton}
            >
              {isNavigating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.navText}>
                  {currentIndex === slides.length - 1 ? 'Join us' : 'Next'}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>

      <TouchableOpacity 
        onPress={handleSkip} 
        style={styles.skipButton}
        disabled={isNavigating}
        activeOpacity={0.7}
      >
        {isNavigating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.skipText}>Skip</Text>
            <View style={styles.skipIcon}>
              <View style={styles.skipIconArrow} />
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Slides;

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Slide
  slide: {
    width,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // Image
  fullImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },

 

  // Text Container
  textContainer: {
    position: 'absolute',
    bottom: 140,
    left: 24,
    right: 24,
    alignItems: 'flex-start',
    zIndex: 5,
  },


  title: {
    fontSize: 25,
    fontFamily: 'BricolageGrotesque_700Bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'left',
    lineHeight: 40,
  },

  
  description: {
    fontSize: 15,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: '#e0e0e0',
    textAlign: 'left',
    lineHeight: 24,
    opacity: 0.95,
  },

  


  
  navTextContainer: {
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  
  navText: {
    fontSize: 13,
    fontFamily: 'BricolageGrotesque_600SemiBold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },


  dot: {
    height: 7,
    width: 7,
    borderRadius: 3.5,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.6,
  },

  
  activeDot: {
    width: 18,
    backgroundColor: '#ffffff',
    opacity: 1,
  },

  
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    padding: 12,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  
  skipText: {
    fontSize: 12,
    fontFamily: 'BricolageGrotesque_600SemiBold',
    color: '#ffffff',
    opacity: 0.95,
    letterSpacing: 0.3,
  },


  skipIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },


  skipIconArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopColor: '#ffffff',
    borderRightColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
  },
});