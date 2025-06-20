import React, {useEffect} from "react";
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Slides'); // Navigate to Welcome screen after 6 seconds
      // You can also use navigation.navigate('Welcome') if you want to keep the splash screen in the stack
      // You can also navigate to another screen like this:
    }, 1000); 
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#4B0082" style={styles.spinner} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  spinner: {
    marginTop: 20,
  },
});
