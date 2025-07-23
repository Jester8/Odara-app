import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Search from './components/Search';
import Product from './components/Product';

const { width } = Dimensions.get('window');


const categories = [
  { title: 'Fashion Apparels', icon: 'checkroom', subcategories: ['Men', 'Women', 'Kids'] },
  { title: 'Arts and Crafts', icon: 'palette', subcategories: ['Paintings', 'Handmade Items', 'beads'] },
  { title: 'Home Decor', icon: 'weekend', subcategories: ['Furniture', 'Wall Art'] },
  { title: 'Beauty & Personal Care', icon: 'spa', subcategories: ['Skincare', 'Makeup'] },
  { title: 'Accessories', icon: 'watch', subcategories: ['Bags', 'Jewelry', 'Hats'] },
  { title: 'Shoes', icon: 'hiking', subcategories: ['Men', 'Women', 'Kids'] },
  { title: 'Electronics', icon: 'devices-other', subcategories: ['Phones', 'Smart Gadgets'] },
  { title: 'Groceries', icon: 'shopping-cart', subcategories: ['Food Items', 'Spices'] },
  { title: 'Health', icon: 'health-and-safety', subcategories: ['Supplements', 'Natural Remedies'] },
  { title: 'Books', icon: 'menu-book', subcategories: ['Fiction', 'Non-fiction', 'African Authors'] },
  { title: 'Music & Instruments', icon: 'music-note', subcategories: ['Instruments', 'CDs'] },
  { title: 'Toys & Games', icon: 'toys', subcategories: ['Board Games', 'Educational Toys'] },
  { title: 'Traditional', icon: 'style', subcategories: ['Attire', 'Artifacts'] },
  { title: 'Jewelry', icon: 'diamond', subcategories: ['Necklaces', 'Bracelets'] },
  { title: 'Furniture', icon: 'chair', subcategories: ['Chairs', 'Tables'] },
];

const Header = ({ onMenuPress }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onMenuPress} style={styles.iconCircle}>
      <MaterialIcons name="menu" size={24} color="#000" />
    </TouchableOpacity>
    <Image
      source={require('../../assets/logo/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
    <TouchableOpacity>
      <Image
        source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
        style={styles.profileImage}
      />
    </TouchableOpacity>
  </View>
);

const HomeScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const drawerAnim = useState(new Animated.Value(-width))[0];

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

  const renderDrawer = () => (
    <Animated.View style={[styles.drawerWrapper, { left: drawerAnim }]}>
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Categories</Text>
          <TouchableOpacity onPress={closeDrawer}>
            <MaterialIcons name="close" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>VIEW ALL ITEMS</Text>
          </TouchableOpacity>

          {categories.map((category, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => toggleCategory(index)}
              >
                <MaterialIcons
                  name={category.icon}
                  size={20}
                  color="#4B0082"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.categoryText}>{category.title}</Text>
                <MaterialIcons
                  name={
                    expandedCategory === index
                      ? 'keyboard-arrow-up'
                      : 'keyboard-arrow-down'
                  }
                  size={20}
                  color="#999"
                  style={{ marginLeft: 'auto' }}
                />
              </TouchableOpacity>

              {expandedCategory === index &&
                category.subcategories.map((sub, subIndex) => (
                  <View style={styles.subCategoryItem} key={subIndex}>
                    <Text style={styles.subCategoryText}>• {sub}</Text>
                  </View>
                ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header onMenuPress={openDrawer} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Search />
        <Product />
      </ScrollView>

      {drawerVisible && renderDrawer()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 40,
    width: 120,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  drawerWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width,
    zIndex: 999,
    backgroundColor: '#fff',
  },
  drawer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 70,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  viewAllButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  viewAllText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
    color: '#000000',
  },
  subCategoryItem: {
    paddingLeft: 40,
    paddingVertical: 6,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
