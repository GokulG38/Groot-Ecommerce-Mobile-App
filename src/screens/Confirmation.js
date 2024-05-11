
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { cleanCart } from '../redux/cartSlice'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Confirmation = ({ route}) => {
  const { selectedAddress } = route.params;
  const cart = useSelector(state => state.cart.cart); 
  const userId = useSelector(state => state.user.id); 
  const dispatch = useDispatch(); 
  const Navigation = useNavigation()

  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  
  const handleOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')

      const orderData = {
        user: userId, 
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: totalPrice,
        address: selectedAddress, 
        status: 'pending' 
      };

      await axios.post('http://192.168.1.4:8000/order', orderData,{headers: {
        Authorization: token ? `Bearer ${token}` : null
      }});

   
      dispatch(cleanCart());

   
      Alert.alert('Order Placed', 'Your order has been placed successfully!')
      Navigation.replace("Main")
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Confirmation</Text>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Selected Address:</Text>
        <Text>{selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zipCode}</Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Cart Details:</Text>
        {cart.map(item => (
          <View key={item._id} style={{ backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100, marginBottom: 10 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: ₹{item.price}</Text>
          </View>
        ))}
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total Price: ₹{totalPrice.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={{ backgroundColor: '#FF0000', borderRadius: 8, paddingVertical: 12, alignItems: 'center' }} onPress={handleOrder}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Confirmation;
