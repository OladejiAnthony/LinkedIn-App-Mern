import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ConnectionRequest from "../../../components/ConnectionRequest";
import UserProfile from "../../../components/UserProfile";



const index = () => {
  const [userId, setUserId] = useState(""); //userId
  const [user, setUser] = useState(); //user profile
  const [users, setUsers] = useState([]); //other users profile
  const router = useRouter();
  const [connectionRequests, setConnectionRequests] = useState([]);

  //fetch token and save as userId
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);
  console.log({ userId });

  //fetch my profile
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.5:3000/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("error fetching user profile", error);
    }
  };
  console.log({ user });

  //fetch users
  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);
  const fetchUsers = async () => {
    axios
      .get(`http://192.168.0.5:3000/users/${userId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log({ users });

  //fetch all friend requests
  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    }
  }, [userId]);
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.5:3000/connection-request/${userId}`
      );
      if (response.status === 200) {
        const connectionRequestsData = response.data?.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.profileImage,
        }));

        setConnectionRequests(connectionRequestsData);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  console.log({ connectionRequests });



   const renderHeader = () => (
    <>
      <TouchableOpacity
        onPress={() => router.push("/network/connections")}
        style={styles.headerContainer}
      >
        <Text style={styles.headerText}>Manage My Network</Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </TouchableOpacity>

      <View style={styles.separator} />

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Invitations (0)</Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </View>

      <View style={styles.separator} />

      {connectionRequests?.map((item, index) => (
        <ConnectionRequest
          item={item}
          key={index}
          connectionRequests={connectionRequests}
          setConnectionRequests={setConnectionRequests}
          userId={userId}
        />
      ))}

      <View style={styles.premiumContainer}>
        <View style={styles.premiumHeader}>
          <Text>Grow your network faster</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>
        <Text>
          Find and contact the right people. Plus see who's viewed your profile
        </Text>
        <View style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>Try Premium</Text>
        </View>
      </View>
    </>
  );

  return (
    <FlatList
      data={users}
      ListHeaderComponent={renderHeader}
      columnWrapperStyle={styles.columnWrapper}
      numColumns={2}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <UserProfile userId={userId} item={item} />}
    />
  );
};


export default index;

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    borderColor: "#E0E0E0",
    borderWidth: 2,
    marginVertical: 10,
  },
  premiumContainer: {
    marginHorizontal: 15,
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  premiumButton: {
    backgroundColor: "#FFC72C",
    width: 140,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    marginTop: 8,
  },
  premiumButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

