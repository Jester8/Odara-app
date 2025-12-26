import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../home/home.js';
import Cart from '../cart/Cart.js';
import Wishlist from '../wishlist/Wishlist.js';

const Categories = () => (
  <View style={{ flex: 1, backgroundColor: '#fff' }} />
);

const Profile = () => (
  <View style={{ flex: 1, backgroundColor: '#fff' }} />
);

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const ACTIVE_COLOR = '#df7512ff';
const INACTIVE_COLOR = '#000000ff';


const iconConfig = {
  Home: {
    outline: 'home-outline',
    filled: 'home',
  },
  Categories: {
    outline: 'grid-outline',
    filled: 'grid',
  },
  Cart: {
    outline: 'cart-outline',
    filled: 'cart',
  },
  Wishlist: {
    outline: 'heart-outline',
    filled: 'heart',
  },
  Profile: {
    outline: 'person-outline',
    filled: 'person',
  },
};

const AnimatedIcon = ({ tabName, focused, size }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.15 : 1,
        useNativeDriver: true,
        friction: 5,
        tension: 40,
      }),
      Animated.timing(rotateAnim, {
        toValue: focused ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '0deg'],
  });

 
  const iconName = focused 
    ? iconConfig[tabName]?.filled 
    : iconConfig[tabName]?.outline;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }, { rotate: rotation }] },
      ]}
    >
      <Ionicons
        name={iconName}
        size={size}
        color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
      />
    </Animated.View>
  );
};

const GlassTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.glassmorphicBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View 
              key={route.key} 
              style={styles.tabItemContainer}
              onTouchEnd={onPress}
              onLongPress={onLongPress}
            >
              <Animated.View
                style={[
                  styles.tabItem,
                  isFocused && styles.activeTabItem,
                ]}
              >
                <View style={styles.iconContainer}>
                  <AnimatedIcon
                    tabName={route.name}
                    focused={isFocused}
                    size={26}
                  />
                </View>
                <Animated.Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.activeTabLabel,
                  ]}
                >
                  {label}
                </Animated.Text>
              </Animated.View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const Navigation = () => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        tabBar={(props) => <GlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="Categories"
          component={Categories}
          options={{
            tabBarLabel: 'Categories',
          }}
        />
        <Tab.Screen
          name="Cart"
          component={Cart}
          options={{
            tabBarLabel: 'Cart',
          }}
        />
        <Tab.Screen
          name="Wishlist"
          component={Wishlist}
          options={{
            tabBarLabel: 'Wishlist',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(12),
    paddingBottom: verticalScale(20),
    backgroundColor: 'transparent',
  },
  glassmorphicBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(80),
    paddingVertical: verticalScale(2),
    paddingHorizontal: moderateScale(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(6),
    borderRadius: moderateScale(20),
  },
 
  
  iconContainer: {
    marginBottom: verticalScale(4),
  },
  tabLabel: {
    fontSize: moderateScale(11),
    color: INACTIVE_COLOR,
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  activeTabLabel: {
    color: ACTIVE_COLOR,
    fontWeight: '600',
  },
});

export default Navigation;