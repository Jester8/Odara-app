import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { verticalScale, moderateScale } from 'react-native-size-matters';

import HomeScreen from '../home/home.js';
import Wishlist from "../wishlist/Wishlist.js";
import Cart from '../cart/Cart.js';
import Search from '../search/Search.js';
import Settings from '../setting/Settings.js';

const Tab = createBottomTabNavigator();
const ACTIVE_COLOR = '#4B0082';
const INACTIVE_COLOR = '#000000';

const AnimatedIcon = ({ name, focused, size }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
      />
    </Animated.View>
  );
};

const Navigation = () => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: {
            fontSize: moderateScale(10), // responsiveFontSize(1.4) approx
            marginBottom: 4,
          },
          tabBarIcon: ({ focused }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home-variant' : 'home-variant-outline';
                break;
              case 'Wishlist':
                iconName = focused ? 'heart' : 'heart-outline';
                break;
              case 'Cart':
                iconName = focused ? 'cart' : 'cart-outline';
                break;
              case 'Search':
                iconName = 'magnify';
                break;
              case 'Settings':
                iconName = focused ? 'cog' : 'cog-outline';
                break;
              default:
                iconName = 'alert';
            }

            return (
              <View style={styles.iconWrapper}>
                <AnimatedIcon name={iconName} focused={focused} size={26} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Wishlist" component={Wishlist} />
        <Tab.Screen name="Cart" component={Cart} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: verticalScale(75), // responsiveHeight(9.5) approx
    paddingBottom: 10,
    paddingTop: 6,
    marginBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 0,
    elevation: 0,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Navigation;
