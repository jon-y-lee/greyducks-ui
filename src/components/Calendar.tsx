import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {Button} from "@mui/material";

const Calendar = () => {

    const [token, setToken] = useState("");
    const responseGoogle = (response: any) => {
        console.log(response);
    }
    const [user, setUser] : any = useState([]);
    const [profile, setProfile] : any = useState([]);
    const [events, setEvents] : any = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse: any) => {
            console.log("Success:" + JSON.stringify(codeResponse))
            setUser(codeResponse)
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
        <div className={"App"}>
            <br/>
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
                    Sign in with Google 🚀 </Button>
            )}
        </div>
    );
};

export default Calendar;
