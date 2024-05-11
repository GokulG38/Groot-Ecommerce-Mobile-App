
import { SafeAreaView, StyleSheet, Text, View, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Register = () => {
  const Navigation = useNavigation();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !number || !password) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in all fields."
      );
      return;
    }

    const user = {
      name: name,
      number: number,
      password: password,
    };

    try {
      const response = await axios.post(`http://192.168.1.4:8000/signup`, user);
      console.log(response);
      Alert.alert(
        "Registration successful",
        "You have been registered Successfully"
      );
      setName("");
      setNumber("");
      setPassword("");
    } catch (error) {
      Alert.alert(
        "Registration Error",
        "An error occurred while registering"
      );
      console.log("registration failed", error);
      console.log("Axios error:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>

      <KeyboardAvoidingView style={{ flex: 1, alignItems: "center", justifyContent: "center" }} behavior="padding">
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ width: 250, height: 150, marginTop: 50 }}
            source={{
              uri: "https://assets.stickpng.com/thumbs/62b314a6b223544c209f5e6d.png",
            }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Groot SignUp</Text>
        </View>
        <View style={{ marginTop: 40 }}>
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
              placeholder="Enter your name"
              onChangeText={(name) => setName(name)}
              value={name}
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
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
              keyboardType="numeric"
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
              style={{ width: 300, marginVertical: 5, alignItems: "center" }}
              onChangeText={(password) => setPassword(password)}
              value={password}
              secureTextEntry={true}
              placeholder="Enter your password"
            />
          </View>
        </View>
        <View style={{ marginTop: 60 }} />
        <Pressable
          onPress={handleSignup}
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
            SignUp
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Navigation.navigate("Login");
          }}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Already have an account? Login here
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({});
