
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, RefreshControl, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  cleanCart,
} from '../redux/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const cartItems = useSelector(state => state.cart.cart);
  const userId = useSelector(state => state.user.id);
  const [userAddress, setUserAddress] = useState('');

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserAddress();
    setRefreshing(false);
  };

  const handleAddQuantity = item => {
    dispatch(incrementQuantity(item));
  };

  const handleRemoveQuantity = item => {
    dispatch(decrementQuantity(item));
  };

  const handleRemoveItem = item => {
    dispatch(removeFromCart(item));
  };

  const handleClearCart = () => {
    dispatch(cleanCart());
  };

  const handleProceedToBuy = () => {
    if (cartItems.length === 0) {
      return;
    }
    if (userAddress.length === 0) {
      navigation.navigate('AddAddress', { refreshCart: true });
    } else {
      navigation.navigate('SelectedAddress');
    }
  };

  const fetchUserAddress = async () => {
    const authToken = await AsyncStorage.getItem('authToken');

    try {
      const response = await axios.get(`http://192.168.1.4:8000/${userId}/address`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.data.addresses != null) {
        setUserAddress(response.data.addresses);
      }
    } catch (error) {
      console.error('Error fetching user address:', error);
      Alert.alert('Error', 'Failed to fetch user address. Please try again.');
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserAddress();
    }
  }, [isFocused]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFF', padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Cart
      </Text>
      {cartItems.map(item => (
        <View
          key={item._id}
          style={{
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: 100, height: 100, marginRight: 10 }}
          />
          <View style={{ flex: 1 }}>
            <Text>{item.name}</Text>
            <Text>Price: ₹{item.price}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable
                onPress={() => handleRemoveQuantity(item)}
                style={{
                  backgroundColor: '#DDDDDD',
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
              </Pressable>
              <Text> {item.quantity} </Text>
              <Pressable
                onPress={() => handleAddQuantity(item)}
                style={{
                  backgroundColor: '#DDDDDD',
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
              </Pressable>

              <Pressable onPress={() => handleRemoveItem(item)} style={{ marginLeft: 'auto' }}>
                <Text style={{ color: 'red' }}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Total Price: ₹{totalPrice}
      </Text>

      {cartItems.length > 0 && (
        <Pressable
          onPress={handleProceedToBuy}
          style={{
            backgroundColor: '#FF9900',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>
            Proceed to Buy
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={handleClearCart}
        style={{
          backgroundColor: '#FF0000',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>
          Clear Cart
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Cart;
