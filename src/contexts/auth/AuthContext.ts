import React from "react";

export interface UserAuthentication {
    name: string | null,
    token: string | null,
    toggleAuth: Function
}

export const AuthContext = React.createContext<UserAuthentication | null>({
    // user: {
    name: null,
    token: null,
    toggleAuth: () => {
    }
    // toggleAuth: () => {},
});
