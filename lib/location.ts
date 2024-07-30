import { StyleSheet, Text, Alert, View, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { updateUserLocation } from "./appwrite";

const useLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } >(
  {lat:0, lng: 0}
  );
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Allow the app to use the location services",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => {
              Linking.openSettings()

            }},
          ]
        );
      } else {
        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
          const { latitude, longitude } = coords;
          
          const currentLocation = {
            lat: latitude,
            lng: longitude,
          };
          setLocation(currentLocation);
          //set User Location db
          await updateUserLocation(currentLocation)
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoadingLocation(false);
    }

  };
  useEffect(() => {
    const checkIfLocationEnabled = async () => {
      let enabled = await Location.hasServicesEnabledAsync();
      
      setLocationServicesEnabled(enabled);
    };

    getCurrentLocation();

    if (locationServicesEnabled) {
      getCurrentLocation();
    } else {
      checkIfLocationEnabled();
    }
  }, []);
  const refetchLocation = () => getCurrentLocation();
  return { location, refetchLocation, locationServicesEnabled, isLoadingLocation };
};

export default useLocation;

