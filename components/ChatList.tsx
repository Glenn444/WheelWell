import { View, Text, Pressable } from "react-native";
import React from "react";
import {  router } from "expo-router";
import Avatar from "@/components/Avatar";
import { EvilIcons, Feather } from "@expo/vector-icons";
import moment from "moment";

export default function ChatList({ conv }: { conv: any }) {

  const handlePress = () =>{
    router.push(`/${conv?.userDetails?._id}`)
  }
  
  return (
    <View className=" h-16 bg-slate-100 mb-1">
     
      <Pressable  onPress={handlePress} className="w-full ">
        <View className="flex-row p-2">
        <Avatar
          userId={conv?.userDetails?._id}
          imageUrl={conv?.userDetails?.profile_pic}
          name={conv?.userDetails?.name}
        />
        <View className="pl-3">
          <Text className="text-ellipsis line-clamp-1  font-semibold text-base">
            {conv?.userDetails?.name}
          </Text>
          <View className="text-slate-500 text-xs flex items-center gap-1">
            <View className="flex items-center gap-1">
              {conv?.lastMsg?.imageUrl && (
                <View className="flex-row items-center gap-1">
                  <EvilIcons name="image" />
                  {!conv?.lastMsg?.text && <Text>Image {" "}{moment(conv?.lastMsg.createdAt).format("LT")}</Text>}
                </View>
              )}
              {conv?.lastMsg?.videoUrl && (
                <View className="flex-row items-center gap-1">
                  <Feather name="video" />
                  {!conv?.lastMsg?.text && <Text>Video {" "}{moment(conv?.lastMsg.createdAt).format("LT")}</Text>}
                </View>
              )}
            </View>
            <Text className="text-ellipsis line-clamp-1">
              {conv?.lastMsg?.text} {"  "}{moment(conv?.lastMsg.createdAt).format("LT")}
            </Text>
          </View>
        </View>
        {Boolean(conv?.unseenMsg) && (
          <View className=" w-6 h-6  ml-auto bg-primary flex items-center justify-center rounded-full  ">
            <Text className=" text-white font-semibold text-sm">
            {conv?.unseenMsg}
            </Text>
          </View>
        )}
        </View>
      </Pressable>
     
    </View>
  );
}
