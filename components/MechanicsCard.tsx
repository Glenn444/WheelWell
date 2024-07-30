import { View, Text, Image, Button } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import haversine from "haversine-distance";
import { UserType } from "@/types/store";
import { Link, router } from "expo-router";
import MessageButton from "./SendMessageBtn";
import { fetchUserId } from "@/lib/chatFunc";
import useLocation from "@/lib/location";
import CallButton from "./Call";
import { Linking, Platform } from "react-native";
import Toast from 'react-native-root-toast';

const MechanicCard = ({ mechanic }: { mechanic: UserType }) => {
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState("");
  const { location }: { location: any } = useLocation();
  const fetchMechanicId = async (mechanic: UserType) => {
    try {
      const data = await fetchUserId(mechanic.$id);
      setUserId(data);
    } catch (error: any) {
      Toast.show(`Error: ${error.message}`,{
        position: 50,
        duration: Toast.durations.SHORT,
        backgroundColor:'red',
        textColor: 'white',
       
      })
    }
  };
  useEffect(() => {
    fetchMechanicId(mechanic);
  }, [mechanic.$id]);

  const handleMessage = async () => {

      router.push(`/${userId}`);
    
  };
  const onCallMobilePhone = async (phoneNumber: string) => {
    if (Platform.OS === "android") {
      Linking.openURL(`tel:${phoneNumber}`);
      return;
    }

    if (Platform.OS === "ios") {
      Linking.openURL(`telprompt:${phoneNumber}`);
      return;
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-10">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[66px] h-[66px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: mechanic.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-lg"
              numberOfLines={1}
            >
              {mechanic.username}
            </Text>
            <Text className="text-white font-pmedium text-sm" numberOfLines={1}>
              {mechanic.phone}
            </Text>
            <Text className="text-white font-pmedium text-xs" numberOfLines={1}>
              {mechanic.latitude &&
                mechanic.longitude &&
                (
                  haversine(
                    { lat: mechanic.latitude, lng: mechanic.longitude },
                    location
                  ) / 1000
                ).toFixed(2)}{" "}
              Km away
            </Text>
          </View>
          <View className="flex-row items-center justify-center">
            <MessageButton
              title="Message"
              containerStyles="pr-8"
              handlePress={() => handleMessage()}
             
            />
            <CallButton handlePress={() => onCallMobilePhone(mechanic.phone)} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MechanicCard;
