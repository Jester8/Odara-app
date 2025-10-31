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
      
      const response = await fetch(
        'https://odara-app.onrender.com/api/auth/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      const data = await response.json();
      console.log('📊 Response:', data);

      if (response.ok && data.success) {
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('NewPassword', { 
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
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={width * 0.2} color="#1c0032" />
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={28} color="#1c0032" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Your Code</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {email}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  error && styles.otpBoxError,
                  digit && styles.otpBoxFilled
                ]}
                maxLength={1}
                keyboardType="numeric"
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

          <Text style={styles.note}>
            <Text style={styles.redText}>* </Text>
            Check your spam folder if you don't see the email.
          </Text>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Verify Code</Text>
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
      </ScrollView>

      <SuccessModal />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fa',
  },
  scrollView: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: Platform.OS === 'ios' ? height * 0.02 : 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#1c0032',
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 28,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.04,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  otpBox: {
    width: width * 0.12,
    height: width * 0.12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#fff',
  },
  otpBoxFilled: {
    borderColor: '#1c0032',
    backgroundColor: '#fff',
  },
  otpBoxError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff5f5',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: width * 0.03,
    borderRadius: 8,
    marginBottom: height * 0.02,
  },
  errorText: {
    fontSize: width * 0.03,
    color: '#e74c3c',
    marginLeft: 8,
    flex: 1,
  },
  redText: {
    color: 'red',
  },
  note: {
    fontSize: width * 0.03,
    color: '#999',
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1c0032',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.025,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: width * 0.03,
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
  successIconContainer: {
    marginBottom: height * 0.02,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#1c0032',
    marginBottom: height * 0.01,
  },
  modalMessage: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
  },
});