import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {AuthContext} from '../contexts/auth/AuthContext';
import {LOCAL_STORE_KEYS} from "./Constants";
import {GoogleUserService} from "../services/GoogleUserService";
import {isEmpty} from "radash";

interface LoginModalInterface {
    open: boolean,
    handleClose: Function,
}


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const LoginModal = (loginModalInterface: LoginModalInterface) => {
    const {handleClose, open} = loginModalInterface;

    const [user, setUser]: any = useState([]);
    const [profile, setProfile]: any = useState([]);

    const userContext = useContext(AuthContext);

    const login = useGoogleLogin({
        scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/tasks",
        ].join(" "),

        onSuccess: (codeResponse: any) => {
            console.log("Success:" + JSON.stringify(codeResponse))
            setUser(codeResponse)
            handleClose()
        },
        onError: (error) => console.log('Login Failed:', error)
    });
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    useEffect(
        () => {
            if (!isEmpty(user)) {
                console.log("LOG MODAL - USER:" + JSON.stringify(user))
                GoogleUserService.userInfo(user.access_token).then(userPrinciple => {
                    userContext?.toggleAuth(userPrinciple?.name,
                        userPrinciple?.token,
                        userPrinciple.email,
                        userPrinciple.id,
                        userPrinciple.given_name,
                        userPrinciple.family_name,
                        userPrinciple.picture);

                    localStorage.setItem(LOCAL_STORE_KEYS.USER_PRINCIPLE, JSON.stringify(userPrinciple));

                }).catch((err) => console.log(err));
            }
        },
        [user]
    );
    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Log In
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    continuing you agree to our user agreements and acknowledge that you understand our Privacy
                    Policy
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 3}}>
                    {userContext?.token ? (
                        <div>
                            error... error... error...
                        </div>

                    ) : (
                        <Button
                            onClick={() => {
                                login();
                            }}
                            variant="outlined"
                        >
                            Continue with Google </Button>
                    )}                </Typography>
            </Box>
        </Modal>
    );
}

export default LoginModal;
