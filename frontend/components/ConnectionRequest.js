import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";


const ConnectionRequest = ({
  item,
  connectionRequests,
  setConnectionRequests,
  userId,
}) => {

  //Accept Connection Request
  const acceptConnection = async (requestId) => {
    try {
      const response = await fetch(
        "http://192.168.0.5:3000/connection-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: requestId,
            recepientId: userId,
          }),
        }
      );

      if (response.ok) {
        setConnectionRequests(
          connectionRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  return (
    <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{ uri: item?.image }}
        />

        <Text style={{ width: 175 }}>
          {item?.name} is Inviting you to Connect
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="x" size={22} color="black" />
          </View>

          <TouchableOpacity
            onPress={() => acceptConnection(item._id)}
            style={{
              width: 26,
              height: 26,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConnectionRequest;

const styles = StyleSheet.create({});
