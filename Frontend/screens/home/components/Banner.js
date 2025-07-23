import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Banner = ({ 
  imageSource, 
  discountText, 
  productText, 
  colorsText, 
  onShopPress 
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.discountText}>{discountText}</Text>
        <Text style={styles.subText}>{productText}</Text>
        <Text style={styles.subText}>{colorsText}</Text>
        <TouchableOpacity style={styles.shopButton} onPress={onShopPress}>
          <Text style={styles.shopButtonText}>Shop Now</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: width * 0.45,
    borderRadius: 12,
  },
  content: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  discountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subText: {
    color: '#fff',
    fontSize: 14,
  },
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    marginTop: 30,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#fff',
    marginRight: 6,
    fontSize: 14,
  },
});

export default Banner;