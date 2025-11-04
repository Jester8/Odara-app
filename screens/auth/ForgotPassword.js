import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://odara-app.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert('OTP sent to your email');
        navigation.navigate('OtpScreen', { email: email.toLowerCase() });
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <View style={responsiveStyles.headerContainer}>
        </View>

        <View style={responsiveStyles.contentContainer}>
          <Text style={responsiveStyles.title}>FORGOT PASSWORD</Text>
          <Text style={responsiveStyles.subtitle}>
            Kindly enter your email to reset your password
          </Text>

          <View style={responsiveStyles.inputContainer}>
            <Ionicons name="mail" size={responsiveStyles.iconSize} color="#4e4e4e" style={styles.icon} />
            <TextInput
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              style={responsiveStyles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          <Text style={responsiveStyles.note}>
            <Text style={{ color: 'red' }}>*</Text> We will send you a message to set or reset your new password
          </Text>

          <TouchableOpacity 
            style={[responsiveStyles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={responsiveStyles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Responsive styles function
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
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: isTablet ? height * 0.04 : (Platform.OS === 'ios' ? height * 0.05 : height * 0.03),
      marginBottom: isTablet ? height * 0.05 : height * 0.04,
      position: isTablet ? 'relative' : 'relative',
    },
    backButton: {
      position: isTablet ? 'relative' : 'absolute',
      left: isTablet ? 0 : 0,
      zIndex: 1,
      marginTop: isTablet ? 0 : 120,
      marginBottom: isTablet ? 20 : 0,
    },
    backIconSize: isTablet ? height * 0.04 : height * 0.035,
    contentContainer: {
      marginTop: isTablet ? height * 0.04 : height * 0.02,
    },
    title: {
      fontSize: isTablet ? 28 : 20,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: isTablet ? 12 : 8,
      textAlign: 'start',
      fontFamily: 'BricolageGrotesque_700Bold',
      marginLeft: isTablet ? 0 : 54,
    },
    subtitle: {
      fontSize: isTablet ? 15 : 12,
      color: '#999',
      marginBottom: isTablet ? 28 : 15,
      textAlign: 'start',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: isTablet ? 14 : width * 0.025,
      borderColor: '#210030ff',
      borderWidth: 1.2,
      paddingHorizontal: isTablet ? 18 : width * 0.03,
      paddingVertical: isTablet ? 16 : height * 0.015,
      alignItems: 'center',
      marginBottom: isTablet ? height * 0.02 : height * 0.015,
    },
    iconSize: isTablet ? 28 : 20,
    input: {
      flex: 1,
      fontSize: isTablet ? 13 : 12,
      color: '#000',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    note: {
      fontSize: isTablet ? 12 : 10,
      color: '#666',
      marginBottom: isTablet ? height * 0.05 : height * 0.04,
      textAlign: 'center',
      fontFamily: 'BricolageGrotesque_400Regular',
    },
    submitButton: {
      backgroundColor: '#1c0032',
      paddingVertical: isTablet ? 16 : height * 0.02,
      borderRadius: isTablet ? 14 : width * 0.025,
      alignItems: 'center',
      height: isTablet ? 62 : 50,
      justifyContent: 'center',
    },
    submitText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: isTablet ? 15 : 14,
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