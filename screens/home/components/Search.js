import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Animated,
  Easing
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Banner from './Banner';

const categories = [
  { name: 'Beauty', image: require('../../../assets/img/beauty.png') },
  { name: 'Fashion', image: { uri: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2' } },
  { name: 'Kids', image: require('../../../assets/img/kid.png') },
  { name: 'Mens', image: require('../../../assets/img/mens.png') },
  { name: 'Womens', image: { uri: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246' } },
  { name: 'Gifts', image: require('../../../assets/img/gifts.png') },
];

const Search = () => {
  const [query, setQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false
        })
      ])
    ).start();

    return () => clearTimeout(timer);
  }, []);

  const shimmerColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#f5f5f5']
  });

  const handleSearch = (text) => {
    setQuery(text);
    const filtered = categories.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleFilter = () => {
    alert('Filter logic triggered');
  };

  const handleSort = () => {
    const sorted = [...filteredCategories].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setFilteredCategories(sorted);
  };

  const handleShopNow = () => {
    console.log('Shop now button pressed');
  };

  const SkeletonBox = ({ style }) => (
    <Animated.View style={[style, { backgroundColor: shimmerColor }]} />
  );

  const SkeletonCategory = () => (
    <View style={styles.categoryItem}>
      <SkeletonBox style={styles.skeletonImage} />
      <SkeletonBox style={styles.skeletonText} />
    </View>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryItem}>
      <Image
        source={item.image}
        style={styles.categoryImage}
        resizeMode="cover"
      />
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          {/* Skeleton Search Bar */}
          <SkeletonBox style={styles.skeletonSearchBar} />

          {/* Skeleton Header */}
          <View style={styles.skeletonHeaderContainer}>
            <SkeletonBox style={styles.skeletonHeaderText} />
            <SkeletonBox style={styles.skeletonButton} />
            <SkeletonBox style={styles.skeletonButton} />
          </View>

          {/* Skeleton Categories */}
          <FlatList
            horizontal
            data={Array(6).fill({})}
            keyExtractor={(_, i) => i.toString()}
            renderItem={() => <SkeletonCategory />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            style={{ marginTop: 20 }}
          />

          {/* Skeleton Banner */}
          <SkeletonBox style={styles.skeletonBanner} />
        </>
      ) : (
        <>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={22} color="#999" style={{ marginLeft: 10 }} />
            <TextInput
              placeholder="Search any Product.."
              value={query}
              onChangeText={handleSearch}
              style={[styles.input, { fontFamily: 'BricolageGrotesque_400Regular' }]}
              placeholderTextColor="#999"
            />
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={[styles.headerText, { fontFamily: 'BricolageGrotesque_700Bold' }]}>
              All Featured
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={handleSort} style={styles.button}>
                <MaterialIcons name="sort" size={16} color="#000" />
                <Text style={[styles.buttonText, { fontFamily: 'BricolageGrotesque_400Regular' }]}>
                  Sort
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFilter} style={styles.button}>
                <MaterialCommunityIcons name="filter-variant" size={16} color="#000" />
                <Text style={[styles.buttonText, { fontFamily: 'BricolageGrotesque_400Regular' }]}>
                  Filter
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category List */}
          <FlatList
            horizontal
            data={filteredCategories}
            keyExtractor={(item) => item.name}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}
            style={{ marginTop: 20, } }
          />

          {/* Banner */}
          <Banner
            imageSource={require('../../../assets/img/shop.png')}
            discountText="50-40% OFF"
            productText="Now in (product)"
            colorsText="All colours"
            onShopPress={handleShopNow}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  searchBar: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    height: 45,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000',
  },
  header: {
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 45,
    borderRadius: 10,
    gap: 4,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
  categoryItem: {
    marginHorizontal: 2,
    alignItems: 'center',
    width: 80,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryText: {
    fontSize: 14,
    marginTop: 6,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  
  skeletonSearchBar: {
    height: 45,
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  skeletonHeaderContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonHeaderText: {
    width: 100,
    height: 20,
    borderRadius: 4,
  },
  skeletonButton: {
    width: 50,
    height: 20,
    borderRadius: 4,
  },
  skeletonImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  skeletonText: {
    width: 50,
    height: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  skeletonBanner: {
    height: 150,
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default Search;
