import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {Button} from "@mui/material";
import LoginModal from "./LoginModal";
import {AuthContext, UserAuthentication} from "../contexts/auth/AuthContext";
import {LOCAL_STORE_KEYS} from "./Constants";
import {useNavigate} from "react-router-dom";

const AuthChecker = () => {

    const [token, setToken] = useState("");
    const userContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const userPrincipleString = localStorage.getItem(LOCAL_STORE_KEYS.USER_PRINCIPLE);

        if (userPrincipleString != null) {
            const userPrinciple: UserAuthentication = JSON.parse(userPrincipleString);

            console.log("UserPrinciple:" + JSON.stringify(userPrinciple));
            userContext?.toggleAuth(userPrinciple?.name,
                userPrinciple?.token,
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
