import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogOutUser, updateUserImage } from "@/lib/appwrite";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store/store";
import * as DocumentPicker from "expo-document-picker";
import { icons } from "@/constants";
import {  UserDefault } from "@/types/store";

const Profile = () => {
  const { user, setUser, setIsLoggedIn, setOnlineUser, setSocketConnection,setToken,setCurrentUserId } = useStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
      setIsLoggedIn: state.setIsLoggedIn,
      setToken: state.setToken,
      setOnlineUser: state.setOnlineUser,
      setSocketConnection: state.setSocketConnection,
      setCurrentUserId : state.setCurrentUserChatId
    }))
  );
 
  const [uploading, setUploading] = useState(false);
  const [islogging, setIsLogout] = useState(false);
  const [form, setForm] = useState<any>({
    thumbnail: null,
  });
  const openPicker = async (selectType:any) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result?.assets[0],
        });
      }

    }
  };

  const submit = async () => {
    if (!form.thumbnail) {
      Alert.alert("Choose an Image")

      return;
    }

    setUploading(true);
    try {
      const updatedUser =  await updateUserImage(form.thumbnail, "image");
      setUser(updatedUser);
      Alert.alert("Uploaded Successfuly")

    } catch (error:any) {
      Alert.alert(`${error.message}`)
    } finally {
      setForm({
        thumbnail: null,
      });

      setUploading(false);
    }
  };
  const handlelogout = async () => {
    try {
      setIsLogout(true);
      await LogOutUser();
      setIsLogout(false);
      setUser(UserDefault);
      setIsLoggedIn(false);
      setToken('');
      setCurrentUserId('');
      setOnlineUser([]);
      setSocketConnection(null);
     
  
      router.replace("/sign-in");
      
    } catch (error:any) {
      Alert.alert("Error", error.message);
    }

  };
  return (
    <SafeAreaView className="bg-primary h-full relative">
      <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Update Profile Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <CustomButton
          title="Update Photo"
          handlePress={submit}
          containerStyles="mt-7 w-1/2 mx-auto"
          isLoading={uploading}
        />
      <CustomButton
      
        title="Log Out"
        handlePress={handlelogout}
        containerStyles="mt-7 absolute bottom-1 w-full "
        isLoading={islogging}
      />
    </SafeAreaView>
  );
};

export default Profile;
