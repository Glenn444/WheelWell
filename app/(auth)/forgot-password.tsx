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
  import { ForgotPassword} from "@/lib/appwrite";
  import Toast from 'react-native-root-toast';
  
  const ForgotPasswordPage = () => {
   
    const [form, setForm] = useState({
      email: "",
    });
    const [isSubmiting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async () => {
      if (form.email === "") {
        Toast.show('Please Enter Email',{
          position: 50,
          duration: Toast.durations.SHORT,
          backgroundColor:'red',
          textColor: 'white',
         
        })
        return;
      }
  
      setIsSubmitting(true);
      try {
             await ForgotPassword(form.email);
            
            Toast.show('Link Sent to your Email from Appwrite',{
              position: 50,
              duration: Toast.durations.LONG,
              backgroundColor:'grey',
              textColor: 'white',
             
            });
            router.push("/sign-in");
          
      
      } catch (error: any) {
        Toast.show(`Error: ${error.message}`,{
          position: 50,
          duration: Toast.durations.SHORT,
          backgroundColor:'red',
          textColor: 'white',
         
        })
      } finally {
        setIsSubmitting(false);
        setForm({ ...form, email: '' })
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
              Reset Password
            </Text>
  
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: any) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
     
  
            <CustomButton
              title="Reset Password"
              handlePress={handleSubmit}
              containerStyles="mt-7"
              isLoading={isSubmiting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Remembered Password?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-secondary-100"
              >
                Sign In
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default ForgotPasswordPage;
  