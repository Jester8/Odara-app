import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTailwind } from 'tailwind-rn';
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
  const tailwind = useTailwind();

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
    flatListRef.current.scrollToIndex({ index: slides.length - 1, animated: true });
  };

  const handleGetStarted = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('Login');
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  if (!fontsLoaded) return null;

  return (
    <View style={tailwind('flex-1 bg-white')} onLayout={onLayoutRootView}>
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
              tailwind('items-center justify-center'),
              {
                width,
                paddingTop: 60,
                paddingHorizontal: 20,
                transform: [{ scale: animatedValues[index] }],
              },
            ]}
          >
            <Image
              source={item.image}
              resizeMode="contain"
              onError={(e) => console.log('Image error:', e.nativeEvent.error)}
              style={{
                width: '100%',
                height: 300,
                marginBottom: 30,
              }}
            />
            <Text
              style={[
                tailwind('text-center'),
                {
                  fontSize: 24,
                  fontFamily: 'BricolageGrotesque_700Bold',
                  color: '#1c0032',
                  marginBottom: 16,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                tailwind('text-center text-gray-600'),
                {
                  fontSize: 16,
                  lineHeight: 24,
                  paddingHorizontal: 30,
                  fontFamily: 'BricolageGrotesque_400Regular',
                },
              ]}
            >
              {item.description}
            </Text>
          </Animated.View>
        )}
      />

      <SafeAreaView
        edges={['bottom']}
        style={[
          tailwind('absolute left-0 right-0 flex-row justify-between items-center'),
          {
            bottom: 0,
            paddingHorizontal: 30,
            paddingBottom: 30,
            backgroundColor: 'rgba(255,255,255,0.9)',
          },
        ]}
      >
        <View style={tailwind('flex-row items-center')}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                tailwind('h-2 rounded-full mx-1'),
                {
                  width: currentIndex === i ? 16 : 8,
                  backgroundColor: currentIndex === i ? '#1c0032' : '#ccc',
                },
              ]}
            />
          ))}
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={currentIndex === slides.length - 1 ? handleGetStarted : handleNext}
            activeOpacity={0.8}
            style={[
              tailwind('rounded-full'),
              {
                backgroundColor: currentIndex === slides.length - 1 ? '#1c0032' : '#f0f0f0',
                paddingHorizontal: 25,
                paddingVertical: 12,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'BricolageGrotesque_600SemiBold',
                color: currentIndex === slides.length - 1 ? '#fff' : '#1c0032',
              }}
            >
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>

      <TouchableOpacity
        onPress={handleSkip}
        style={[
          tailwind('absolute z-10'),
          { top: 50, right: 20, padding: 10 },
        ]}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'BricolageGrotesque_600SemiBold',
            color: '#1c0032',
            opacity: 0.8,
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Slides;
