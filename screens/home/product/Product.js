import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { products } from './items'; 

const { width } = Dimensions.get('window');

const Product = () => {
  const navigation = useNavigation();

  // Render each product
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ViewProduct', { product: item })}
    >
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.image} 
      />

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        <Text style={styles.discount}>{item.discount}</Text>
      </View>

      <Text style={styles.rating}>⭐ {item.rating} ({item.totalRatings})</Text>
    </TouchableOpacity>
  );

  // Render section
  const Section = ({ title, category }) => {
    const filteredProducts = products.filter(p => p.category === category);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={190} 
          decelerationRate="fast"
          snapToAlignment="start"
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Section title="Top Selling" category="Top Selling" />
      <Section title="Trending" category="Trending" />
      <Section title="Most Viewed" category="Most Viewed" />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'BricolageGrotesque_700Bold',
    marginBottom: 10,
    backgroundColor: '#5e2a84',
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: 170, // matches snap width
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#ccc',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 17,
    fontFamily: 'BricolageGrotesque_700Bold',
    marginTop: 10,
  },
  desc: {
    fontSize: 15,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: '#555',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  price: {
    fontFamily: 'BricolageGrotesque_700Bold',
    color: '#000',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 12,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: '#999',
  },
  discount: {
    fontSize: 12,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: 'red',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'BricolageGrotesque_400Regular',
    color: '#666',
    marginTop: 4,
  },
});

export default Product;
