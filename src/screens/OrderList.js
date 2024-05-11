import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const userId = useSelector(state => state.user.id);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
      
        const response = await axios.get(`http://192.168.1.4:8000/orders/user/${userId}`,{headers: {
          Authorization: token ? `Bearer ${token}` : null
        }});
        const ordersData = response.data;

        if (!ordersData || ordersData.length === 0) {
          return
        }

        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
  }, [userId]); 

  const handleOrderPress = (orders) => {
    navigation.navigate('OrderProducts', { order: orders });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleOrderPress(item)}>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 10 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Order Date: {new Date(item.orderedAt).toLocaleString()}</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Price: Rs{item.totalPrice}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default OrderList;
