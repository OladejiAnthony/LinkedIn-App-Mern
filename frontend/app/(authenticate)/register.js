import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const user = {
      name: name,
      email: email,
      password: password,
      profileImage: image,
    };

    try {
      const response = await axios.post(
        `http://192.168.0.5:3000/register`,
        user
      );
      console.log({ response });

      if (response.status !== 202 && response.status !== 200) {
        throw new Error("Network Error");
      }

      // Display success message
      Alert.alert(
        "Registration successful",
        "Please check your mail for verification."
      );

      // Clear form fields upon successful registration
      setName("");
      setEmail("");
      setPassword("");
      setImage("");
    } catch (error) {
      console.error("registration failed", error);

      // Improved error alert with more details
      Alert.alert(
        "Registration failed",
        `An error occurred while registering: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <ScrollView>
        <View style={{ marginHorizontal: "auto" }}>
          <Image
            style={{ width: 150, height: 100, resizeMode: "contain" }}
            source={{
              uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png",
            }}
          />
        </View>

        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 12,
                color: "#041E42",
              }}
            >
              Register to your Account
            </Text>
          </View>

          <View style={{ marginTop: 50, width: 300 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <Ionicons
                name="person"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: name ? 18 : 18,
                }}
                placeholder="enter your name"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={24}
                color="gray"
              />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: email ? 18 : 18,
                }}
                placeholder="enter your Email"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="gray"
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 18 : 18,
                }}
                placeholder="enter your Password"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <Entypo
                name="image"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                value={image}
                onChangeText={(text) => setImage(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: image ? 18 : 18,
                }}
                placeholder="enter your image url"
              />
            </View>

            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Keep me logged in</Text>

              <Text style={{ color: "#007FFF", fontWeight: "500" }}>
                Forgot Password
              </Text>
            </View>

            <View style={{ marginTop: 80 }} />

            <TouchableOpacity
              onPress={handleRegister}
              style={{
                width: 200,
                backgroundColor: "#0072b1",
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
                Register
              </Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => router.replace("/login")}
              style={{ marginTop: 15, marginBottom: 50 }}
            >
              <Text
                style={{ textAlign: "center", color: "gray", fontSize: 16 }}
              >
                Already have an account? Sign up
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({});
