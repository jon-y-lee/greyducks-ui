import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {AuthContext} from '../contexts/auth/AuthContext';
import {LOCAL_STORE_KEYS} from "./Constants";

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
    // const [events, setEvents]: any = useState([]);

    const userContext = useContext(AuthContext);

    const login = useGoogleLogin({
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
            if (user) {
                console.log("USER:" + JSON.stringify(user))
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.log("asdfasdfasdfsa" + JSON.stringify(res))
                        setProfile(res.data);
                        const userPrinciple = {
                            name: res.data?.name,
                            token: user?.access_token,
                            email: res.data?.email,
                            id: res.data?.email,
                            given_name: res.data?.given_name,
                            family_name: res.data?.family_name,
                            picture: res.data?.picture,
                        }
                        userContext?.toggleAuth(res.data?.name,
                            user.access_token,
                            userPrinciple.email,
                            userPrinciple.id,
                            userPrinciple.given_name,
                            userPrinciple.family_name,
                            userPrinciple.picture);

                        localStorage.setItem(LOCAL_STORE_KEYS.USER_PRINCIPLE, JSON.stringify(userPrinciple));

                    })
                    .catch((err) => console.log(err));
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
