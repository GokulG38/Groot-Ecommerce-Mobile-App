import React from "react";
import { StyleSheet, Text, View, Pressable, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductItem = ({ item, id, purpose }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    Alert.alert('Add to Cart', 'Product added to cart successfully!');
  };

  const handleRemoveFromWishlist = async () => {
    
    try {
      const authToken = await AsyncStorage.getItem('authToken')

      const response = await axios.delete(
        'http://192.168.1.4:8000/wishlist/remove',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          data: { userId: userId, productId: item._id },
        }
      );
  
      console.log(response.data.message);
      navigation.replace('Main', { screen: 'Profile' });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      Alert.alert('Error', 'Failed to remove product from wishlist. Please try again later.');
    }
  };

  return (
    <Pressable style={{ marginHorizontal: 20, marginVertical: 25 }} onPress={() => navigation.navigate("ProductInfo", { id: item._id })}>
      <Image
        style={{ width: 150, height: 150, resizeMode: "contain" }}
        source={{ uri: item?.image }}
      />
      <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>
        {item?.name}
      </Text>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>₹{item?.price}</Text>
        <Text style={{ color: "#FFC72C", fontWeight: "bold" }}>
          {item?.ratings} rating
        </Text>
      </View>
      {purpose === "product" && (
        <Pressable
          onPress={handleAddToCart}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text>Add to Cart</Text>
        </Pressable>
      )}
      {purpose === "wishlist" && ( 
        <Pressable
          onPress={handleRemoveFromWishlist}
          style={{
            backgroundColor: "#FFC72C",
            padding: 10,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text>Remove</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default ProductItem;