import { useStore } from "@/store/store";
import React from "react";
import { Image, View } from "react-native";

const Avatar = ({
  userId,
  name,
  imageUrl,
}: {
  userId: string;
  name: string;
  imageUrl: string;
}) => {
  
  
  
  const onlineUser: any = useStore((state) => state?.onlineUser);

  const isOnline = onlineUser.includes(userId);
  
  return (
    <View className={`text-slate-800  rounded-full font-bold relative`}>
      {
        <View className="w-[52px] h-[52px]  rounded-lg">
        <Image
         src={imageUrl}
          className="w-full h-full rounded-lg"
          resizeMode="cover"
          alt={name}
        />
        </View>
      }

      {isOnline && (
        <View className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></View>
      )}
    </View>
  );
};

export default Avatar;
