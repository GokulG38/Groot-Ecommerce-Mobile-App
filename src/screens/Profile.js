
import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'; 
import { clearUser } from '../redux/userSlice';
import { cleanCart } from '../redux/cartSlice';
import ProductItem from '../components/ProductItem';

const Profile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userId = useSelector(state => state.user.id);
    const [userName, setUserName] = useState('');
    const [userNumber, setUserNumber] = useState('');
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                const response = await axios.get(`http://192.168.1.4:8000/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    } 
                });
                const userData = response.data;
                setUserName(userData.name); 
                setUserNumber(userData.number);
                if (userData.wishlist.length !== 0) {
                    fetchWishlistProducts(userData.wishlist);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchWishlistProducts = async (wishlistIds) => {
        try {
            const token = await AsyncStorage.getItem('authToken')
            const response = await axios.get('http://192.168.1.4:8000/wishlist/products', {
                params: {
                    ids: wishlistIds
                },headers: {
                    Authorization: token ? `Bearer ${token}` : null
                  }
            });
            const products = response.data;
            setWishlistProducts(products);
        } catch (error) {
            console.error('Error fetching wishlist products:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('authToken');
            dispatch(clearUser());
            dispatch(cleanCart());
            navigation.replace('Login');
        } catch (error) {
            console.error('Error clearing authentication token:', error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserData();
        setRefreshing(false);
    };

    return (
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
            <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>Profile</Text>

                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 16 }}>Name: {userName}</Text> 
                    <Text style={{ fontSize: 16 }}>Number: {userNumber}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                    <Pressable
                        onPress={() => {navigation.navigate('OrderList')}}
                        style={{ padding: 10, backgroundColor: '#E0E0E0', borderRadius: 10, width: 150, alignItems: 'center' }}
                    >
                        <Text>My Orders</Text>
                    </Pressable>
                    <Pressable
                        onPress={handleLogout}
                        style={{ padding: 10, backgroundColor: '#FFA000', borderRadius: 10, width: 100, alignItems: 'center' }}
                    >
                        <Text style={{ color: 'white' }}>Logout</Text>
                    </Pressable>
                </View>
            </View>

            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>My Wishlist</Text>

            <View style={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
                {wishlistProducts?.map((item, index) => (
                    <ProductItem item={item} key={index} id={item._id} purpose="wishlist"/>
                ))}
                {wishlistProducts.length === 0 && (
                    <Text>Wishlist is empty</Text>
                )}
            </View>
        </ScrollView>
    );
};

export default Profile;
