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
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { authService } from '../services/authServices';
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

const LoginScreen = () => {
  const navigation = useNavigation();
  
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
  const { setError, clearError } = useAuthStore();
  
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (!loginSuccess) return;

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

    const timer = setTimeout(() => {
      setLoginSuccess(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [loginSuccess]);

  const validateInputs = () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Please enter your password');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    clearError();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      await authService.signin({
        email: email.trim(),
        password,
      });

      setLoginSuccess(true);
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleSignUp = () => {
    clearError();
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    clearError();
    navigation.navigate('ForgotPassword');
  };

  if (!fontsLoaded) return null;

  const responsiveStyles = getResponsiveStyles();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={responsiveStyles.scrollContent}>
          <View style={responsiveStyles.logoContainer}>
            <Image 
              source={require('../../assets/logo/logo.png')} 
              style={responsiveStyles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={responsiveStyles.formContainer}>
            <Text style={responsiveStyles.title}>Welcome Back</Text>
            <Text style={responsiveStyles.subtitle}>Welcome back to Odara. Please sign in to continue.</Text>

            {/* Email Input */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Email Address</Text>
              <View style={responsiveStyles.inputWrapper}>
                <Feather name="mail" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="Email address"
                  placeholderTextColor="#555"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={responsiveStyles.inputContainer}>
              <Text style={responsiveStyles.inputLabel}>Password</Text>
              <View style={responsiveStyles.inputWrapper}>
                <Feather name="lock" size={responsiveStyles.iconSize} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={responsiveStyles.input}
                  placeholder="Enter Password"
                  placeholderTextColor="#555"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError();
                  }}
                  editable={!loading}
                />
                <TouchableOpacity 
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                  disabled={loading}
                >
                  <Feather 
                    name={passwordVisible ? "eye" : "eye-off"} 
                    size={responsiveStyles.iconSize} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Options */}
            <View style={responsiveStyles.optionsContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={loading}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Feather name="check" size={responsiveStyles.checkboxIconSize} color="#fff" />}
                </View>
                <Text style={responsiveStyles.checkboxLabel}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
                <Text style={responsiveStyles.forgotPassword}>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button with Loader */}
            <TouchableOpacity 
              style={[responsiveStyles.loginButton, loading && { opacity: 0.7 }]} 
              onPress={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={responsiveStyles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={responsiveStyles.orContainer}>
              <View style={styles.divider} />
              <Text style={responsiveStyles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Login */}
            <TouchableOpacity style={responsiveStyles.googleButton} onPress={handleGoogleLogin} disabled={loading}>
              <Image 
                source={require('../../assets/logo/google.webp')} 
                style={responsiveStyles.googleIcon}
                resizeMode="contain"
              />
              <Text style={responsiveStyles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={responsiveStyles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp} disabled={loading}>
                <Text style={responsiveStyles.signupLink}>Sign Up</Text>
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
          <View style={responsiveStyles.modalContent}>
            <Animated.View 
              style={[
                responsiveStyles.successCheckbox,
                {
                  transform: [{ scale: checkmarkScale }],
                  opacity: checkmarkOpacity,
                }
              ]}
            >
              <Feather name="check" size={responsiveStyles.checkmarkSize} color="#fff" strokeWidth={3} />
            </Animated.View>
            <Text style={responsiveStyles.successTitle}>Login Successful!</Text>
            <Text style={responsiveStyles.successSubtitle}>Welcome back to Odara</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: isTablet ? height * 0.03 : height * 0.02,
      paddingBottom: isTablet ? height * 0.03 : height * 0.02,
    },
    logo: {
      width: isTablet ? width * 0.20 : width * 0.24,
      height: isTablet ? width * 0.1 : width * 0.15,
    },
    formContainer: {
      paddingVertical: isTablet ? height * 0.04 : height * 0.02,
      paddingHorizontal: isTablet ? width * 0.06 : width * 0.04,
      borderRadius: isTablet ? 16 : 8
    },
    title: {
      fontSize: isTablet ? 28 : 20,
      fontWeight: 'bold',
      color: '#1a1a2e',
      marginBottom: isTablet ? 12 : 6,
      fontFamily: 'BricolageGrotesque_700Bold',
    },
    subtitle: {
      fontSize: isTablet ? 15 : 15,
      color: '#999',
      marginBottom: isTablet ? 28 : 15,
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    inputContainer: {
      marginBottom: isTablet ? height * 0.025 : height * 0.02,
    },
    inputLabel: {
      fontSize: isTablet ? 13 : 15,
      color: '#333',
      marginBottom: 6,
      fontWeight: '500',
      fontFamily: 'BricolageGrotesque_500Medium',
    },
    inputWrapper: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: isTablet ? 14 : width * 0.4,
      paddingHorizontal: isTablet ? 18 : width * 0.03,
      height: isTablet ? 62 : 50,
      alignItems: 'center',
      borderWidth: 0.4,
      borderColor: isTablet ? '#e0e0e0' : '#1c0032',
    },
    input: {
      flex: 1,
      fontSize: isTablet ? 13 : 12,
      color: '#333',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    iconSize: isTablet ? 28 : 20,
    checkboxIconSize: isTablet ? 18 : 14,
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isTablet ? height * 0.03 : height * 0.025,
    },
    checkboxLabel: {
      fontSize: isTablet ? 12 : 12,
      color: '#333',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    forgotPassword: {
      fontSize: isTablet ? 12 : 12,
      color: '#1c0032',
      fontWeight: '500',
      fontFamily: 'BricolageGrotesque_500Medium',
    },
    loginButton: {
      backgroundColor: '#1c0032',
      height: isTablet ? 62 : 50,
      borderRadius: isTablet ? 25 : 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isTablet ? height * 0.03 : height * 0.025,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: isTablet ? 15 : 15,
      fontWeight: '600',
      fontFamily: 'BricolageGrotesque_600SemiBold',
    },
    orContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: isTablet ? height * 0.025 : height * 0.02,
    },
    orText: {
      paddingHorizontal: 15,
      color: '#777',
      fontSize: isTablet ? 12 : 15,
      fontFamily: 'BricolageGrotesque_400Regular',
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
      marginBottom: isTablet ? height * 0.04 : height * 0.03,
    },
    googleIcon: {
      width: isTablet ? 42 : 32,
      height: isTablet ? 32 : 22,
      marginRight: 10,
    },
    googleButtonText: {
      color: '#333',
      fontSize: isTablet ? 14 : 15,
      fontWeight: '500',
      fontFamily: 'BricolageGrotesque_500Medium',
    },
    signupText: {
      fontSize: isTablet ? 13 : 15,
      color: '#666',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    signupLink: {
      fontSize: isTablet ? 13 : 15,
      color: '#1c0032',
      fontWeight: '600',
      fontFamily: 'BricolageGrotesque_600SemiBold',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: isTablet ? 24 : 16,
      paddingVertical: isTablet ? 50 : 40,
      paddingHorizontal: isTablet ? 50 : 30,
      alignItems: 'center',
      width: isTablet ? width * 0.6 : width * 0.8,
    },
    successCheckbox: {
      width: isTablet ? 120 : 100,
      height: isTablet ? 120 : 100,
      borderRadius: isTablet ? 60 : 50,
      backgroundColor: '#1c0032',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isTablet ? 24 : 20,
    },
    checkmarkSize: isTablet ? 60 : 50,
    successTitle: {
      fontSize: isTablet ? 20 : 16,
      fontWeight: '600',
      color: '#1c0032',
      marginBottom: 8,
      fontFamily: 'BricolageGrotesque_600SemiBold',
    },
    successSubtitle: {
      fontSize: isTablet ? 14 : 12,
      color: '#666',
      textAlign: 'center',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 5,
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
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;   