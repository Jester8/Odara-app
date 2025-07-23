import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
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
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={22} color="#999" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Search any Product.."
          value={query}
          onChangeText={handleSearch}
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>All Featured</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleSort} style={styles.button}>
            <MaterialIcons name="sort" size={16} color="#000" />
            <Text style={styles.buttonText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFilter} style={styles.button}>
            <MaterialCommunityIcons name="filter-variant" size={16} color="#000" />
            <Text style={styles.buttonText}>Filter</Text>
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
        contentContainerStyle={{ paddingHorizontal: 10 }}
        style={{ marginTop: 20 }}
      />

      {/* Banner */}
      <Banner
        imageSource={require('../../../assets/img/shop.png')}
        discountText="50-40% OFF"
        productText="Now in (product)"
        colorsText="All colours"
        onShopPress={handleShopNow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    backgroundColor: '#fff',
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
    fontSize: 18,
    fontWeight: '600',
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
    marginHorizontal: 8,
    alignItems: 'center',
    width: 80,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryText: {
    fontSize: 13,
    marginTop: 6,
    color: '#000',
    textAlign: 'center',
  },
});

export default Search;
