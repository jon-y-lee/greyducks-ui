import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {AuthContext} from '../contexts/auth/AuthContext';

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
    const [events, setEvents]: any = useState([]);

    const userContext = useContext(AuthContext);

    const login = useGoogleLogin({
        onSuccess: (codeResponse: any) => {
            console.log("Success:" + JSON.stringify(codeResponse))
            setUser(codeResponse)
            userContext?.toggleAuth("jon lee", "asdf");
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
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));

                axios
                    .get(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.log("Got calendar events " + JSON.stringify(res.data['items']))
                        setEvents(res.data['items']);
                    })
                    .catch((err) => console.log(err));

            }
        },
        [user]
    );
    return (
        <AuthContext.Consumer>
            {user => (
                <Modal
                    open={open}
                    // close={}
                    // onBackdropClick={() => setOpen(false)
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
                            {profile ? (
                                <div>
                                    <img src={profile.picture} alt="user image"/>
                                    <h3>User Logged in</h3>
                                    <p>Name: {profile.name}</p>
                                    <p>Email Address: {profile.email}</p>
                                    <br/>
                                    <br/>
                                    <button onClick={logOut}>Log out</button>

                                    {events ? (
                                        <div>
                                            <h2>Your Events</h2>
                                            <ul>
                                                {events.map((event: any, index: any) => (
                                                    <li key={index}>{event.summary} - {new Date(event.start.dateTime).toLocaleString()}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null}

                                </div>

                            ) : (
                                <Button
                                    onClick={() => {
                                        login();
                                    }}
                                >
                                    Continue with Google </Button>
                            )}                </Typography>
                    </Box>
                </Modal>
            )}
        </AuthContext.Consumer>
    );
}

export default LoginModal;
