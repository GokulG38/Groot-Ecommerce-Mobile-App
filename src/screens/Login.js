

import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert, ScrollView } from "react-native";
import React, {useState, useEffect, useRef} from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const Login = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const Navigation = useNavigation();
  const dispatch = useDispatch(); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          Navigation.replace("Main");
        }
      } 
      catch (err) {
      }
    };
    checkLoginStatus();
  }, []);
  
  const handleLogin = () => {
    if (!number || !password) {
      Alert.alert("Incomplete Form", "Please fill in all fields.");
      return;
    }

    const user = {
      number: number,
      password: password,
    };

    axios
      .post(`http://192.168.1.4:8000/login`, user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        Navigation.replace("Main");
        dispatch(setUser(response.data.id));
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid Number or Password");
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <KeyboardAvoidingView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View>
          <Image
            style={{ width: 250, height: 150, marginTop: 60 }}
            source={{
              uri: "https://assets.stickpng.com/thumbs/62b314a6b223544c209f5e6d.png",
            }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Groot LogIn</Text>
        </View>
        <View style={{ marginTop: 100 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingHorizontal: 5,
              borderRadius: 5,
              alignItems: "center",
            }}
          >
            <TextInput
              style={{
                width: 300,
                marginVertical: 5,
                paddingLeft: 5,
              }}
              placeholder="Enter your phone number"
              onChangeText={(number) => setNumber(number)}
              value={number}
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              backgroundColor: "#D0D0D0",
              borderRadius: 5,
              alignItems: "center",
              paddingHorizontal: 5,
            }}
          >
            <TextInput
              style={{ width: 300, marginVertical: 5,  alignItems: "center" }}
              onChangeText={(password) => setPassword(password)}
              value={password}
              secureTextEntry={true}
              placeholder="Enter your password"
            />
          </View>
        </View>
        <View style={{ marginTop: 80 }} />
        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {Navigation.navigate("Register")}}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
