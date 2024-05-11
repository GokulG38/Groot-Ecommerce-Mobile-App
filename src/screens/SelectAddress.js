import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const userId = useSelector(state => state.user.id);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken')

        const response = await axios.get(`http://192.168.1.4:8000/${userId}/address`,{headers: {
          Authorization: token ? `Bearer ${token}` : null
        }});
        setAddresses(response.data.addresses);

      } catch (error) {
        console.error('Error fetching addresses:', error);

      }
    };

    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
  };

  const handleProceedToConfirmation = () => {
    if (selectedAddress) {

      navigation.navigate('Confirmation', { selectedAddress });
    } else {

    }
  };

  const handleAddAddress = () => {
    navigation.navigate('AddAddress');
  };
  const handleEditAddress = (address) => {
  
    navigation.navigate('AddAddress', { address });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Select Address</Text>
      <ScrollView style={{ marginBottom: 20 }}>
        {addresses?.map(address => (
          <View key={address._id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selectedAddress === address ? '#FF9900' : '#ccc',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
              onPress={() => handleAddressSelection(address)}>
              {selectedAddress === address && (
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: '#FF9900',
                  }}
                />
              )}
            </TouchableOpacity>
            <View style={{ flex: 1, backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10 }}>
              <Text>{address.street}, {address.city}, {address.state}, {address.zipCode}, Contact no- {address.number}</Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#FFFFFF',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                alignItems: 'center',
                marginLeft: 10,
                borderColor:'#FF9900',
                borderWidth:2
                
              }}
              onPress={() => handleEditAddress(address)}>
              <Text style={{ color: '#000000', fontSize: 14, fontWeight: 'bold' }}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: '#FF9900',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 10,
        }}
        onPress={handleProceedToConfirmation}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Proceed to Confirmation</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#007bff',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handleAddAddress}>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>Add Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectAddress;
