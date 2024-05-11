import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewList = ({ route}) => {
    const [reviews, setReviews] = useState([]);
    const productId = route.params.productId
    

    useEffect(() => {
        const fetchReviews = async () => {
        
            try {
                const token = await AsyncStorage.getItem('authToken')

                const response = await axios.get(`http://192.168.1.4:8000/reviews/${productId}`,{headers: {
                    Authorization: token ? `Bearer ${token}` : null
                  }});
                setReviews(response.data);
            } catch (error) {
                console.log("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [productId]);

    return (
        <ScrollView style={{ borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8, padding: 10, marginVertical: 10, maxHeight: 200 }}>
            <View style={{ marginBottom: 10 }}>
                {reviews.map((review, index) => (
                    <View key={index} style={{ borderBottomWidth: 1, borderBottomColor: '#CCCCCC', paddingBottom: 10, marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>Rating: {review.rating}</Text>
                        <Text style={{ fontSize: 16 }}>{review.comment}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default ReviewList;
