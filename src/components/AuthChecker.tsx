import React, {useContext, useEffect} from 'react';
import {AuthContext, UserAuthentication} from "../contexts/auth/AuthContext";
import {LOCAL_STORE_KEYS} from "./Constants";
import {useNavigate} from "react-router-dom";
import {UserService} from "../services/UserService";
import {TokenService} from "../services/TokenService";

const AuthChecker = () => {

    const userContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const userPrincipleString = localStorage.getItem(LOCAL_STORE_KEYS.USER_PRINCIPLE);

        if (userPrincipleString != null && userPrincipleString != "{}") {
            console.log("TOKEN STORE:" + JSON.stringify(userPrincipleString))
            const userPrinciple: UserAuthentication = JSON.parse(userPrincipleString);

            let expDate;
            if (userPrinciple?.expiration_ts != null) {
                expDate = new Date(userPrinciple?.expiration_ts);

                let currentDate = new Date();

                console.log(" Exp Date:" + expDate)
                console.log(" currentDate Date:" + currentDate)

                if (expDate <= currentDate) {
                    console.log("Token Refreshing!")
                    TokenService.refreshAccessToken(userPrinciple?.refresh_token!!).then((data) => {

                        var expiryDate = new Date();
                        expiryDate.setSeconds(expiryDate.getSeconds() + data?.expires_in);

                        let user = {
                            name: userPrinciple?.name,
                            token: userPrinciple?.token,
                            refresh_token: data.access_token,
                            expiration_ts: expiryDate.getTime(),
                            email: userPrinciple.email,
                            id: userPrinciple.id,
                            given_name: userPrinciple.given_name,
                            family_name: userPrinciple.family_name,
                            picture: userPrinciple.picture,
                        }

                        userContext?.toggleAuth(user);

                        localStorage.setItem(LOCAL_STORE_KEYS.USER_PRINCIPLE, JSON.stringify(user));
                    })
                } else {
                    console.log("Token good")
                }
            } else {
                userContext?.toggleAuth(userPrinciple?.name,
                    userPrinciple?.token,
                    userPrinciple?.refresh_token,
                    userPrinciple?.expiration_ts,
                    userPrinciple.email,
                    userPrinciple.id,
                    userPrinciple.given_name,
                    userPrinciple.family_name,
                    userPrinciple.picture);
            }
        } else {
            navigate("/")
            userContext?.toggleAuth({});
        }
    }, []);

    return (
        <>
        </>
    );
};

export default AuthChecker;
