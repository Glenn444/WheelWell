import ContactCard from "@/components/ContactCard";
import CustomButton from "@/components/CustomButton";
import EmptyState from "@/components/EmptyState";
import MechanicCard from "@/components/MechanicsCard";
import { images } from "@/constants";
import { getAllMechanics } from "@/lib/appwrite";
import useLocation from "@/lib/location";
import { useHydration, useStore } from "@/store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {  useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useShallow } from "zustand/react/shallow";
import { SafeAreaView } from "react-native-safe-area-context";
import io from "socket.io-client";

const HomePage = () => {
  const hydrated = useHydration();
  const client = useQueryClient();
  const isLoggedIn  = useStore((state)=> state.isLoggedIn);
  
  // if (!isLoggedIn) return <Redirect href="/sign-in"/>
  const {
    locationServicesEnabled,
    refetchLocation,
    isLoadingLocation,
    location,
  } = useLocation();


  const [refreshing, setRefreshing] = useState(false);
  const { currentUser, setOnlineUser, setSocketConnection, token } = useStore(
    useShallow((state) => ({
      currentUser: state.user,
      setOnlineUser: state.setOnlineUser,
      setSocketConnection: state.setSocketConnection,
      token: state.token,
    }))
  );

  /**Socket Connection */
  const socketConnection = () => {
    const socket = io(process.env.EXPO_PUBLIC_BACKEND_URL ?? "", {
      auth: {
        token: `${hydrated ? token : null}`,
      },
    });

    socket.on("onlineUser", (data) => {
      // console.log("Online", data);

      setOnlineUser(data);
    });

    setSocketConnection(socket);

    return () => {
      socket.disconnect();
    };
  };

  useEffect(() => {
    socketConnection();
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["mechanics", location],
    queryFn: () => getAllMechanics(location),
  });

  const { mutate } = useMutation({
    mutationKey: ["refetchMechanics", location],
    mutationFn: (location: any) => getAllMechanics(location),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["mechanics"],
      });
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);

    mutate(location);
    setRefreshing(false);
  };
  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full flex-1 justify-center items-center align-middle">
          <ActivityIndicator size="large" />
        
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      {locationServicesEnabled ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }: any) => <MechanicCard mechanic={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-center flex-row mb-6">
                <View className="flex-row space-x-2  items-center">
                  <Image
                    source={{ uri: currentUser.avatar }}
                    className="w-8 h-8 rounded-full"
                    resizeMode="cover"
                  />

                  <Text className=" text-xl font-psemibold text-white">
                    {currentUser?.username}
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Image
                    source={images.logo}
                    className="w-24"
                    resizeMode="contain"
                  />
                </View>
              </View>
              <ContactCard />
              <View className="w-full flex-1 pt-5 pb-2">
                <Text className="text-white text-lg font-pregular mb-1">
                  Nearby Mechanics
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Mechanics Found Near You"
              subtitle=""
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <CustomButton
          title="Get Location"
          handlePress={refetchLocation}
          containerStyles="mt-7"
          isLoading={isLoadingLocation}
        />
      )}
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default HomePage;
