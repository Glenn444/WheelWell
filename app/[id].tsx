import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  FlatList,
  Pressable,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { images, icons } from "@/constants";
import { Ionicons, Feather, AntDesign, EvilIcons } from "@expo/vector-icons";
import {uploadFile} from "@/lib/uploadFile";
import {  Redirect, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useStore } from "@/store/store";
import Messages from "@/components/Messages";
import ChatHeader from "@/components/ChatHeader";
import VideoCard from "@/components/VideoCard";

const MessagePage = () => {
  const params = useLocalSearchParams();
  const socketConnection = useStore((state) => state?.socketConnection);
  const data = useStore((state) => state?.currentUserChatId);
  const user = useStore((state) => state?.user);
  const isLoggedIn  = useStore((state)=> state.isLoggedIn);
  if (!isLoggedIn) return <Redirect href="/sign-in"/>
  const [dataUser, setDataUser] = useState({
    name: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [text, setText] = useState("");
 // const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tempimageUrl, setTempImageUrl] = useState("");
  const [base64Url, setbase64Url] = useState('');
  const [base64UrlVid, setbase64UrlVid] = useState('');
  let message = {
    text: text,
  };
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState<any[]>([]);
  const currentMessage: any = useRef(null);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const handleUploadImage = async () => {
    try {
      let result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 0.5,
        base64: true
      });
      if (!result.canceled) {
        
        const file = result.assets[0].uri;
        setTempImageUrl(file);
         let base64Img = `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`
        setbase64Url(base64Img);
         setOpenImageVideoUpload(false);

      }
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setOpenImageVideoUpload(false);
      setVideoUrl("");
      setLoading(false);
    }
  };
  const handleClearUploadImage = () => {
    setTempImageUrl("");
    setbase64Url("");
  };

  const handleUploadVideo = async () => {
    try {
      let result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      const file = result.assets[0].uri;
      setVideoUrl(file);
     
      let base64Vid = `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`
     setbase64UrlVid(base64Vid);
      setOpenImageVideoUpload(false);

      // setLoading(true);
      // const uploadVideo = await uploadFile(file);
      // setLoading(false);
      // setOpenImageVideoUpload(false);

      // setVideoUrl(uploadVideo.url);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  const handleClearUploadVideo = () => {
    setVideoUrl("");
    setbase64UrlVid("");
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.id);

      socketConnection.emit("seen", params.id);

      socketConnection.on("message-user", (data: any) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data: any) => {
        // console.log('message data',data)
        setAllMessage(data);
      });
    }
  }, [socketConnection, params.id, user]);

  const handleSendMessage = async () => {
    //console.log(socketConnection);
    try {
      let uploadPhoto;
      let uploadvideoUrl;
      if (base64Url){
      setLoading(true);
      uploadPhoto = await uploadFile(base64Url);
      setLoading(false);
      }if (base64UrlVid){
        setLoading(true);
        uploadvideoUrl = await uploadFile(base64UrlVid);
        setLoading(false);
      }
      if (message.text || uploadPhoto?.public_id || uploadvideoUrl?.public_id) {
        if (socketConnection) {
          socketConnection.emit("new message", {
            sender: data,
            receiver: params.id,
            text: message.text,
            imageUrl: uploadPhoto?.public_id,
            videoUrl: uploadvideoUrl?.public_id,
            msgByUserId: data,
          });
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
      setText("");
      setVideoUrl("");
      setTempImageUrl("");
      setbase64Url("");
      setbase64UrlVid("");
    }
  };

  return (
    <ImageBackground
      className="flex-1 justify-center"
      source={images.backgroundImage}
      resizeMode="cover"
    >
      <ChatHeader dataUser={dataUser} />
      <FlatList
        ref={currentMessage}
        data={allMessage}
        onContentSizeChange={() =>
          currentMessage?.current?.scrollToEnd({ animated: true })
        }
        keyExtractor={(item) => item._id}
        renderItem={({ item }: any) => <Messages msg={item} />}
      />

      {/***show all message */}
      <View>
        {/**upload Image display */}
        {tempimageUrl && (
          <View className="w-80 h-80 sticky bottom-2 left-12 bg-slate-700">
            <Pressable className="" onPress={handleClearUploadImage}>
              <View className="flex-row items-center">
                <AntDesign name="close" color="red" size={30} />
                <Text className="text-white text-xs">Cancel</Text>
              </View>
            </Pressable>
            <View className="flex justify-center items-center bg-slate-700 p-3">
              <Image
                source={{ uri: tempimageUrl }}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </View>
          </View>
        )}

        {videoUrl && (
          <View className=" sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <Pressable
              className="w-fit p-2 absolute top-0 right-0 "
              onPress={handleClearUploadVideo}
            >
              <View className="flex-row flex items-center">
              <Text className="text-red-500 font-pmedium">Cancel</Text>
              <AntDesign name="close" color='red' size={30} />
              </View>
            </Pressable>
            <View className="p-3 w-3/4">
              <VideoCard videoUrl={`${videoUrl}`} />
            </View>
          </View>
        )}

        {loading && (
          <ActivityIndicator
            size="large"
            className="flex justify-center items-center"
          />
        )}
      </View>

      {/**send message */}
      <View className="relative h-16 bg-white flex-row  items-center justify-between px-6 mb-[0.5]">
        <View className="absolute left-3 top-1">
          <Pressable
            onPress={handleUploadImageVideoOpen}
            className="flex items-center w-11 h-11 rounded-full bg-primary"
          >
            <Image height={20} width={20} source={icons.plus} />
          </Pressable>

          {/**video and image */}
          {openImageVideoUpload && (
            <View className="bg-white shadow rounded-lg absolute  bottom-12 w-36 p-2">
              <Pressable
                className="flex-row items-start p-2 px-3 gap-3"
                onPress={handleUploadImage}
              >
                <View className="">
                  <EvilIcons name="image" size={20} color="blue" />
                </View>
                <Text className="text-lg text-blue-800">Image</Text>
              </Pressable>
              <Pressable
                className="flex-row items-center p-2 px-3 gap-3"
                onPress={handleUploadVideo}
              >
                <View className="justify-center">
                  <Feather name="video" color="blue" size={20} />
                </View>
                <Text className="text-lg text-blue-800">Video</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/**input box */}
        <View className="pl-8">
          <TextInput
            placeholder="Type message here..."
            className="py-1 px-6 h-full outline-none text-xl"
            value={text}
            onChangeText={setText}
          />
        </View>
        <Pressable onPress={handleSendMessage}>
          <Ionicons color="#2881e4" name="send-sharp" size={30} />
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default MessagePage;
