import axios from "axios";

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`;
export const createChatUser = async (
  name: string,
  avatar: string,
  id: string
) => {
  const URL = `${BASE_URL}/register`;

  try {
    const data = {
      name: name,
      profile_pic: avatar,
      userId: id,
    };
    const response = await axios.post(URL, data, { timeout: 20000 });
   
    return response;
  } catch (error: any) {
    console.log("Create: ", error.response.data);

    throw new Error(error);
  }
};

export const fetchUserId = async (id: string) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`, { timeout: 20000 });
    return res.data;
    
  } catch (error:any) {
    throw new Error(error)
  }

};

export const updateUserChat = async (profile_pic: string, id:string) => {
  try {
    const res = await axios({
      method: "put",
      url: `${BASE_URL}/update-user`,
      data: { profile_pic, id },
      timeout: 10000,
      headers: { "Content-Type": "application/json" }, // Important: set the content-type header
    });
  
    return res.data;
    
  } catch (error:any) {
    throw new Error(error)
  }

};
