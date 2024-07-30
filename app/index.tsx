import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import {  Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import CustomButton from "@/components/CustomButton";
import {StatusBar} from 'expo-status-bar'
import { useHydration, useStore } from "@/store/store";


const App = () => {
  const hydrated = useHydration();
  const isLoggedIn  = useStore((state)=> state.isLoggedIn);
 



  if (hydrated && isLoggedIn) return <Redirect href="/home"/>
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="absolute" contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            style={{ width: 200, height: 200 }}
           />
           <Image 
            source={images.cards}
           />
          <View className="relative mt-5">
              <Text className="text-3xl text-white font-bold text-center">Find nearby Mechanics</Text>
            
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Having car troubles? Find a specialised mechanic near you ready to fix your vehicle Now.
          </Text>
          <CustomButton
          title="Continue with Email"
          handlePress={() =>  router.push('/sign-in')}
          containerStyles= "w-full mt-7"
           />
           
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
};

export default App;
