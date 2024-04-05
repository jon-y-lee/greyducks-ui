import React from "react";

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
