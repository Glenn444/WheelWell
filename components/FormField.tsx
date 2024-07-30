import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants";

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  ...props
}: any) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="border-2 border-black-200 w-full h-12 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
        className="flex-1 text-white font-psemibold text-base"
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          value={value}
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' &&
            !showPassword}
          {...props}
        />
        {title === 'Password' &&(
            <TouchableOpacity
              onPress={() => setshowPassword(!showPassword)}
              className="absolute right-4 top-2"
            >
              <Image
                source={!showPassword? icons.eye : icons.eyeHide}
                resizeMode="contain"
                className="w-7 h-7"
              />
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
