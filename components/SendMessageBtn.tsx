import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from '@expo/vector-icons';
const MessageButton = ({
  handlePress,
  containerStyles,
  isLoading,
}: any) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`align-middle  ${containerStyles}
      ${isLoading? "opacity-50" : ''}`}
      disabled={isLoading}
      
    >
      <AntDesign  name="message1" size={28} color="#2881e4" />
     
    </TouchableOpacity>
  );
};

export default MessageButton;
