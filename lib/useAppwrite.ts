import { Alert } from "react-native";
import { getAllMechanics, getCurrentUser } from "./appwrite";
import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";

type UserData = {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $tenant: string;
    $updatedAt: string;
    avatar: string;
    email: string;
    latitude: number;
    longitude: number;
    phone: string;
    role: string;
    username: string; // Assuming this property exists in the JSON structure
  };


const useAppWrite = () =>{
    const [data, setData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setUser] = useState<Models.Document | undefined>()
    //const {location} = useLocation();
    const location = {
        lat: 37.4220936,
        lng: -122.083922
    } 
    const fetchData = async ()=>{
        setIsLoading(true)
        try {
          const response:any = await getAllMechanics(location);
          //console.log(response);
          
          setData(response)
        } catch (error:any) {
          Alert.alert('Error', error.message)
        }finally{
          setIsLoading(false);
        }
      }
      const getUser = async ()=>{
        const user = await getCurrentUser();
        setUser(user);
      }
    useEffect(()=>{
        getUser();
      fetchData();
    }, []);
    const refetch = ()=> fetchData();
return {data, isLoading, refetch, currentUser}
    
}

export default useAppWrite;