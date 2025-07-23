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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; 

const { width } = Dimensions.get('window');

const Confirm = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const navigation = useNavigation(); // ✅ navigation hook

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index !== 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleConfirm = () => {
    const otpCode = code.join('');
    console.log('Entered Code:', otpCode);
    // TODO: Add your backend verification logic here

    // ✅ navigate to Login screen
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backArrow}>
          <Text style={styles.arrowText}>{'←'}</Text>
        </TouchableOpacity>

        <View style={styles.topSection}>
          <Image
            source={require('../../assets/logo/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>CONFIRM EMAIL ADDRESS</Text>
          <Text style={styles.subtitle}>
            Kindly enter the 6-digit code sent to your email
          </Text>
        </View>

        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleBackspace(e, index)}
              ref={(ref) => (inputs.current[index] = ref)}
            />
          ))}
        </View>

        <Text style={styles.infoText}>
          <Text style={styles.asterisk}>* </Text>
          We will send you a message to confirm you own the email.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm Email</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const BOX_SIZE = width / 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backArrow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 30,
    left: 10,
    zIndex: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#000',
  },
  logo: {
    width: 150,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
  },
  infoText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  asterisk: {
    color: 'red',
  },
  button: {
    backgroundColor: '#1c002c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
});

export default Confirm;
