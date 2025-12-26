import React, { useState, useRef } from 'react';
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const BOX_SIZE = width / 8;

export default function ResetOtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      setError('');

      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('📧 Verifying reset OTP for email:', email);
      
      // ✅ CHANGED: Use verify-reset-otp endpoint instead of verify-otp
      const response = await fetch(
        'https://odara-app.onrender.com/api/auth/verify-reset-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      const responseText = await response.text();
      console.log('📊 Raw Response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('Response was:', responseText);
        throw parseError;
      }
      console.log('📊 Parsed Response:', data);

      if (response.ok && data.success) {
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('ResetPassword', { 
            email, 
            otp: otpCode 
          });
        }, 2000);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setError('Server error. Please try again later.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://odara-app.onrender.com/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setError('');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        alert('OTP has been resent to your email');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Error resending OTP. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#1c0032" />
          </View>
          <Text style={styles.modalTitle}>Code Verified!</Text>
          <Text style={styles.modalMessage}>
            You can now reset your password.
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backArrow}
          onPress={() => navigation.goBack()} 
          disabled={loading}
        >
          <Ionicons name="chevron-back" size={28} color="#1c0032" />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContent}>
        <Text style={styles.title}>VERIFY YOUR CODE</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Kindly enter the 6-digit code sent to {email}
        </Text>

        <View style={styles.codeInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.input,
                error && styles.inputError,
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              editable={!loading}
              placeholder="-"
              placeholderTextColor="#ccc"
            />
          ))}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.infoText}>
          <Text style={styles.asterisk}>* </Text>
          Make sure to check your spam folder if you don't see the email.
        </Text>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resendContainer}
          onPress={handleResendOtp}
          disabled={loading}
        >
          <Text style={styles.resendText}>
            Didn't receive the code?{' '}
            <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <SuccessModal />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 70 : 50,
    marginBottom: 50,
  },
  backArrow: {
    position: 'absolute',
    left: 15,
    top: '50%',
    marginTop: -14,
    zIndex: 10,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -30,
  },
  title: {
    fontSize: 25,
    color: '#000',
    textAlign: 'center',
    marginTop: -64,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 40,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '90%',
  },
  input: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e0338ff',
    backgroundColor: '#ffffffff',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#ffe6e6',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 15,
    width: '90%',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  infoText: {
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  asterisk: {
    color: 'red',
  },
  button: {
    backgroundColor: '#1c002c',
    paddingVertical: 16,
    paddingHorizontal: 90,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: width * 0.75,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    color: '#1c0032',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: width * 0.08,
    alignItems: 'center',
    width: width * 0.8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c0032',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});