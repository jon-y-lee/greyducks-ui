import React from "react";
import {LOCAL_STORE_KEYS} from "../../components/Constants";

export interface UserAuthentication {
    name: string | null,
    token: string | null,
    email: string | null,
    id:string | null,
    given_name: string | null,
    family_name: string | null,
    picture: string | null | undefined,
    toggleAuth: Function
}

export const AuthContext = React.createContext<UserAuthentication | null>({
    name: null,
    token: null,
    email:  null,
    id: null,
    given_name: null,
    family_name: null,
    picture: null,
    toggleAuth: () => {
    }
});

export const getUserContextFromLocalStore = () => {
    const userPrincipleString = localStorage.getItem(LOCAL_STORE_KEYS.USER_PRINCIPLE);
    if (userPrincipleString != null) {
        return JSON.parse(userPrincipleString);
    }
    return null;
}
