import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {Button} from "@mui/material";
import LoginModal from "./LoginModal";
import {AuthContext} from "../contexts/auth/AuthContext";
import {GoogleTasksService} from "../services/GoogleTasksService";

const Tasks = () => {

    const [token, setToken] = useState("");
    const userContext = useContext(AuthContext);

    useEffect(() => {
        const token = userContext?.token ? userContext.token : "";
        GoogleTasksService.listTasks(token).then(data => {
            console.log(data)
        })
        }, [])
    return (
        <div>
            Tasks
        </div>
    );
};

export default Tasks;
