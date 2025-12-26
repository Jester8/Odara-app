import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const BOX_SIZE = isTablet ? width / 10 : width / 8;

const Confirm = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const handleChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      setError('');

      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index !== 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    const otpCode = code.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://odara-app.onrender.com/api/auth/verify-otp',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace('Login', { 
            email,
            token: data.token 
          });
        }, 2000);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
      }
    } catch (err) {
      setError('Error verifying OTP. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={isTablet ? 100 : 80} color="#1c0032" />
          </View>
          <Text style={styles.modalTitle}>Email Verified!</Text>
          <Text style={styles.modalMessage}>
            Your email has been successfully verified.
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Row with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={isTablet ? 36 : 28} color="#1c0032" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.title}>CONFIRM EMAIL ADDRESS</Text>
          <Text style={styles.subtitle}>
            Kindly enter the 6-digit code sent to {email}
          </Text>

          <View style={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.input,
                  activeIndex === index && styles.activeInput,
                  error && styles.inputError,
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                onKeyPress={(e) => handleBackspace(e, index)}
                ref={(ref) => (inputs.current[index] = ref)}
                editable={!loading}
                placeholder="-"
                placeholderTextColor="#ccc"
              />
            ))}
          </View>

          {/* Error Message */}
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
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirm Email</Text>
            )}
          </TouchableOpacity>

          {/* Resend Code Option */}
          <TouchableOpacity style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{' '}
              <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <SuccessModal />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: isTablet ? 85 : 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? (isTablet ? 50 : 40) : (isTablet ? 40 : 30),
    marginBottom: isTablet ? 60 : 50,
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
    paddingHorizontal: isTablet ? 40 : 20,
    marginTop: isTablet ? -40 : -30,
  },
  title: {
    fontSize: isTablet ? 28 : 22,
    color: '#000',
    textAlign: 'center',
    marginTop: -65,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: isTablet ? 16 : 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: isTablet ? 35 : 25,
    paddingHorizontal: 15,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isTablet ? 25 : 15,
    width: '90%',
  },
  input: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: isTablet ? 28 : 22,
    fontWeight: 'bold',
    color: '#2e0338ff',
    backgroundColor: '#ffffffff',
  },
  activeInput: {
    borderColor: '#1c0032',
    backgroundColor: '#fff',
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
    fontSize: isTablet ? 15 : 13,
    marginLeft: 8,
    flex: 1,
  },
  infoText: {
    color: '#777',
    fontSize: isTablet ? 16 : 12,
    textAlign: 'center',
    marginBottom: isTablet ? 35 : 25,
    paddingHorizontal: 12,
  },
  asterisk: {
    color: 'red',
  },
  button: {
    backgroundColor: '#1c002c',
    paddingVertical: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 120 : 120,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
   paddingVertical: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 120 : 150,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: isTablet ? 20 : 15,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 10,
  },
  resendText: {
    fontSize: isTablet ? 16 : 14,
    color: '#666',
  },
  resendLink: {
    color: '#1c0032',
    fontWeight: 'bold',
  },
  // Modal Styles
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
    width: isTablet ? width * 0.6 : width * 0.8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: '#1c0032',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: isTablet ? 18 : 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Confirm;