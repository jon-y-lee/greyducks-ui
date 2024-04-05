import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {googleLogout, useGoogleLogin} from "@react-oauth/google";
import {Button, Grid, Paper, styled} from "@mui/material";
import {AuthContext} from "../contexts/auth/AuthContext";
import Box from "@mui/material/Box";

const Calendar = () => {

    console.log("calendar")
    const [token, setToken] = useState("");
    const responseGoogle = (response: any) => {
        console.log(response);
    }
    // const [user, setUser] : any = useState([]);
    const [profile, setProfile] : any = useState([]);
    const [events, setEvents] = useState<Event[]>([]);
    const userContext = useContext(AuthContext);

    useEffect(
        () => {
            if (userContext) {
                axios
                    .get(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
                        headers: {
                            Authorization: `Bearer ${userContext.token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.log("Got calendar events " + JSON.stringify(res.data['items']))
                        setEvents(res.data['items'].map( (item: any) : Event => {
                            return item;
                            // return {
                            //     status: item.status,
                            //
                            // }
                        }));
                    })
                    .catch((err) => console.log(err));

            }
        },
        [userContext]
    );
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <div >
            <br/>
            {profile ? (
                <div>
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


                    <Box sx={{ flexGrow: 0.1 }}>
                        <Grid container spacing={0.5}>
                            <Grid item sm={12} md={12/7}>
                                Sunday
                            </Grid>
                            <Grid item xs={12} sm={12} md={12/7}>
                                Monday
                            </Grid>
                            <Grid item xs={12} sm={12}  md={12/7}>
                                Tuesday
                            </Grid>
                            <Grid item xs={12} sm={12}  md={12/7}>
                                Wednesday
                            </Grid>
                            <Grid item xs={12} sm={12}  md={12/7}>
                                Thursday
                            </Grid>
                            <Grid item xs={12} sm={12}  md={12/7}>
                                Friday
                            </Grid>
                            <Grid item xs={12} sm={12}  md={12/7}>
                                Saturday
                            </Grid>
                        </Grid>
                    </Box>

                </div>
            ) : null }
        </div>
    );
};

export default Calendar;
