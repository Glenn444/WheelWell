import {
  View,
  Text,
  Image
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useStore } from "@/store/store";
import { MessageType } from "@/types/store";
import { cld } from "@/lib/cloudinary";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
import VideoCard from "./VideoCard";
const Messages = ({ msg }: { msg: MessageType }) => {
 
  const msgImage = cld.image(msg.imageUrl)

 const src =  msgImage
  .resize(thumbnail().width(280).height(280))
  .roundCorners(byRadius(10))
  .toURL();

  
  const myVideo = cld.video(msg.videoUrl);
 const vidUrl =  myVideo.resize(scale().width(800)).toURL();

  const userId = useStore((state) => state.currentUserChatId);

  return (
    <View className="flex flex-col gap-2 py-2 mx-2">
      <View
        className={` p-1 py-1   w-[180px] max-w-[290px]  ${
          userId === msg?.msgByUserId ? "  ml-auto bg-teal-100 w-full" : "bg-white w-full"
        }`}
      >
        <View className="w-full relative">
          {msg?.imageUrl !== '' && (
            <Image source={{uri: src}} className="w-full h-[280px]"/>
           // <AdvancedImage cldImg={msgImage} />
          )}
          {msg?.videoUrl !== '' && (
            <VideoCard videoUrl={vidUrl} />
          //   <AdvancedVideo
          //   cldVid={myVideo}
          //   style={{width: 280, height: 280}}
          // />
        
          )}
        </View>
     
        <Text className="px-2 text-lg">{msg.text}</Text>
        <Text className="text-sm ml-auto w-fit">
          {moment(msg?.createdAt).format("LT")}
        </Text>
      
      </View>
    </View>
  );
};

export default Messages;
