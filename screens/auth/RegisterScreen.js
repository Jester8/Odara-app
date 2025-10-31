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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/logo/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started with Odara.</Text>

            {/* First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <View style={[styles.inputWrapper, errors.firstName ? styles.inputError : null]}>
                <Feather name="user" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#555"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <View style={[styles.inputWrapper, errors.lastName ? styles.inputError : null]}>
                <Feather name="user" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#555"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
              {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[styles.inputWrapper, errors.phoneNumber ? styles.inputError : null]}>
                <Feather name="phone" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#555"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                {checkingPhone && <ActivityIndicator size="small" color="#1c0032" />}
              </View>
              {phoneStatus === "available" && <Text style={{ color: "green" }}>✅ Phone available</Text>}
              {phoneStatus === "taken" && <Text style={{ color: "red" }}>❌ Phone already registered</Text>}
              {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
            </View>

            {/* Date of Birth */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity style={[styles.inputWrapper, errors.dateOfBirth ? styles.inputError : null]} onPress={() => setDatePickerVisibility(true)}>
                <Feather name="calendar" size={20} color="#999" style={styles.inputIcon} />
                <Text style={styles.input}>{formatDate(dateOfBirth)}</Text>
              </TouchableOpacity>
              {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                <Feather name="mail" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                {checkingEmail && <ActivityIndicator size="small" color="#1c0032" />}
              </View>
              {emailStatus === "available" && <Text style={{ color: "green" }}>✅ Email available</Text>}
              {emailStatus === "taken" && <Text style={{ color: "red" }}>❌ Email already registered</Text>}
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create password"
                  placeholderTextColor="#555"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                  <Feather name={passwordVisible ? "eye" : "eye-off"} size={20} color="#999" />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#555"
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
                  <Feather name={confirmPasswordVisible ? "eye" : "eye-off"} size={20} color="#999" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && <Feather name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.signUpButton, loading && { opacity: 0.7 }]} 
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.orContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Sign Up */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
              <Image 
                source={require('../../assets/logo/google.webp')} 
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: width * 0.05, paddingBottom: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingTop: height * 0.02, paddingBottom: height * 0.02, justifyContent: 'center' },
  logoContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: width * 0.35, height: width * 0.15 },
  formContainer: { paddingVertical: height * 0.02, backgroundColor: '#fff', paddingHorizontal: width * 0.04, borderRadius: 8 },
  title: { fontSize: width * 0.07, fontWeight: 'bold', color: '#1a1a2e', marginBottom: height * 0.01, fontFamily: 'BricolageGrotesque_700Bold' },
  subtitle: { fontSize: width * 0.04, color: '#666', marginBottom: height * 0.03, fontFamily: 'BricolageGrotesque_400Regular' },
  inputContainer: { marginBottom: height * 0.02 },
  inputLabel: { fontSize: width * 0.04, color: '#333', marginBottom: 8, fontWeight: '500', fontFamily: 'BricolageGrotesque_500Medium' },
  inputWrapper: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: width * 0.025, paddingHorizontal: width * 0.03, height: 50, alignItems: 'center', borderWidth: 0.4, borderColor: '#1c0032' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: width * 0.04, color: '#333', fontFamily: 'BricolageGrotesque_400Regular' },
  eyeIcon: { padding: 5 },
  inputError: { borderColor: '#e74c3c', borderWidth: 1 },
  errorText: { color: '#e74c3c', fontSize: width * 0.035, marginTop: 5, fontFamily: 'BricolageGrotesque_400Regular' },
  termsContainer: { marginBottom: height * 0.025 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#1c0032', borderColor: '#1c0032' },
  checkboxLabel: { fontSize: width * 0.035, color: '#333', flex: 1, fontFamily: 'BricolageGrotesque_400Regular' },
  termsLink: { color: '#1c0032', fontWeight: '500', fontFamily: 'BricolageGrotesque_600SemiBold' },
  signUpButton: { backgroundColor: '#1c0032', height: height * 0.065, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.025 },
  signUpButtonText: { color: '#fff', fontSize: width * 0.045, fontWeight: '600', fontFamily: 'BricolageGrotesque_600SemiBold' },
  orContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: height * 0.02 },
  divider: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { paddingHorizontal: 15, color: '#777', fontSize: width * 0.035, fontFamily: 'BricolageGrotesque_400Regular' },
  googleButton: { flexDirection: 'row', height: height * 0.065, borderWidth: 0.4, borderColor: '#1c0032', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginBottom: height * 0.03 },
  googleIcon: { width: 32, height: 22, marginRight: 10 },
  googleButtonText: { color: '#333', fontSize: width * 0.04, fontWeight: '500', fontFamily: 'BricolageGrotesque_500Medium' },
  signInContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  signInText: { fontSize: width * 0.04, color: '#666', fontFamily: 'BricolageGrotesque_400Regular' },
  signInLink: { fontSize: width * 0.04, color: '#1c0032', fontWeight: '600', fontFamily: 'BricolageGrotesque_600SemiBold' }
});

export default RegisterScreen;