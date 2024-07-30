import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, SignIn } from "@/lib/appwrite";
import { useStore } from "@/store/store";
import { createChatUser } from "@/lib/chatFunc";
import Toast from 'react-native-root-toast';

const Signin = () => {
 
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const setUser = useStore((state) => state.setUser);
  const setCurrentUserId = useStore((state) => state.setCurrentUserChatId);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const currentUser = useStore((state) => state.user);
  const setToken = useStore((state) => state.setToken);
  const [isSubmiting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (form.email === "" || form.password === "") {
      Toast.show('Please Enter Email and Password',{
        position: 50,
        duration: Toast.durations.SHORT,
        backgroundColor:'red',
        textColor: 'white',
       
      })
      return;
    }

    setIsSubmitting(true);
    try {
      
      let loginUser:any;
      let response;
      if (!currentUser.$id) {
        await SignIn(form.email, form.password);
        loginUser = await getCurrentUser();
        setUser(loginUser);
        response = await createChatUser(
          loginUser.username,
          loginUser.avatar,
          loginUser.$id
        );
        setCurrentUserId(response.data.id);
        setToken(response.data.token);
        setIsLoggedIn(true);
        router.replace("/home");
      }
    
    } catch (error: any) {
      Toast.show(`Error: ${error.message}`,{
        position: 50,
        duration: Toast.durations.SHORT,
        backgroundColor:'red',
        textColor: 'white',
       
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView>
        <View
          style={{ minHeight: Dimensions.get("window").height - 100 }}
          className="w-full justify-center h-full px-4 my-6 "
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[150px] h-[35px]"
          />
          <Text className="text-2xl text-white  mt-10 font-psemibold">
            Log in to WheelWell
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmiting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary-100"
            >
              Sign Up
            </Link>
          </View>
          <View className="flex justify-center items-center">
          <Link
              href="/forgot-password"
              className=" text-lg font-psemibold text-secondary-100"
            >
              Forgot Password?
            </Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
