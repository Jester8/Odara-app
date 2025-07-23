import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Congrats = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEmailConfirm = () => {
    // Navigate to wherever you handle email confirmation
    navigation.navigate('Confirm'); 
  };

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../../assets/logo/pop.png')}
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />

      <Text style={styles.title}>Woohoo!</Text>
      <Text style={styles.subtitle}>You’ve successfully created your account.</Text>

      <TouchableOpacity style={styles.button} onPress={handleEmailConfirm}>
        <Text style={styles.buttonText}>Confirm your email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.1,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#1c0032',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16.5,
    fontWeight: '500',
  },
});

export default Congrats;
