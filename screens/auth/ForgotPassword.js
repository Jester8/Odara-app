import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  useFonts,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      console.log('📧 Sending reset OTP to:', email);
      
      const res = await fetch('https://odara-app.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() })
      });

      const data = await res.json();
      console.log('📊 Response:', data);
      
      if (res.ok && data.success) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent to your email');
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('❌ Forgot password error:', err);
      Alert.alert('Error', 'Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length < 4) {
      Alert.alert('Error', 'OTP must be at least 4 characters');
      return;
    }

    navigation.navigate('ResetPassword', { 
      email: email.toLowerCase(), 
      otp: otp.trim() 
    });
  };

  if (!fontsLoaded) return null;

  const responsiveStyles = getResponsiveStyles();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={responsiveStyles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={responsiveStyles.contentContainer}>
          <Text style={responsiveStyles.title}>FORGOT PASSWORD?</Text>
          <Text style={responsiveStyles.subtitle}>
            Kindly enter your email to reset your password
          </Text>

          {/* Email Input */}
          <View style={responsiveStyles.inputContainer}>
            <Feather name="mail" size={responsiveStyles.iconSize} color="#999" style={styles.icon} />
            <TextInput
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading && !otpSent}
              style={responsiveStyles.input}
              placeholderTextColor="#555"
            />
          </View>

          {otpSent && (
            <View style={responsiveStyles.inputContainer}>
              <Feather name="key" size={responsiveStyles.iconSize} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                editable={!loading}
                style={responsiveStyles.input}
                placeholderTextColor="#555"
                maxLength={6}
              />
            </View>
          )}

          <Text style={responsiveStyles.note}>
            <Text style={{ color: 'red' }}>*</Text> We will send you a message to set or reset your new password
          </Text>

          <TouchableOpacity 
            style={[responsiveStyles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={responsiveStyles.submitText}>
                {otpSent ? 'Verify OTP' : 'Send OTP'}
              </Text>
            )}
          </TouchableOpacity>

          {otpSent && (
            <TouchableOpacity 
              onPress={() => {
                setOtpSent(false);
                setOtp('');
              }}
              disabled={loading}
            >
              <Text style={responsiveStyles.resendLink}>Back to Email</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getResponsiveStyles = () => {
  const isTablet = width >= 768;

  return {
    scrollView: {
      paddingHorizontal: isTablet ? width * 0.08 : width * 0.05,
      paddingVertical: isTablet ? 20 : 0,
      flexGrow: 1,
      maxWidth: isTablet ? 900 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    contentContainer: {
      marginTop: isTablet ? height * 0.04 : height * 0.09,
    },
    title: {
      fontSize: isTablet ? 28 : 25,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: isTablet ? 12 : 8,
      textAlign: 'center',
      fontFamily: 'BricolageGrotesque_700Bold',
    },
    subtitle: {
      fontSize: isTablet ? 15 : 15,
      color: '#5e5e5eff',
      marginBottom: isTablet ? 28 : 15,
      textAlign: 'center',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: isTablet ? 14 : width * 0.4,
      borderColor: '#210030ff',
      borderWidth: 0.4,
      paddingHorizontal: isTablet ? 18 : width * 0.03,
      paddingVertical: isTablet ? 13 : height * 0.0141,
      alignItems: 'center',
      marginBottom: isTablet ? height * 0.02 : height * 0.015,
    },
    iconSize: isTablet ? 28 : 20,
    input: {
      flex: 1,
      fontSize: isTablet ? 13 : 15,
      color: '#000',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    note: {
      fontSize: isTablet ? 12 : 13,
      color: '#666',
      marginBottom: isTablet ? height * 0.05 : height * 0.02,
      textAlign: 'center',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    submitButton: {
      backgroundColor: '#1c0032',
      paddingVertical: isTablet ? 16 : height * 0.02,
      borderRadius: isTablet ? 14 : width * 0.25,
      alignItems: 'center',
      height: isTablet ? 62 : 50,
      justifyContent: 'center',
    },
    submitText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: isTablet ? 15 : 15,
      fontFamily: 'BricolageGrotesque_600SemiBold',
    },
    resendLink: {
      color: '#1c0032',
      textAlign: 'center',
      marginTop: height * 0.015,
      fontSize: 14,
      fontFamily: 'BricolageGrotesque_600SemiBold',
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: width * 0.02,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});