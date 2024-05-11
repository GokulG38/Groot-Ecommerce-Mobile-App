
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList , Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderProducts = ({ route }) => {
  const { order } = route.params;
  const [products, setProducts] = useState([]);
  const navigation = useNavigation()

  useEffect(() => {
    const fetchProducts = async () => {
      
      try {
        const token = await AsyncStorage.getItem('authToken');
        const productIds = order.items.map(item => item.product);
        const productResponses = await Promise.all(
          productIds.map(productId => axios.get(`http://192.168.1.4:8000/products/${productId}`,{headers: {
            Authorization: token ? `Bearer ${token}` : null
          }}))
        );
        const productData = productResponses.map(response => response.data);
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, [order]);

  const renderItem = ({ item }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Image
          source={{ uri: item.image }} 
          style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{item.name}</Text>
          <Text style={{ fontSize: 16 }}>Description: {item.description}</Text>
          <Text style={{ fontSize: 16 }}>Price: ${item.price}</Text>
        </View>
      </View>
      {order.status==="delivered"&&(<>
        <TouchableOpacity
        style={{
          backgroundColor: '#FFC72C',
          padding: 10,
          borderRadius: 10,
          alignSelf: 'flex-end',
          marginBottom:5,
          marginRight:5
        }}
        onPress={() => navigation.navigate("Rate",{item})}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Review</Text>
      </TouchableOpacity>
      </>)}
      
    </View>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>Order Details</Text>
          <Text style={{ fontSize: 16, marginBottom: 10, textAlign: 'center' }}>Order Date: {new Date(order.orderedAt).toLocaleString()}</Text>
        </>
      }
    />
  );
};

export default OrderProducts;
