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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

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

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }), []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < slides.length - 1) {
        handleNext(true);
      } else {
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = (auto = false) => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (currentIndex < slides.length - 1) {
        animateFade();
        flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
        setCurrentIndex(currentIndex + 1);
      } else if (!auto) {
        navigation.replace('Signup');
      }
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      animateFade();
      flatListRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
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

  const handleSkip = () => {
    navigation.replace('navigation');
  };

  const handleGetStarted = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.replace('Signup');
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
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
          {currentIndex > 0 && (
            <TouchableOpacity onPress={handlePrev}>
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
            >
              <Text style={styles.navText}>
                {currentIndex === slides.length - 1 ? 'Join us' : 'Next'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>

      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
        <View style={styles.skipIcon}>
          <View style={styles.skipIconArrow} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Slides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height: '100%',
  },
  fullImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontFamily: 'BricolageGrotesque_700Bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: '#fff',
    textAlign: 'left',
    lineHeight: 24,
    paddingHorizontal: 0,
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTextContainer: {
    minWidth: 50,
    justifyContent: 'center',
  },
  navText: {
    fontSize: 16,
    fontFamily: 'BricolageGrotesque_600SemiBold',
    color: '#fff',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#999',
  },
  activeDot: {
    width: 16,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'BricolageGrotesque_600SemiBold',
    color: '#fff',
    opacity: 0.9,
  },
  skipIcon: {
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipIconArrow: {
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopColor: '#000',
    borderRightColor: '#000',
    transform: [{ rotate: '45deg' }],
  },
});