import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useRouter } from "expo-router";

//console.log("jwt: ",jwt_decode)

const index = () => {
  const [userId, setUserId] = useState(""); //userId
  const [user, setUser] = useState(); //user profile
  const [posts, setPosts] = useState([]);
  const [showfullText, setShowfullText] = useState(false);
  const [isLiked, setIsLiked] = useState(false);



  const router = useRouter();

  //fetch token and save as userId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Error fetching token", error);
      }
    };

    fetchUser();
  }, []);
  //console.log({userId});

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
      //console.log("PROFILR:", response.data)
      const userData = response.data.user;
      //console.log({userData})
      setUser(userData);
      
    } catch (error) {
      console.error("error fetching user profile", error);
    }
  };
  //console.log({ user });


  //fetch All Posts
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get("http://192.168.0.5:3000/all");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("error fetching posts", error);
      }
    };
    fetchAllPosts();
  }, []);
  //console.log({ posts });


  //post description
  const MAX_LINES = 2;
  const toggleShowFullText = () => {
    setShowfullText(!showfullText);
  };

  //like post function
  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://192.168.0.5:3000/like/${postId}/${userId}`
      );
      if (response.status === 200) {
        const updatedPost = response.data.post;

        setIsLiked(updatedPost.likes.some((like) => like.user === userId));
      }
    } catch (error) {
      console.log("Error liking/unliking the post", error);
    }
  };
  

  return (
    <ScrollView>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Pressable onPress={() => router.push("/home/profile")}>
          <Image
            style={{ width: 30, height: 30, borderRadius: 15 }}
            source={{ uri: user?.profileImage }}
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 30,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput placeholder="Search" />
        </Pressable>

        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>

      {/*Posts lists */}
      <View>
        {posts?.map((item, index) => (
          <View key={index}>
            {/*A Post */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
              }}
              key={index}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Image
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                  source={{ uri: item?.user?.profileImage }}
                />

                <View style={{ flexDirection: "column", gap: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    {item?.user?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      width: 200,
                      color: "gray",
                      fontSize: 13,
                      fontWeight: "400",
                    }}
                  >
                    Engineer Graduate | LinkedIn Member
                  </Text>
                  <Text style={{ color: "gray" }}>
                    {moment(item.createdAt).format("MMMM Do YYYY")}
                  </Text>
                </View>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Entypo name="dots-three-vertical" size={20} color="black" />

                <Feather name="x" size={20} color="black" />
              </View>
            </View>

            <View
              style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}
            >
              <Text
                style={{ fontSize: 15 }}
                numberOfLines={showfullText ? undefined : MAX_LINES}
              >
                {item?.description}
              </Text>

              {!showfullText && (
                <Pressable onPress={toggleShowFullText}>
                  <Text>See more</Text>
                </Pressable>
              )}
            </View>

            <Image
              style={{ width: "100%", height: 240 }}
              source={{ uri: item?.imageUrl }}
            />

            {item?.likes?.length > 0 && (
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <SimpleLineIcons name="like" size={16} color="#0072b1" />
                <Text style={{ color: "gray" }}>{item?.likes?.length}</Text>
              </View>
            )}

            <View
              style={{
                height: 2,
                borderColor: "#E0E0E0",
                borderWidth: 2,
              }}
            />
            {/*Buttons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <TouchableOpacity onPress={() => handleLikePost(item?._id)}>
                <AntDesign
                  style={{ textAlign: "center" }}
                  name="like2"
                  size={24}
                  color={isLiked ? "#0072b1" : "gray"}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: isLiked ? "#0072b1" : "gray",
                    marginTop: 2,
                  }}
                >
                  Like
                </Text>
              </TouchableOpacity>

              <Pressable>
                <FontAwesome
                  name="comment-o"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 2,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  Comment
                </Text>
              </Pressable>

              <Pressable>
                <Ionicons
                  name="share-outline"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    textAlign: "center",
                    color: "gray",
                  }}
                >
                  repost
                </Text>
              </Pressable>

              <Pressable>
                <Feather name="send" size={20} color="gray" />
                <Text style={{ marginTop: 2, fontSize: 12, color: "gray" }}>
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});



