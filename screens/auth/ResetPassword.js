import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { email, otp } = route.params || {};

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Check if email and otp are available
    if (!email || !otp) {
      Alert.alert('Error', 'Email or OTP is missing. Please go back and try again.');
      console.error('Missing email or otp:', { email, otp });
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting password reset with:', { email, otp: otp ? '***' : 'missing' });
      
      const response = await fetch('https://odara-app.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          otp: otp.trim(), 
          newPassword: password 
        }),
      });

      const data = await response.json();
      console.log('📊 Reset password response:', data);
      
      if (response.ok && data.success) {
        Alert.alert('Success', 'Password changed successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('❌ Reset password error:', error);
      Alert.alert('Error', 'Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Title */}
        <Text style={styles.title}>RESET PASSWORD</Text>
        <Text style={styles.subtitle}>Enter your new password</Text>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>New Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor="#555"
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Feather 
                name={showPassword ? 'eye' : 'eye-off'} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              placeholderTextColor="#555"
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              <Feather 
                name={showConfirmPassword ? 'eye' : 'eye-off'} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Requirements */}
        <Text style={styles.requirementsText}>
          <Text style={styles.asterisk}>* </Text>
          Password must be at least 6 characters
        </Text>

        {/* Change Password Button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Changing Password...' : 'Change Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.03,
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.04,
    position: 'relative',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'BricolageGrotesque_700Bold',
  },
  subtitle: {
    fontSize: 15,
    color: '#5e5e5eff',
    marginBottom: height * 0.03,
    textAlign: 'center',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
    fontFamily: 'BricolageGrotesque_500Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.4,
    paddingHorizontal: width * 0.03,
    height: 50,
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: '#1c0032',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  requirementsText: {
    color: '#777',
    fontSize: 12,
    marginBottom: height * 0.025,
    marginTop: -height * 0.01,
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  asterisk: {
    color: 'red',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#1c0032',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'BricolageGrotesque_600SemiBold',
  },
});