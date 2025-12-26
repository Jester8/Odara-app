import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
let debounceTimer;

// Responsive scaling function
const getResponsiveSize = (basePhone, baseTablet) => {
  const isTablet = width >= 768;
  const scale = isTablet ? baseTablet : basePhone;
  return scale;
};

// Unified responsive value function
const getScaledValue = (phoneValue, tabletValue) => {
  return width >= 768 ? tabletValue : phoneValue;
};

const RegisterScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  // UI states
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Availability check states
  const [emailStatus, setEmailStatus] = useState(null);
  const [phoneStatus, setPhoneStatus] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  // Date Picker Modal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({});

  // Validation helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{10,15}$/.test(phone.replace(/[^0-9]/g, ''));
  const isValidName = (name) => /^[A-Za-z\s'-]+$/.test(name);

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (!isValidName(firstName)) {
      newErrors.firstName = 'Please enter a valid name';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (!isValidName(lastName)) {
      newErrors.lastName = 'Please enter a valid name';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!isValidPhone(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
      isValid = false;
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms & Conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Debounced Email Check
  useEffect(() => {
    if (!email || !isValidEmail(email)) {
      setEmailStatus(null);
      return;
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        const res = await axios.post("https://odara-app.onrender.com/api/auth/check-email", { email });
        setEmailStatus(res.data.available ? "available" : "taken");
      } catch {
        setEmailStatus(null);
      }
      setCheckingEmail(false);
    }, 500);
  }, [email]);

  // Debounced Phone Check
  useEffect(() => {
    if (!phoneNumber || !isValidPhone(phoneNumber)) {
      setPhoneStatus(null);
      return;
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      setCheckingPhone(true);
      try {
        const res = await axios.post("https://odara-app.onrender.com/api/auth/check-phone", { phone: phoneNumber });
        setPhoneStatus(res.data.available ? "available" : "taken");
      } catch {
        setPhoneStatus(null);
      }
      setCheckingPhone(false);
    }, 500);
  }, [phoneNumber]);

  const handleDateConfirm = (date) => {
    setDateOfBirth(date);
    setDatePickerVisibility(false);
  };

  const handleSignUp = async () => {
    if (validateInputs()) {
      setLoading(true);
      const userData = {
        name: `${firstName} ${lastName}`,
        email,
        password,
        phoneNumber,
        dateOfBirth
      };

      try {
        const response = await axios.post("https://odara-app.onrender.com/api/auth/register", userData);
        navigation.replace("Congrats", { email: userData.email });
      } catch (error) {
        Alert.alert("Registration Failed", error?.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up');
  };

  const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  if (!fontsLoaded) return null;

  // Get responsive styles
  const responsiveStyles = getResponsiveStyles();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={responsiveStyles.scrollContent}>
          <View style={responsiveStyles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/logo/logo.png')} style={responsiveStyles.logo} resizeMode="contain" />
            </View>
          </View>

          <View style={responsiveStyles.formContainer}>
            <Text style={responsiveStyles.title}>Create Account</Text>
            <Text style={responsiveStyles.subtitle}>Sign up to get started with Odara.</Text>

            {/* First Name */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>First Name</Text>
              <View style={[responsiveStyles.inputWrapper, errors.firstName ? styles.inputError : null]}>
                <Feather name="user" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="First Name"
                  placeholderTextColor="#555"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              {errors.firstName ? <Text style={responsiveStyles.errorText}>{errors.firstName}</Text> : null}
            </View>

            {/* Last Name */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Last Name</Text>
              <View style={[responsiveStyles.inputWrapper, errors.lastName ? styles.inputError : null]}>
                <Feather name="user" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#555"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
              {errors.lastName ? <Text style={responsiveStyles.errorText}>{errors.lastName}</Text> : null}
            </View>

            {/* Phone Number */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Phone Number</Text>
              <View style={[responsiveStyles.inputWrapper, errors.phoneNumber ? styles.inputError : null]}>
                <Feather name="phone" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#555"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                {checkingPhone && <ActivityIndicator size="small" color="#1c0032" />}
              </View>
              {phoneStatus === "available" && <Text style={responsiveStyles.statusText}>✅ Phone available</Text>}
              {phoneStatus === "taken" && <Text style={responsiveStyles.statusTextError}>❌ Phone already registered</Text>}
              {errors.phoneNumber ? <Text style={responsiveStyles.errorText}>{errors.phoneNumber}</Text> : null}
            </View>

            {/* Date of Birth */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity style={[responsiveStyles.inputWrapper, errors.dateOfBirth ? styles.inputError : null]} onPress={() => setDatePickerVisibility(true)}>
                <Feather name="calendar" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <Text style={responsiveStyles.input}>{formatDate(dateOfBirth)}</Text>
              </TouchableOpacity>
              {errors.dateOfBirth ? <Text style={responsiveStyles.errorText}>{errors.dateOfBirth}</Text> : null}
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              themeVariant="light"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisibility(false)}
              maximumDate={new Date()}
            />

            {/* Email */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Email Address</Text>
              <View style={[responsiveStyles.inputWrapper, errors.email ? styles.inputError : null]}>
                <Feather name="mail" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                {checkingEmail && <ActivityIndicator size="small" color="#1c0032" />}
              </View>
              {emailStatus === "available" && <Text style={responsiveStyles.statusText}>✅ Email available</Text>}
              {emailStatus === "taken" && <Text style={responsiveStyles.statusTextError}>❌ Email already registered</Text>}
              {errors.email ? <Text style={responsiveStyles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Password</Text>
              <View style={[responsiveStyles.inputWrapper, errors.password ? styles.inputError : null]}>
                <Feather name="lock" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="Create password"
                  placeholderTextColor="#555"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                  <Feather name={passwordVisible ? "eye" : "eye-off"} size={responsiveStyles.iconSize} color="#999" />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={responsiveStyles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Confirm Password</Text>
              <View style={[responsiveStyles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                <Feather name="lock" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#555"
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
                  <Feather name={confirmPasswordVisible ? "eye" : "eye-off"} size={responsiveStyles.iconSize} color="#999" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={responsiveStyles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Terms */}
            <View style={responsiveStyles.termsContainer}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && <Feather name="check" size={responsiveStyles.checkboxIconSize} color="#fff" />}
                </View>
                <Text style={responsiveStyles.checkboxLabel}>
                  I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms ? <Text style={responsiveStyles.errorText}>{errors.terms}</Text> : null}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[responsiveStyles.signUpButton, loading && { opacity: 0.7 }]} 
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={responsiveStyles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={responsiveStyles.orContainer}>
              <View style={styles.divider} />
              <Text style={responsiveStyles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Sign Up */}
            <TouchableOpacity style={responsiveStyles.googleButton} onPress={handleGoogleSignUp}>
              <Image 
                source={require('../../assets/logo/google.webp')} 
                style={responsiveStyles.googleIcon}
                resizeMode="contain"
              />
              <Text style={responsiveStyles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={responsiveStyles.signInText}>Have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={responsiveStyles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Responsive styles function
const getResponsiveStyles = () => {
  const isTablet = width >= 768;
  
  return {
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: isTablet ? width * 0.08 : width * 0.05,
      paddingBottom: 30,
      maxWidth: isTablet ? 900 : '100%',
      alignSelf: 'center',
      width: '100%'
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: isTablet ? height * 0.03 : height * 0.02,
      paddingBottom: isTablet ? height * 0.03 : height * 0.02,
      justifyContent: 'center'
    },
    logo: {
      width: isTablet ? width * 0.20 : width * 0.24,
      height: isTablet ? width * 0.1 : width * 0.15,
    },
    
    formContainer: {
      paddingVertical: isTablet ? height * 0.04 : height * 0.02,
      backgroundColor: '#fff',
      paddingHorizontal: isTablet ? width * 0.06 : width * 0.04,
      borderRadius: isTablet ? 16 : 8
    },
    title: {
      fontSize: isTablet ? 28 : 25,
      fontWeight: 'bold',
      color: '#1a1a2e',
      marginBottom: isTablet ? 12 : 6,
      fontFamily: 'BricolageGrotesque_700Bold'
    },
    subtitle: {
      fontSize: isTablet ? 15 : 15,
      color: '#494848ff',
      marginBottom: isTablet ? 28 : 15,
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    inputContainer: {
      marginBottom: isTablet ? height * 0.025 : height * 0.02
    },
    inputLabel: {
      fontSize: isTablet ? 13 : 15,
      color: '#333',
      marginBottom: 6,
      fontWeight: '500',
      fontFamily: 'BricolageGrotesque_500Medium'
    },
    inputWrapper: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: isTablet ? 14 : width * 25,
      paddingHorizontal: isTablet ? 18 : width * 0.04,
      height: isTablet ? 62 : 50,
      alignItems: 'center',
      borderWidth: 0.4,
      borderColor: isTablet ? '#e0e0e0' : '#1c0032'
    },
    input: {
      flex: 1,
      fontSize: isTablet ? 13 : 13,
      color: '#333',
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    iconSize: isTablet ? 28 : 22,
    checkboxIconSize: isTablet ? 18 : 14,
    errorText: {
      color: '#e74c3c',
      fontSize: isTablet ? 11 : 10,
      marginTop: 4,
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    statusText: {
      color: 'green',
      fontSize: isTablet ? 11 : 10,
      marginTop: 4,
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    statusTextError: {
      color: 'red',
      fontSize: isTablet ? 11 : 10,
      marginTop: 4,
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    termsContainer: {
      marginBottom: isTablet ? height * 0.03 : height * 0.025
    },
    checkboxLabel: {
      fontSize: isTablet ? 12 : 13,
      color: '#333',
      flex: 1,
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    signUpButton: {
      backgroundColor: '#1c0032',
      height: isTablet ? 56 : 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isTablet ? height * 0.03 : height * 0.025
    },
    signUpButtonText: {
      color: '#fff',
      fontSize: isTablet ? 15 : 18,
      fontWeight: '600',
      fontFamily: 'BricolageGrotesque_600SemiBold'
    },
    orContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: isTablet ? height * 0.025 : height * 0.02
    },
    orText: {
      paddingHorizontal: 15,
      color: '#777',
      fontSize: isTablet ? 12 : 15,
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    googleButton: {
      flexDirection: 'row',
      height: isTablet ? 62 : 50,
      borderWidth: 0.4,
      borderColor: isTablet ? '#e0e0e0' : '#1c0032',
      borderRadius: isTablet ? 14 : 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginBottom: isTablet ? height * 0.04 : height * 0.03
    },
    googleIcon: {
      width: isTablet ? 42 : 38,
      height: isTablet ? 32 : 22,
      marginRight: 10
    },
    googleButtonText: {
      color: '#333',
      fontSize: isTablet ? 14 : 15,
      fontWeight: '500',
      fontFamily: 'BricolageGrotesque_500Medium'
    },
    signInText: {
      fontSize: isTablet ? 13 : 16,
      color: '#666',
      fontFamily: 'BricolageGrotesque_400Regular'
    },
    signInLink: {
      fontSize: isTablet ? 13 : 16,
      color: '#1c0032',
      fontWeight: '600',
      fontFamily: 'BricolageGrotesque_600SemiBold'
    }
  };
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingView: { flex: 1 },
  logoContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inputIcon: { marginRight: 10 },
  eyeIcon: { padding: 5 },
  inputError: { borderColor: '#e74c3c', borderWidth: 1 },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#1c0032', borderColor: '#1c0032' },
  termsLink: { color: '#1c0032', fontWeight: '500', fontFamily: 'BricolageGrotesque_600SemiBold' },
  divider: { flex: 1, height: 1, backgroundColor: '#ddd' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  signInContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }
});

export default RegisterScreen;