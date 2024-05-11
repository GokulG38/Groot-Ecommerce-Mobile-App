import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductInfo = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const userId = useSelector(state => state.user.id); 

    const [details, setDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const response = await axios.get(`http://192.168.1.4:8000/products/${route?.params?.id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : null
                    }
                });
                setDetails(response.data);
            } catch (error) {
                console.log("Error message:", error);
            }
        }
        fetchData();

    }, [route.params]);

    const handleAddToCart = () => {
        dispatch(addToCart(details));
        Alert.alert('Add to Cart', 'Product added to cart successfully!');
    };

    const addToWishlist = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.post('http://192.168.1.4:8000/wishlist/add', {
                userId: userId, 
                productId: route.params.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Alert.alert('Add to Wishlist', 'Product added to wishlist successfully!');
            navigation.replace('Main')
        } catch (error) {
            console.log("Error message:", error);
            Alert.alert('Error', 'Failed to add product to wishlist.');
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    const navigateToReviewList = () => {
        console.log(route.params.id)
        navigation.navigate('ReviewList', { productId: route.params.id });
    };

    return (
        <View style={{ flex: 1, backgroundColor:'#FFFFFF' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                <Pressable onPress={goBack} style={{ padding: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>Go Back</Text>
                </Pressable>
            </View>
            <ScrollView
                style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                {details?.image && (
                    <View style={{ borderTopWidth: 1, borderTopColor: '#CCCCCC', borderBottomWidth: 1, borderBottomColor: '#CCCCCC', backgroundColor: '#FFFFFF', marginBottom: 20, alignItems:"center" }}>
                        <Image source={{ uri: details.image }} style={{ width: 250, height: 250, resizeMode: 'contain', backgroundColor: '#FFFFFF' }} />
                    </View>
                )}
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'left', color: '#000000' }}>{details?.name}</Text>
                    <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'left', color: '#000000' }}>{details?.description}</Text>
                    <Pressable onPress={handleAddToCart} style={{ backgroundColor: '#FF9900', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginBottom: 10, width: '100%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>Add to Cart</Text>
                    </Pressable>
                    <Pressable onPress={addToWishlist} style={{ backgroundColor: '#FF0033', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>Add to Wishlist</Text>
                    </Pressable>
                    <Pressable onPress={navigateToReviewList} style={{ backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, width: '100%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>Read Reviews</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProductInfo;
