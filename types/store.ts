import { UserSlice } from "@/store/userSlice";

export type Store = UserSlice;

export type UserType = {
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
export const UserDefault = {
    $collectionId: '',
    $createdAt: '',
    $databaseId: '',
    $id: '',
    $permissions: [],
    $tenant: '',
    $updatedAt: '',
    avatar: 'https://cloud.appwrite.io/v1/storage/buckets/665842da000f53b2795f/files/6693fa0a00007daa25eb/view?project=6650af6e00060ac799fd&mode=admin',
    email: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    role: '',
    username: '', // Assuming this property exists in the JSON structure
  };

  export type MessageType ={
            sender : string,
            receiver : string,
            text : string,
            imageUrl : string,
            videoUrl : string,
            msgByUserId : string,
            createdAt : string,
            updatedAt : string
  }

  export type locationType = {
    lat:number,
    lng: number
  }