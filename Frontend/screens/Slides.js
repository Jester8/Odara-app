import React, { useRef, useState, useMemo, useCallback } from 'react';
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
    description: 'Explore a wide range of African fashion, crafts, and lifestyle essentials—all in one place.',
    image: require('../assets/img/slide1.png'),
  },
  {
    id: '2',
    title: 'Make Payment',
    description: 'Pay securely using local and global payment options tailored for African shoppers.',
    image: require('../assets/img/slide2.png'),
  },
  {
    id: '3',
    title: 'Get Your Order',
    description: 'Enjoy fast delivery and track your order to your doorstep across Africa and beyond.',
    image: require('../assets/img/slide3.png'),
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
  const animatedValues = slides.map(() => useRef(new Animated.Value(1)).current);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }), []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleNext = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (currentIndex < slides.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      }
    });
  };

 const handleSkip = () => {
  navigation.replace('navigation');
};

const handleGetStarted = () => {
  Animated.sequence([
    Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
    Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
  ]).start(() => {
    navigation.replace('Login');
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
        renderItem={({ item, index }) => (
          <Animated.View
            style={[
              styles.slide,
              {
                transform: [{ scale: animatedValues[index] }],
              },
            ]}
          >
            <Image
              source={item.image}
              resizeMode="contain"
              onError={(e) => console.log('Image error:', e.nativeEvent.error)}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>
        )}
      />

      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
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

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={currentIndex === slides.length - 1 ? handleGetStarted : handleNext}
            activeOpacity={0.8}
            style={[
              styles.button,
              currentIndex === slides.length - 1
                ? styles.buttonDark
                : styles.buttonLight,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                currentIndex === slides.length - 1
                  ? styles.buttonTextLight
                  : styles.buttonTextDark,
              ]}
            >
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>

      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Slides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'BricolageGrotesque_700Bold',
    color: '#1c0032',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 30,
    paddingBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: '#ccc',
  },
  activeDot: {
    width: 16,
    backgroundColor: '#1c0032',
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  buttonLight: {
    backgroundColor: '#f0f0f0',
  },
  buttonDark: {
    backgroundColor: '#1c0032',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'BricolageGrotesque_600SemiBold',
  },
  buttonTextDark: {
    color: '#1c0032',
  },
  buttonTextLight: {
    color: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'BricolageGrotesque_600SemiBold',
    color: '#1c0032',
    opacity: 0.8,
  },
});
