import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
  Modal,
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../src/store/useAuthStore';
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

const LoginScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { setUser, setToken } = useAuthStore();
  
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loginSuccess) {
      checkmarkScale.setValue(0);
      checkmarkOpacity.setValue(0);
      
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setLoginSuccess(false);
        navigation.replace('navigation');
      }, 2000);
    }
  }, [loginSuccess]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://odara-app.onrender.com/api/auth/login", {
        email,
        password,
      });

      if (response.data) {
        const { token, user } = response.data;

        if (rememberMe && token) {
          await AsyncStorage.setItem('userToken', token);
        }

        try {
          if (token && setToken) setToken(token);
          if (user && setUser) setUser(user);
        } catch (e) {
          console.log('Store error:', e);
        }
        
        setLoginSuccess(true);
      } else {
        Alert.alert('Login Failed', 'Invalid server response');
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Network error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Welcome back to Odara. Please sign in to continue.</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#555"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  placeholderTextColor="#555"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={passwordVisible ? "eye" : "eye-off"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Feather name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button with Loader */}
            <TouchableOpacity 
              style={[styles.loginButton, loading && { opacity: 0.7 }]} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.orContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Login */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
              <Image 
                source={require('../../assets/logo/google.webp')} 
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={loginSuccess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Animated.View 
              style={[
                styles.successCheckbox,
                {
                  transform: [{ scale: checkmarkScale }],
                  opacity: checkmarkOpacity,
                }
              ]}
            >
              <Feather name="check" size={50} color="#fff" strokeWidth={3} />
            </Animated.View>
            <Text style={styles.successTitle}>Login Successful!</Text>
            <Text style={styles.successSubtitle}>Welcome back to Odara</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.15,
  },
  formContainer: {
    paddingVertical: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: height * 0.01,
    fontFamily: 'BricolageGrotesque_700Bold',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.03,
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: 'BricolageGrotesque_500Medium',
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
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
    fontSize: width * 0.04,
    color: '#333',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  eyeIcon: {
    padding: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1c0032',
    borderColor: '#1c0032',
  },
  checkboxLabel: {
    fontSize: width * 0.035,
    color: '#333',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  forgotPassword: {
    fontSize: width * 0.035,
    color: '#1c0032',
    fontWeight: '500',
    fontFamily: 'BricolageGrotesque_500Medium',
  },
  loginButton: {
    backgroundColor: '#1c0032',
    height: height * 0.065,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
    fontFamily: 'BricolageGrotesque_600SemiBold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    paddingHorizontal: 15,
    color: '#777',
    fontSize: width * 0.035,
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  googleButton: {
    flexDirection: 'row',
    height: height * 0.065,
    borderWidth: 0.4,
    borderColor: '#1c0032',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: height * 0.03,
  },
  googleIcon: {
    width: 32,
    height: 22,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: width * 0.04,
    fontWeight: '500',
    fontFamily: 'BricolageGrotesque_500Medium',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: width * 0.04,
    color: '#666',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  signupLink: {
    fontSize: width * 0.04,
    color: '#1c0032',
    fontWeight: '600',
    fontFamily: 'BricolageGrotesque_600SemiBold',
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
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: width * 0.8,
  },
  successCheckbox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1c0032',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#1c0032',
    marginBottom: 8,
    fontFamily: 'BricolageGrotesque_600SemiBold',
  },
  successSubtitle: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
});

export default LoginScreen;