import { Entypo } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Avatar from "./Avatar";

type dataUser = {
  name: string;
  profile_pic: string;
  online: boolean;
  _id: string;
};

export default function ChatHeader({ dataUser }: { dataUser: dataUser }) {
 
  
  return (
    <Stack.Screen
    
      options={{
        headerStyle:{
          
        },
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={38} color="737373" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-4 mb-4">
              <View>
              <Avatar
                imageUrl={dataUser?.profile_pic}
                name={dataUser?.name}
                userId={dataUser?._id}
              />
              </View>
              <View className="items-center">
                <Text className="font-semibold text-xl my-0 text-ellipsis line-clamp-1">
                  {dataUser?.name}
                </Text>
                <Text className="-my-2 text-sm">
                  {dataUser.online ? (
                    <Text className="text-primary">online</Text>
                  ) : (
                    <Text className="text-slate-400">offline</Text>
                  )}
                </Text>
              </View>
            </View>
          </View>
        ),
      }}
    />
  );
}
