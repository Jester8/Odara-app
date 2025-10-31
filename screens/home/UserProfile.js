import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../src/store/useAuthStore';

const UserProfile = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user]);

  const handlePress = (label) => {
    if (label === 'Edit profile') {
      navigation.navigate('EditUserProfile'); 
    } 
    else if (label === 'Log out') {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            onPress: () => {
              logout();
              navigation.replace('Login');
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      Alert.alert(label, `You tapped on "${label}"`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={70} color="#2d0033" />
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
      </View>

      {/* Menu sections */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Section title="Account" items={[
          { icon: 'person', label: 'Edit profile' },
          { icon: 'shield-checkmark', label: 'Security' },
          { icon: 'notifications', label: 'Notifications' },
          { icon: 'lock-closed', label: 'Privacy' },
        ]} onPress={handlePress} />

        <Section title="Support & About" items={[
          { icon: 'card', label: 'Payment Options' },
          { icon: 'help-circle', label: 'Help & Support' },
          { icon: 'document-text', label: 'Terms and Policies' },
        ]} onPress={handlePress} />

        <Section title="Cache & Cellular" items={[
          { icon: 'receipt', label: 'Orders' },
          { icon: 'mail', label: 'Inbox' },
        ]} onPress={handlePress} />

        <Section title="Actions" items={[
          { icon: 'alert-circle', label: 'Report a problem' },
          { icon: 'star', label: 'Ratings & Reviews' },
          { icon: 'log-out', label: 'Log out' },
        ]} onPress={handlePress} />
      </ScrollView>
    </View>
  );
};

const Section = ({ title, items, onPress }) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>
      {items.map(({ icon, label }) => (
        <TouchableOpacity key={label} style={styles.menuItem} onPress={() => onPress(label)}>
          <Ionicons name={icon} size={20} color="#000" style={styles.icon} />
          <Text style={styles.menuText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#2d0033',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'BricolageGrotesk-Regular',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8e6ff',
    margin: 10,
    borderRadius: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d0033',
    marginTop: 5,
    fontFamily: 'BricolageGrotesk-Regular',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'BricolageGrotesk-Regular',
  },
  sectionTitle: {
    marginTop: 20,
    marginLeft: 15,
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    fontFamily: 'BricolageGrotesk-Regular',
  },
  card: {
    backgroundColor: '#f3d1ff',
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  icon: {
    width: 30,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'BricolageGrotesk-Regular',
  },
});

export default UserProfile;
