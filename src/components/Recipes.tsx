import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {Button} from "@mui/material";
import LoginModal from "./LoginModal";
import {AuthContext} from "../contexts/auth/AuthContext";

const Recipes = () => {

    const [token, setToken] = useState("");
    const userContext = useContext(AuthContext);

    return (
        <div>
            Recipes
        </div>
    );
};

export default Recipes;
