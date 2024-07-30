import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage
} from "react-native-appwrite";
import haversine from 'haversine-distance'
import { locationType, UserType } from "@/types/store";
import { fetchUserId, updateUserChat } from "./chatFunc";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.app.wheelwell",
  projectId: "6650af6e00060ac799fd",
  databaseId: "66525f78002b6dc6cce4",
  userCollectionId: "66583f560027f022b691",
  storageId: "665842da000f53b2795f",
};
const {
  endpoint,
  platform,
  projectId,
  databaseId,
  storageId,
  userCollectionId
} = config;
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
  role: string
) => {
  let newUser = null;
  let newAccount = null;

  try {
    const avatarUrl = avatars.getInitials(name);
    // const P = {
    //   latitude: 37.4220936,
    //   longitude: -122.083922
    // }
     
    //const R = 2000 // meters
     
    //const randomPoint = randomLocation.randomCirclePoint(P, R)
    const createdUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("email", [`${email}`])]
    )
    if (createdUser.documents.length !== 0){
      throw new Error("User Already Exists")
    }
    
    //Create new user if user does not exist in db
    if (createdUser.documents.length === 0){
    newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        username: name,
        email: email,
        phone: phone,
        role: role,
        avatar: avatarUrl,
      }
    );

    if (!newUser) throw new Error("Failed to create user");

  }
  
    newAccount = await account.create(newUser?.$id ?? '', email, password, name);

    if (!newAccount) throw Error;


    await SignIn(email, password);

    return newUser;
  } catch (error: any) {
    await databases.deleteDocument(
      config.databaseId,
      config.userCollectionId,
      newUser?.$id ?? ''
    );
    throw new Error(error.message);
  }
};

export const ForgotPassword = async (email:string) =>{
  try {
    const response = await account.createRecovery(email, 'https://forgot-password-h53o.vercel.app');
  
    return response;
  } catch (error:any) {
    throw new Error(error.message);
  }
  
}

export const SignIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    //console.log(error.message);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.getDocument(
      config.databaseId,
      config.userCollectionId,
      currentAccount.$id,
      []
    );

    if (!currentUser) return;
   
    
    return currentUser;
  } catch (error: any) {
    console.log("Error getting current user", error.message);
  }
};

export const LogOutUser = async () => {
  try {
   
    const session = await account.deleteSession("current");
    return session;
    
  } catch (error: any) {
    //console.log(error.message);
    
    throw new Error(error.message)
    
  }
};

//Update User Location
export const updateUserLocation = async(location:locationType) =>{
 
  try {
   
    const user = await getCurrentUser();

     await databases.updateDocument(
      databaseId,
      userCollectionId,
      user?.$id ??'',
      {
        latitude: location.lat,
        longitude: location.lng,
      }
     
    );

    
  } catch (error:any) {
    //console.log(error.message);
    
    throw new Error(error.message);
  }

}


export const getAllMechanics = async (location:{lat:number, lng:number} | null)=>{
  try {
    //console.log(location);
    const currentUser:any = await getCurrentUser();
    
    if (location){
    const mechanics = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.and([Query.equal("role", ["MECHANIC"]), Query.notEqual('username', [`${currentUser.username}`])])]
    )
    const mechanicsWithinRadius = mechanics.documents.filter((mechanic: any) => {
      if (mechanic.latitude && mechanic.longitude){
      const mechanicLocation = {
        lat: mechanic.latitude, 
        lng: mechanic.longitude,
      };
   
      const distance = haversine(location, mechanicLocation);

      return distance <= 2000; //Distance within 2km
   
    }
    });
    
    
    

    return mechanicsWithinRadius;
  }
  //throw new Error('Provide Location')
  } catch (error:any) {
    throw new Error(error.message);
  }

}
export async function getFilePreview(fileId:any, type:string) {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        320,
        320,
        ImageGravity.Center,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error:any) {
    throw new Error(error);
  }
}
export const updateUserImage = async(file:any, type:string) =>{
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };
  try {
    const user = await getCurrentUser();
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );
   
    const imageUrl:any = await getFilePreview(uploadedFile.$id, type);
    const id = await fetchUserId(user?.$id ?? '');
      await updateUserChat(imageUrl, id);
    

    const updatedUser = await databases.updateDocument(
      databaseId,
      userCollectionId,
      user?.$id ??'',
      {
        avatar: imageUrl,
      }
     
    );

    return updatedUser;
   
    
  } catch (error:any) {
    // console.log(error.message);
    
    throw new Error(error.message);
  }

}