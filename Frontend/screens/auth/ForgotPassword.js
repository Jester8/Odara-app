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
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log('Submitted email:', email);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={height * 0.035} color="#1c0032" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>FORGOT PASSWORD</Text>
          <Text style={styles.subtitle}>
            Kindly enter your email to reset your password
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={height * 0.025} color="#4e4e4e" style={styles.icon} />
            <TextInput
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          </View>

          <Text style={styles.note}>
            <Text style={{ color: 'red' }}>*</Text> We will send you a message to set or reset your new password
          </Text>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
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
    padding: width * 0.05,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.03,
    marginBottom: height * 0.04,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.15,
  },
  contentContainer: {
    marginTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.01,
    textAlign: 'start',
    fontFamily: 'BricolageGrotesque_700Bold',
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.03,
    textAlign: 'start',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  icon: {
    marginRight: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#000',
  },
  note: {
    fontSize: width * 0.03,
    color: '#666',
    marginBottom: height * 0.04,
    textAlign: 'center',
    fontFamily: 'BricolageGrotesque_400Regular',
  },
  submitButton: {
    backgroundColor: '#1c0032',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.025,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});