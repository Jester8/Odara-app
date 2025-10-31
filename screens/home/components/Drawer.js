import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const categories = [
  'Men',
  'Women',
  'Kids',
  'Shoes',
  'Bags',
  'Accessories',
  'Beauty',
  'Home Decor',
  'Traditional',
  'Electronics',
  'Groceries',
  'Sportswear',
  'Watches',
  'Jewelry',
  'Furniture',
  'Health',
  'Books',
  'Music',
  'Toys',
];

const Drawer = ({ onClose }) => {
  return (
    <View style={styles.drawer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Categories</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: '100%',
    width: width * 0.8,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 70,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 10,
    zIndex: 30,
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
    color: '#4B0082',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Drawer;
