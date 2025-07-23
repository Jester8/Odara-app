import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

const mockProducts = [
  {
    id: 1,
    title: 'Women Printed Kurta',
    desc: 'Comfortable and stylish printed kurta for women.',
    price: '₦15,000',
    originalPrice: '₦24,999',
    discount: '40% Off',
    rating: 4.5,
    totalRatings: '56,890',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1a4',
  },
  {
    id: 2,
    title: 'Casual Men Shirt',
    desc: 'Slim-fit, cotton casual shirt for men.',
    price: '₦7,999',
    originalPrice: '₦12,999',
    discount: '38% Off',
    rating: 4.2,
    totalRatings: '12,430',
    image: 'https://images.unsplash.com/photo-1618354691225-04aa2e1d1d4e',
  },
  {
    id: 3,
    title: 'Smart Watch',
    desc: 'Water-resistant, multi-feature smartwatch.',
    price: '₦22,000',
    originalPrice: '₦49,999',
    discount: '56% Off',
    rating: 4.4,
    totalRatings: '21,000',
    image: 'https://images.unsplash.com/photo-1600172454520-9fe4d59a4f04',
  },
  {
    id: 4,
    title: 'Women Handbag Combo',
    desc: '3-in-1 handbag combo with clutch & pouch.',
    price: '₦9,999',
    originalPrice: '₦19,999',
    discount: '50% Off',
    rating: 4.3,
    totalRatings: '8,980',
    image: 'https://images.unsplash.com/photo-1585386959982-a4170a4aa43c',
  },
  {
    id: 5,
    title: 'Running Shoes',
    desc: 'Breathable running shoes for men.',
    price: '₦14,999',
    originalPrice: '₦29,999',
    discount: '50% Off',
    rating: 4.1,
    totalRatings: '15,650',
    image: 'https://images.unsplash.com/photo-1600185364788-44c8f2bcd9bd',
  },
  {
    id: 6,
    title: 'Bluetooth Headphones',
    desc: 'Over-ear wireless Bluetooth headphones.',
    price: '₦17,999',
    originalPrice: '₦29,999',
    discount: '40% Off',
    rating: 4.4,
    totalRatings: '32,490',
    image: 'https://images.unsplash.com/photo-1589386815212-c61c2c78d2fa',
  },
  {
    id: 7,
    title: 'Kids Toy Set',
    desc: 'Educational toy set for 3+ years old kids.',
    price: '₦5,999',
    originalPrice: '₦9,999',
    discount: '40% Off',
    rating: 4.6,
    totalRatings: '9,780',
    image: 'https://images.unsplash.com/photo-1606813884618-1f110403d393',
  },
  {
    id: 8,
    title: 'Unisex Sunglasses',
    desc: 'UV-protected polarized sunglasses.',
    price: '₦8,999',
    originalPrice: '₦19,999',
    discount: '55% Off',
    rating: 4.3,
    totalRatings: '18,300',
    image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef',
  },
  {
    id: 9,
    title: 'Kitchen Mixer Grinder',
    desc: 'Heavy-duty mixer grinder with 3 jars.',
    price: '₦24,999',
    originalPrice: '₦49,999',
    discount: '50% Off',
    rating: 4.2,
    totalRatings: '7,200',
    image: 'https://images.unsplash.com/photo-1571867424485-dfbd8a1d8052',
  },
  {
    id: 10,
    title: 'Digital Table Lamp',
    desc: 'Rechargeable touch lamp with clock.',
    price: '₦6,499',
    originalPrice: '₦11,999',
    discount: '45% Off',
    rating: 4.5,
    totalRatings: '4,900',
    image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7',
  },
];

const Product = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        <Text style={styles.discount}>{item.discount}</Text>
      </View>
      <Text style={styles.rating}>⭐ {item.rating} ({item.totalRatings})</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>🔥 Deal of the Day</Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
      </View>
      <FlatList
        data={mockProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  banner: {
    backgroundColor: '#FFE0B2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#BF360C',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    height: 130,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  desc: {
    fontSize: 12,
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
    fontWeight: 'bold',
    color: '#000',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 12,
    color: '#999',
  },
  discount: {
    fontSize: 12,
    color: 'red',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default Product;
