import React, {useContext, useState} from 'react';
import {AuthContext} from "../contexts/auth/AuthContext";

const Profile = () => {

    // console.log("calendar")
    const [token, setToken] = useState("");
    const responseGoogle = (response: any) => {
        console.log(response);
    }
    const [user, setUser] : any = useState([]);
    const [profile, setProfile] : any = useState([]);
    const [events, setEvents] : any = useState([]);
    const userContext = useContext(AuthContext);

    return (
        <div >
            <br/>
            {userContext?.token ? (
                <div>
                    <h3>Profile | User Logged in</h3>
                    <p>Name: {userContext.name}</p>
                    <p>Email Address: {userContext.email}</p>
                    <p>email: {userContext.email}</p>
                    <p>token: {userContext.token}</p>
                    <p>refresh token: {userContext.refresh_token}</p>
                    <p>expirey date: {userContext.expiration_ts}</p>
                    {/*{JSON.stringify(userContext)}*/}
                    <br/>
                    <br/>
                </div>
            ) : null }
        </div>
    );
};

export default Profile;
