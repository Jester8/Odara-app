import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Search from './components/Search';
import Product from './product/Product';
import useAuthStore from '../src/store/useAuthStore';

const { width } = Dimensions.get('window');

// Categories with local paths only
const categories = [
  { 
    title: 'Clothes', 
    image: require('../../assets/Products/Clothes/male/suit3.jpg'), 
    subcategories: ['Men', 'Women', 'Kids'] 
  },
  { 
    title: 'Shoes', 
    image: require('../../assets/Products/Sneakers/sneakers1.jpg'), 
    subcategories: ['Men', 'Women', 'Kids'] 
  },
  { 
    title: 'Jewelry', 
    image: require('../../assets/Products/Jewelries/2.jpg'), 
    subcategories: ['Necklaces', 'Bracelets', 'Beads'] 
  },
  { 
    title: 'Art Work', 
    image: require('../../assets/Products/art.jpg'), 
    subcategories: ['Paintings', 'Sculptures', 'Handmade Crafts'] 
  },
  { 
    title: 'Books', 
    image: require('../../assets/Products/book.jpg'), 
    subcategories: ['African Authors', 'Fiction', 'Non-Fiction'] 
  },
  { 
    title: 'Food', 
    image: require('../../assets/Products/food.jpg'), 
    subcategories: ['Local Dishes', 'Spices', 'Snacks'] 
  },
  { 
    title: 'Automobiles', 
    image: require('../../assets/Products/cars.webp'), 
    subcategories: ['Cars', 'Motorcycles', 'Spare Parts'] 
  },
  { 
    title: 'Phones & Gadgets', 
    image: require('../../assets/Products/phone.webp'), 
    subcategories: ['Smartphones', 'Accessories', 'Wearables'] 
  },
  { 
    title: 'Electronics', 
    image: require('../../assets/Products/cars.webp'), 
    subcategories: ['TVs', 'Audio Systems', 'Smart Devices'] 
  },
];

const HomeScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const drawerAnim = useState(new Animated.Value(-width))[0];
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDrawerVisible(false));
  };

  const toggleCategory = (index) => {
    setExpandedCategory(index === expandedCategory ? null : index);
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer} style={styles.iconCircle}>
        <MaterialIcons name="menu" size={24} color="#000" />
      </TouchableOpacity>

      <Image
        source={require('../../assets/logo/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(user ? 'UserProfile' : 'GuestProfile')
        }
      >
        <Image
          source={require('../../assets/img/mens.png')} // Local placeholder for profile
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );

  const TopTabs = () => (
    <View style={styles.tabsContainer}>
      {['All', 'Female', 'Male'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
          onPress={() => setSelectedTab(tab)}
        >
          <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDrawer = () => (
    <Animated.View style={[styles.drawerWrapper, { left: drawerAnim }]}>
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>All Categories</Text>
          <TouchableOpacity onPress={closeDrawer}>
            <MaterialIcons name="close" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <TopTabs />

        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => toggleCategory(index)}
              >
                <Image source={item.image} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.title}</Text>
                <MaterialIcons
                  name={expandedCategory === index ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={22}
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>

              {expandedCategory === index &&
                item.subcategories.map((sub, subIndex) => (
                  <View style={styles.subCategoryItem} key={subIndex}>
                    <Text style={styles.subCategoryText}>{sub}</Text>
                  </View>
                ))}
            </View>
          )}
        />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <FlatList
        data={[{ id: 'products' }]}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Search />}
        renderItem={() => <Product />}
        showsVerticalScrollIndicator={false}
      />

      {drawerVisible && renderDrawer()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  logo: { width: 100, height: 40 },
  profileImage: { width: 30, height: 30, borderRadius: 15 },
  iconCircle: { padding: 8 },
  drawerWrapper: {
    position: 'absolute', top: 0, bottom: 0, width: width,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10,
  },
  drawer: { width: width * 0.75, backgroundColor: '#fff', height: '100%', padding: 16 },
  drawerHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 10, marginTop: 20, paddingTop: 10,
  },
  drawerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },

  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  tabButton: {
    paddingVertical: 6, paddingHorizontal: 15, borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: { backgroundColor: '#4B0082' },
  tabText: { fontSize: 14, color: '#000', fontWeight: '500' },
  activeTabText: { color: '#fff' },

  categoryItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 10, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  categoryImage: { width: 30, height: 30, borderRadius: 6, marginRight: 10 },
  categoryText: { fontSize: 16, fontWeight: '600' },
  chevronIcon: { marginLeft: 'auto', color: '#4B0082' },
  subCategoryItem: {
    backgroundColor: '#f8f4ff', paddingVertical: 8,
    paddingHorizontal: 20, marginVertical: 2, borderRadius: 8,
  },
  subCategoryText: { fontSize: 14, color: '#4B0082' },
});

export default HomeScreen;
