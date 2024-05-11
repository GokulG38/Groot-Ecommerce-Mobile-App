import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Cart from '../screens/Cart';
import ProductInfo from '../screens/ProductInfo';
import AddAddress from '../screens/AddAddress';
import SelectAddress from '../screens/SelectAddress';
import Confirmation from '../screens/Confirmation';
import Rate from '../screens/Rate';
import OrderList from '../screens/OrderList';
import OrderProducts from '../screens/OrderProducts';
import ReviewList from "../screens/ReviewList"


const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    return (
      <Tab.Navigator >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "#008E97" },
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1946/1946436.png' }}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "You",
            tabBarLabelStyle: { color: "#008E97" },
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png' }} 
                style={{ width: size, height: size, tintColor: color }}
              />
            ),

          }}
        />

        <Tab.Screen
          name="Cart"
          component={Cart}
          options={{
            tabBarLabel: "Cart",
            tabBarLabelStyle: { color: "#008E97" },
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/128/3514/3514491.png' }} 
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ProductInfo" component={ProductInfo} options={{ headerShown: false }} />
        <Stack.Screen name="AddAddress" component={AddAddress} options={{ headerShown: false }} />
        <Stack.Screen name="SelectedAddress" component={SelectAddress} options={{ headerShown: false }} />
        <Stack.Screen name="Confirmation" component={Confirmation} options={{ headerShown: false }} />
        <Stack.Screen name="Rate" component={Rate} options={{ headerShown: false }} />
        <Stack.Screen name="OrderList" component={OrderList} options={{ headerShown: false }} />
        <Stack.Screen name="OrderProducts" component={OrderProducts} options={{ headerShown: false }} />
        <Stack.Screen name="ReviewList" component={ReviewList} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;

const styles = StyleSheet.create({});