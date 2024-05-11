
import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, Button, Text, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductItem from '../components/ProductItem';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await axios.get(`http://192.168.1.4:8000/products`, {
        params: { search: searchQuery, page: currentPage },
        headers: {
          Authorization: token ? `Bearer ${token}` : null
        }
      });
      setProducts(response.data.products);
      setTotalCount(response.data.totalCount);
      setRefreshing(false); 
    } catch (error) {
      console.log("error message", error);
      setRefreshing(false); 
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(); 
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onRefresh = () => {
    setRefreshing(true); 
    fetchData(); 
  };

  const totalPages = Math.ceil(totalCount / 5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#CCCCCC' }}>
        <TextInput
          style={{ flex: 1, marginRight: 10, padding: 10, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 5 }}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Products"
        />
        <Button title="Search" onPress={handleSearch} color="red"/>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['red']} 
            tintColor={'red'} 
          />
        }
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          {products.map((item, index) => (
            <ProductItem item={item} key={index} id={item._id} purpose="product" />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
          <Button title="◀️" onPress={() => handlePagination(currentPage - 1)} disabled={currentPage === 1} />
          <Text style={{ marginHorizontal: 10 }}>{currentPage}</Text>
          <Button title="▶️" onPress={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
