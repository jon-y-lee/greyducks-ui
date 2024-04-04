import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {Button} from "@mui/material";

const Profile = () => {

    const [token, setToken] = useState("");

    return (
        <div className={"App"}>
            <br/>
            Profile
        </div>
    );
};

export default Profile;
