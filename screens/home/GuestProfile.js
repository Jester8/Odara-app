import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Feather,
  Entypo,
} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuestProfile({ navigation }) {
  const handlePress = () => {
    Alert.alert('Login Required', 'You need to login first.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="#fff" />

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Enter your account</Text>
        </View>

      <TouchableOpacity
  style={styles.loginButton}
  onPress={() => navigation.navigate('Login')}
>
  <Text style={styles.loginText}>Login</Text>
</TouchableOpacity>

      </View>

      {/* Main Body */}
      <ScrollView style={styles.body}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <Option icon={<Feather name="user" size={20} />} label="Edit profile" onPress={handlePress} />
            <Option icon={<Feather name="shield" size={20} />} label="Security" onPress={handlePress} />
            <Option icon={<Ionicons name="notifications-outline" size={20} />} label="Notifications" onPress={handlePress} />
            <Option icon={<Feather name="lock" size={20} />} label="Privacy" onPress={handlePress} />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.card}>
            <Option icon={<MaterialIcons name="payment" size={20} />} label="Payment Options" onPress={handlePress} />
            <Option icon={<Feather name="help-circle" size={20} />} label="Help & Support" onPress={handlePress} />
            <Option icon={<Feather name="info" size={20} />} label="Terms and Policies" onPress={handlePress} />
          </View>
        </View>

        {/* Cache Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cache & cellular</Text>
          <View style={styles.card}>
            <Option icon={<Entypo name="shopping-bag" size={20} />} label="Orders" onPress={handlePress} />
            <Option icon={<Feather name="mail" size={20} />} label="Inbox" onPress={handlePress} />
          </View>
        </View>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.createBtn}   onPress={() => navigation.navigate('Signup')}>
            
          <Text style={styles.createText}>Create account</Text>
          
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const Option = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} >
    {icon}
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2e003e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Bricolage',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'Bricolage',
  },
  loginButton: {
    backgroundColor: '#f89565',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Bricolage',
  },
  body: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Bricolage',
  },
  card: {
    backgroundColor: '#f3dfff',
    borderRadius: 10,
    padding: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#333',
    textTransform: 'capitalize',
    fontFamily: 'Bricolage',
  },
  createBtn: {
    backgroundColor: '#2e003e',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  createText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Bricolage',
  },
});
