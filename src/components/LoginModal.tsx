import React, {useContext, useEffect, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {AuthContext, UserAuthentication} from '../contexts/auth/AuthContext';
import {LOCAL_STORE_KEYS} from "./Constants";
import {UserService} from "../services/UserService";
import {isEmpty} from "radash";
import {GoogleTokenService} from "../services/GoogleTokenService";

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
    const [backdropOpen, setBackdropOpen]: any = useState(false);

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
            // alert("Successful login:" + JSON.stringify(codeResponse))
            setUser(codeResponse)
            handleClose()
            setBackdropOpen(false)
        },
        onError: (error) => {
            console.log('Login Failed:', error)
            setBackdropOpen(false)
        },
        flow: 'auth-code',
    });
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    useEffect(
        () => {
            if (!isEmpty(user)) {
                console.log("LOG MODAL - USER:" + JSON.stringify(user.code))

                GoogleTokenService.getAccessTokenFromCode(user.code).then((authorizedPrincipal: any) => {
                    console.log("authorizedPrincipal - USER:" + JSON.stringify(authorizedPrincipal))

                    const tokenStore = {
                        token: authorizedPrincipal?.access_token
                    }

                    // Store token info
                    localStorage.setItem(LOCAL_STORE_KEYS.USER_PRINCIPLE, JSON.stringify(tokenStore));

                    console.log("tokenStore:" + JSON.stringify(tokenStore))
                    console.log("Getting  USER Profile:" + JSON.stringify(authorizedPrincipal))

                    UserService.userInfo(authorizedPrincipal.access_token).then(userPrinciple => {

                        var expiryDate = new Date();
                        expiryDate.setSeconds(expiryDate.getSeconds() + authorizedPrincipal?.expires_in);

                        let user = {
                            name: userPrinciple?.name,
                            token: userPrinciple?.token,
                            test: "asdfasdfasd",
                            refresh_token: authorizedPrincipal?.refresh_token,
                            expiration_ts: expiryDate.toLocaleString(),
                            email: userPrinciple.email,
                            id: userPrinciple.id,
                            given_name: userPrinciple.given_name,
                            family_name: userPrinciple.family_name,
                            picture: userPrinciple.picture,
                        }

                        console.log("User Info || STORED || :" + JSON.stringify(user))

                        userContext?.toggleAuth(user);

                        localStorage.setItem(LOCAL_STORE_KEYS.USER_PRINCIPLE, JSON.stringify(user));

                    }).catch((err) => console.log(err));
                })

            }
        },
        [user]
    );
    return (
        <Modal
            open={open}
            onClose={() => handleClose()}
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
                                setBackdropOpen(true)
                                login();
                            }}
                            variant="outlined"
                        >
                            Continue with Google </Button>
                    )}                </Typography>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={backdropOpen}
                    onClick={() => setBackdropOpen(false)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

            </Box>
        </Modal>
    );
}

export default LoginModal;
