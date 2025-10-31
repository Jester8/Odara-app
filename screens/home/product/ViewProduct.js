import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const ViewProduct = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const product = route.params?.product || {};

  const productImages = [product.image];

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const sizes = [39, 39.5, 40, 40.5, 41];
  const [selectedSize, setSelectedSize] = useState(41);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="shopping-bag" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageSliderContainer}>
          <FlatList
            ref={flatListRef}
            data={productImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={item}
                style={styles.productImage}
                resizeMode="cover"
              />
            )}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          <View style={styles.dotsContainer}>
            {productImages.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === currentIndex ? '#CC5500' : '#ccc' }, // Burnt orange
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.title}</Text>
          <Text style={styles.productSub}>{product.desc}</Text>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            <Text style={styles.discount}>{product.discount}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>⭐ {product.rating}</Text>
            <Text style={styles.reviewCount}>({product.totalRatings} reviews)</Text>
          </View>

          <Text style={styles.stockText}>Available in stock</Text>

          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.sizeRow}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.desc} This premium product is designed with quality materials and attention to detail, making it ideal for both everyday wear and special occasions. It offers durability, comfort, and style that matches your needs.
          </Text>

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <View style={styles.review}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewName}>John Doe</Text>
              <Text style={styles.reviewText}>Absolutely love this product! Fits perfectly and the quality is amazing.</Text>
              <Text style={styles.reviewDate}>2 days ago</Text>
            </View>
          </View>
          <View style={styles.review}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.avatar}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewName}>Sarah Williams</Text>
              <Text style={styles.reviewText}>Good quality and fast delivery. Will definitely buy again.</Text>
              <Text style={styles.reviewDate}>5 days ago</Text>
            </View>
          </View>
        </View>

        {/* Cart Section */}
        <View style={styles.cartRow}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNumber}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity style={styles.cartButton} onPress={animateButton}>
              <Text style={styles.cartButtonText}>Add to cart</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewProduct;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 10 },
  imageSliderContainer: { width: width, height: width * 1.2 },
  productImage: { width: width, height: width * 1.2 },
  dotsContainer: { flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 3 },
  productInfo: { paddingHorizontal: 15, marginTop: 15 },
  productName: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  productSub: { fontSize: 16, color: '#777', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  price: { fontWeight: 'bold', color: '#000' },
  originalPrice: { textDecorationLine: 'line-through', fontSize: 12, color: '#999' },
  discount: { fontSize: 12, color: 'red' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  rating: { fontSize: 15, color: '#0b0031ff' },
  reviewCount: { fontSize: 14, color: '#777', marginLeft: 5 },
  stockText: { fontSize: 14, color: '#000', marginVertical: 10, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  sizeButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 },
  selectedSizeButton: { backgroundColor: '#0b0031ff', borderColor: '#0b0031ff' },
  sizeText: { fontSize: 14, color: '#000' },
  selectedSizeText: { color: '#fff' },
  description: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 15 },
  review: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  reviewContent: { flex: 1 },
  reviewName: { fontWeight: '600', color: '#000' },
  reviewText: { fontSize: 14, color: '#555', marginTop: 4 },
  reviewDate: { fontSize: 12, color: '#999', marginTop: 2 },
  cartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 20, borderTopWidth: 1, borderColor: '#eee' },
  quantitySelector: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#f2f2f2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  qtyText: { fontSize: 16, fontWeight: '600' },
  qtyNumber: { marginHorizontal: 10, fontSize: 16, fontWeight: '600' },
  cartButton: { backgroundColor: '#0d0138ff', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30 },
  cartButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
