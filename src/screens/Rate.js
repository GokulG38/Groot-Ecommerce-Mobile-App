import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Rate = ({ route }) => {
  const navigation = useNavigation()
  const { item } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const userId = useSelector(state => state.user.id); 

  useEffect(() => {
    const fetchExistingReview = async () => {
      const token = await AsyncStorage.getItem('authToken')

      try {
        const response = await axios.get(`http://192.168.1.4:8000/reviews/${item._id}/${userId}`,{headers: {
          Authorization: token ? `Bearer ${token}` : null
        }});
        setExistingReview(response.data);
        if (response.data) {
          setRating(response.data.rating);
          setComment(response.data.comment);
        }
      } catch (error) {
        console.error('Error fetching existing review:', error.message);
      }
    };

    fetchExistingReview();
  }, []);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')

      if (existingReview) {

        await axios.post('http://192.168.1.4:8000/reviews', {
          product: item._id,
          user: userId,
          rating: rating,
          comment: comment
        },{headers: {
          Authorization: token ? `Bearer ${token}` : null
        }});
        console.log('Review updated successfully');
        navigation.goBack();
      } else {

        await axios.post('http://192.168.1.4:8000/reviews', {
          product: item._id,
          user: userId,
          rating: rating,
          comment: comment
        },{headers: {
          Authorization: token ? `Bearer ${token}` : null
        }});
        console.log('Review submitted successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error submitting review:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Rate</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity key={value} onPress={() => handleRating(value)}>
            <Text style={{ fontSize: 30, marginRight: 10, color: value <= rating ? 'gold' : 'black' }}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={{ width: '80%', height: 100, borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 20 }}
        placeholder="Add your review comment"
        onChangeText={(text) => setComment(text)}
        value={comment}
        multiline
      />
      <TouchableOpacity style={{ backgroundColor: 'blue', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }} onPress={handleSubmit}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Rate;
