import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EmailCongrats = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Email Icon */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons name="email" size={120} color="#1c002c" />
      </Animated.View>

      {/* Success Text */}
      <Text style={styles.successTitle}>
        Email Verification Successful
      </Text>
      <Text style={styles.successMessage}>
        Your email address has been verified successfully.
         You can now log in to continue using the app.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>
          Go To Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EmailCongrats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successTitle: {
    fontFamily: 'BricolageGrotesk-Bold',
    fontSize: 26,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  successMessage: {
    fontFamily: 'BricolageGrotesk-Regular',
    fontSize: 15,
    color: '#555',
    textAlign: 'left',
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#1c002c',
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'BricolageGrotesk-Bold',
    color: '#fff',
    fontSize: 16,
  },
});
