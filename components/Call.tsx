import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from '@expo/vector-icons';

const CallButton = ({
  handlePress,
  containerStyles,
  isLoading,
}: any) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={` ${containerStyles}
      ${isLoading? "opacity-50" : ''}`}
      disabled={isLoading}
      
    >
    <Feather name="phone-call" size={28} color="#2881e4" />
    </TouchableOpacity>
  );
};

export default CallButton;
