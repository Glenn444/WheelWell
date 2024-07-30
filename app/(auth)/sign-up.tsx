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
import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { createUser } from "@/lib/appwrite";
import { useStore } from "@/store/store";
import { createChatUser } from "@/lib/chatFunc";
import Toast from 'react-native-root-toast';

const data = [
  { label: "MOTORIST", value: "MOTORIST" },
  { label: "MECHANIC", value: "MECHANIC" },
];
export interface userinfo {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
}
const SignUp = () => {
  const setUser = useStore((state) => state.setUser);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const currentUser = useStore((state) => state.user);
  const setToken = useStore((state) => state.setToken);
  const setCurrentUserId = useStore((state) => state.setCurrentUserChatId);
  const [value, setValue] = useState("");
  const [submiting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const handleSubmit = async () => {
    if (
      form.email === "" ||
      form.name === "" ||
      form.phone === "" ||
      form.role === ""
    ) {
      Toast.show('Please Fill in all fields',{
        position: 50,
        duration: Toast.durations.SHORT,
        backgroundColor:'red',
        textColor: 'white',
       
      })
      return;
    }

    setIsSubmitting(true);
    try {
      //let user;
     // let response;

      if (!currentUser.$collectionId) {
      const user = await createUser(
          form.email,
          form.password,
          form.name,
          form.phone,
          form.role
        );
        
        setUser(user);
      const  response = await createChatUser(
          user?.username,
          user?.avatar,
          user?.$id ?? ""
        );
        
        
        setCurrentUserId(response.data.id);
        setToken(response.data.token);
        setIsLoggedIn(true);
        router.replace("/home");
      }

    } catch (error: any) {
      Toast.show(`Error: ${error.message}`,{
        position: 50,
        duration: Toast.durations.LONG,
        backgroundColor:'red',
        textColor: 'white',
       
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="#2881e4"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
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
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white  mt-10 font-psemibold">
            Sign Up to WheelWell
          </Text>
          <FormField
            title="Full Name"
            value={form.name}
            handleChangeText={(e: any) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Phone Number"
            value={form.phone}
            handleChangeText={(e: any) => setForm({ ...form, phone: e })}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
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
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select a role"
            value={value}
            onChange={(item) => {
              setValue(item.value);
              setForm({ ...form, role: item.value });
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color="#4b9cec"
                name="Safety"
                size={20}
              />
            )}
            renderItem={renderItem}
          />
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={submiting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
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

export default SignUp;

const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
    marginTop: 16,
    height: 50,
    backgroundColor: "#1E1E2D",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#1E1E2D",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E2D",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },
  placeholderStyle: {
    color: "white",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "white",
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
