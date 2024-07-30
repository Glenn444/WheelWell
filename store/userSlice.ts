import { StateCreator } from "zustand";
import { UserType, UserDefault } from "@/types/store";

type UserState = {
    isLoggedIn: boolean,
    user: UserType,
    token: string,
    onlineUser: [],
    socketConnection: any,
    currentUserChatId: string,
};

type UserActions = {
    setUser: (value: any) => void;
    setIsLoggedIn: (value: boolean) => void;
    setToken: (value: string) => void;
    setOnlineUser: (value:[]) => void;
    setSocketConnection: (value: any) => void; // Assuming this property exists in the JSON structure
    setCurrentUserChatId: (value:string) => void;
    reset:() => void;
}

export type UserSlice = UserState & UserActions;
const initialState: UserState = {
    isLoggedIn: false,
    user: UserDefault,
    token: '',
    onlineUser: [],
    socketConnection: null,
    currentUserChatId: ''
}

export const createUserSlice: StateCreator<UserSlice, [['zustand/immer', never]], [], UserSlice> = (set)=>({
    ...initialState,
    setUser: (userinfo) => set({user: userinfo}),
    setIsLoggedIn: (value) => set({isLoggedIn: value}),
    setToken:(value) => set({token: value}),
    setOnlineUser: (value) => set({onlineUser: value}),
    setSocketConnection: (value) => set({socketConnection: value}), // Assuming this property exists in the JSON structure
    setCurrentUserChatId: (value) => set({currentUserChatId: value}),
    reset:()=>{
        set(initialState)
    }
});