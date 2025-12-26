import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Product from './product/Product';
import useAuthStore from '../src/store/useAuthStore';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuthStore();

  /* ---------- LOAD FONTS ---------- */
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });

  const bannerSlides = [
    {
      id: '1',
      image: require('../../assets/img/main.png'),
    },
    {
      id: '2',
      image: require('../../assets/img/main.png'),
    },
    {
      id: '3',
      image: require('../../assets/img/main.png'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === bannerSlides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carouselRef.current && currentSlide !== undefined) {
      carouselRef.current.scrollToIndex({
        index: currentSlide,
        animated: true,
      });
    }
  }, [currentSlide]);

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const Header = () => <View style={styles.header} />;

  const TopTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContentContainer}
    >
      {['All', 'Women', 'Men', 'Kids', 'Home', 'Fashion', 'Arts'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.tabButton}
          onPress={() => setSelectedTab(tab)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText,
            ]}
            numberOfLines={1}
          >
            {tab}
          </Text>

          {selectedTab === tab && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const PromoSection = () => (
    <View style={styles.promoContainer}>
      <View style={styles.carouselWrapper}>
        <FlatList
          ref={carouselRef}
          data={bannerSlides}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={() => {}}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setCurrentSlide(index);
          }}
          renderItem={({ item }) => (
            <View style={{ width: width }}>
              <View style={styles.promoRow}>
                <View style={styles.promoContent}>
                  <Text style={styles.promoSubtitle}>Premium Collections</Text>
                  <Text style={styles.promoTitle}>
                    Shop Genuine{'\n'}African Products{'\n'}on Odara
                  </Text>
                  <TouchableOpacity style={styles.shopButton}>
                    <Text style={styles.shopButtonText}>SHOP NOW →</Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={item.image}
                  style={styles.promoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        />

        <View style={styles.dotsContainer}>
          {bannerSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                { opacity: currentSlide === index ? 1 : 0.4 },
              ]}
              onPress={() => setCurrentSlide(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Header />

        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchText}>Search Odara</Text>

            <TouchableOpacity style={styles.searchIconButton}>
              <MaterialIcons
                name="search"
                size={isTablet ? 22 : 20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TopTabs />

      <FlatList
        data={[{ id: 'products' }]}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<PromoSection />}
        renderItem={() => <Product />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerSection: { backgroundColor: '#2D1B4E', paddingBottom: 14 },
  header: { height: isTablet ? 50 : 40 },

  searchSection: { flexDirection: 'row', paddingHorizontal: 16 },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: isTablet ? 14 : 7,
    gap: 8,
    elevation: 3,
  },
  searchText: {
    fontSize: isTablet ? 15 : 14,
    color: '#999',
    flex: 1,
    fontFamily: 'BricolageGrotesque_400Regular',
  },

  searchIconButton: {
    backgroundColor: '#df7512ff',
    width: isTablet ? 40 : 46,
    height: isTablet ? 40 : 30,
    borderRadius: isTablet ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabsContainer: { backgroundColor: '#2D1B4E', paddingBottom: 10 },
  tabsContentContainer: {
    paddingHorizontal: 12,
    gap: isTablet ? 18 : 12,
    paddingVertical: 6,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    minWidth: isTablet ? 70 : 36,
    alignItems: 'center',
  },
  tabText: {
    fontSize: isTablet ? 18 : 15,
    lineHeight: isTablet ? 24 : 25,
    color: '#fff',
    fontFamily: 'BricolageGrotesque_500Medium',
  },
  activeTabText: {
    fontFamily: 'BricolageGrotesque_600SemiBold',
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },

  promoContainer: {
    backgroundColor: '#2D1B4E',
    marginBottom: 16,
  },

  carouselWrapper: {
    position: 'relative',
  },

  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: isTablet ? 32 : 24,
  },

  promoContent: { paddingVertical: 12, flex: 1 },

  promoSubtitle: {
    fontSize: isTablet ? 13 : 12,
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'BricolageGrotesque_500Medium',
  },

  promoTitle: {
    fontSize: isTablet ? 36 : 20,
    color: '#fff',
    lineHeight: isTablet ? 44 : 36,
    marginBottom: 16,
    fontFamily: 'BricolageGrotesque_700Bold',
  },

  shopButton: {
    backgroundColor: '#df7512ff',
    paddingVertical: isTablet ? 12 : 10,
    paddingHorizontal: isTablet ? 24 : 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  shopButtonText: {
    color: '#fff',
    fontSize: isTablet ? 13 : 12,
    fontFamily: 'BricolageGrotesque_600SemiBold',
  },

  promoImage: {
    width: isTablet ? 200 : 150,
    height: isTablet ? 200 : 150,
    marginLeft: 12,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },

  dot: {
    width: 20,
    height: 4,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;