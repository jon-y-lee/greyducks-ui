import React, {useContext, useEffect} from 'react';
import {AuthContext, UserAuthentication} from "../contexts/auth/AuthContext";
import {LOCAL_STORE_KEYS} from "./Constants";
import {useNavigate} from "react-router-dom";

const AuthChecker = () => {

    const userContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const userPrincipleString = localStorage.getItem(LOCAL_STORE_KEYS.USER_PRINCIPLE);

        if (userPrincipleString != null && userPrincipleString != "{}") {
            const userPrinciple: UserAuthentication = JSON.parse(userPrincipleString);
            console.log("  Auth Checker: Found a user")

            userContext?.toggleAuth(userPrinciple?.name,
                userPrinciple?.token,
                userPrinciple?.refresh_token,
                userPrinciple?.expiration_ts,
                userPrinciple.email,
                userPrinciple.id,
                userPrinciple.given_name,
                userPrinciple.family_name,
                userPrinciple.picture);
        } else {
            navigate("/")
        }
    }, []);

    return (
        <>
        </>
    );
};

export default AuthChecker;
