
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddAddress = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const userId = useSelector(state => state.user.id);
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params || {};

  useEffect(() => {
    if (address) {
      setStreet(address.street);
      setCity(address.city);
      setState(address.state);
      setZipCode(address.zipCode);
      setNumber(address.number);
      
    }
  }, [address]);

  const handleAddAddress = async () => {
    try {
      if (!street || !city || !state || !zipCode || !number) {
        setError('All address fields are required');
        return;
      }

      const requestData = {
        street,
        city,
        state,
        zipCode,
        number,
        userId
      };
      const token = await AsyncStorage.getItem('authToken')

      if (address) {
 
        requestData.addressId = address._id;
        await axios.put("http://192.168.1.4:8000/address/edit", requestData,{headers: {
          Authorization: `Bearer ${token}` 
      }});
      } else {
        
        await axios.post("http://192.168.1.4:8000/address/add", requestData,{headers: {
          Authorization: `Bearer ${token}` 
      }});
      }

      Alert.alert('Success', 'Address saved successfully');

      
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setNumber('');
      setError('');

 
      navigation.navigate("Cart", { refreshCart: true })
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
      setError('Failed to save address. Please try again.');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {address ? 'Edit Address' : 'Add Address'}
      </Text>
      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
      <TextInput
        style={{
          height: 40,
          width: '100%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        placeholder="Street Address"
        value={street}
        onChangeText={setStreet}
      />
      <TextInput
        style={{
          height: 40,
          width: '100%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={{
          height: 40,
          width: '100%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        placeholder="State"
        value={state}
        onChangeText={setState}
      />
      <TextInput
        style={{
          height: 40,
          width: '100%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        placeholder="Zip Code"
        value={zipCode}
        onChangeText={setZipCode}
        keyboardType="numeric"
      />
      <TextInput
  style={{
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  }}
  placeholder="PhoneNumber"
  defaultValue={number}
  onChangeText={setNumber} 
  keyboardType="numeric"
/>

      <TouchableOpacity
        onPress={handleAddAddress}
        style={{
          marginTop: 20,
          backgroundColor: '#FF9900',
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 20,
        }}>
        <Text style={{
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: 'bold',
        }}>{address ? 'Edit Address' : 'Add Address'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddAddress;
