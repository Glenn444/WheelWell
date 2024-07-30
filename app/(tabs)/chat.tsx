import { View, Text, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useStore } from "@/store/store";
import EmptyState from "@/components/EmptyState";
import { StatusBar } from "expo-status-bar";
import ChatList from "@/components/ChatList";


function chat() {
  const user = useStore((state) => state?.user);
  const [allUser, setAllUser] = useState([]);
  const socketConnection = useStore((state) => state?.socketConnection);
  const userId = useStore((state) => state?.currentUserChatId);


 
  useEffect(() => {
    
    if (socketConnection) {
      socketConnection.emit("sidebar", userId);

      socketConnection.on("conversation", (data: any) => {
        //console.log('conversation',data)

        const conversationUserData = data.map((conversationUser: any) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== userId) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  return (
    <SafeAreaView className="bg-primary h-full">
  
        <FlatList
          data={allUser}
          keyExtractor={(item:any) => item.userDetails._id}
          renderItem={({ item }: any) => <ChatList conv={item} />}
         
        
          ListEmptyComponent={() => (
            <EmptyState
              title="No Chats Available"
            />
          )}
        
        />

        <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

export default chat;
