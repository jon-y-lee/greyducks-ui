import React, {useState} from 'react';
import './App.css';
import {GoogleOAuthProvider} from '@react-oauth/google';
import WeeklyCalendar from './components/calendar/WeeklyCalendar'; // We'll create this component next
import {createHashRouter, RouterProvider,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from "./components/Home";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import {AuthContext, getUserContextFromLocalStore, UserAuthentication} from './contexts/auth/AuthContext';
import AuthChecker from "./components/AuthChecker";
import Profile from "./components/Profile";
import Tasks from "./components/tasks/Tasks";
import Recipes from "./components/recipes/Recipes";
import Settings from "./components/settings/Settings";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from "axios";
import {LOCAL_STORE_KEYS} from "./components/Constants";
import LoginModal from "./components/LoginModal";
import Calendar from "./components/calendar/Calendar";

function App() {

    const [login, setLogin] = useState(false);

    const handleCloseLogin = () => {
        setLogin(false);
    }

    const toggleAuth = (
        name: string,
        token: string,
        refresh_token: string,
        expiration_ts: number,
        email: string,
        id: string,
        given_name: string,
        family_name: string,
        picture: string
    ) => {
        setCurrentAuthenticatedUser({
            name,
            token,
            refresh_token,
            expiration_ts,
            email,
            id,
            given_name,
            family_name,
            picture,
            toggleAuth
        })
    };

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
        typography: {
            fontFamily: "'Quicksand', sans-serif"
        }
    });

    const [currentAuthenticatedUser, setCurrentAuthenticatedUser]
        = useState<UserAuthentication>({
        name: null,
        token: null,
        refresh_token: null,
        expiration_ts: null,
        email: null,
        id: null,
        given_name: null,
        family_name: null,
        picture: null,
        toggleAuth: toggleAuth
    });

    const router = createHashRouter([
        {
            path: "calendar",
            element: <><AuthChecker/><ResponsiveAppBar/><Calendar/></>,
        },
        {
            path: "event/:id",
            element: <><AuthChecker/><ResponsiveAppBar/><WeeklyCalendar/></>,
        },
        {
            path: "/",
            element: <><AuthChecker/><ResponsiveAppBar/><Home/></>,
        },
        {
            path: "/profile",
            element: <><AuthChecker/><ResponsiveAppBar/><Profile/></>,
        },
        {
            path: "/tasks",
            element: <><AuthChecker/><ResponsiveAppBar/><Tasks/></>,
        },
        {
            path: "/recipes",
            element: <><AuthChecker/><ResponsiveAppBar/><Recipes/></>,
        },
        {
            path: "/settings",
            element: <><AuthChecker/><ResponsiveAppBar/><Settings/></>,
        },
    ]);

    axios.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error?.response?.status === 401) {
            console.log("ERROR 401!!!")
            localStorage.removeItem(LOCAL_STORE_KEYS.USER_PRINCIPLE)
            setLogin(true);
        }
        return error;
    });

    axios.interceptors.request.use(request => {
        const userContext = getUserContextFromLocalStore()
        if (userContext != undefined) {
            request.headers.setAuthorization('Bearer ' + userContext.token)
            request.headers.setAccept('application/json')
        }
        return request;
    })

    // const instance = axios.defaults ? axios as AxiosCacheInstance : setupCache(axios);
    //
    // setupCache(axios, {
    //     methods: ['get'],
    //     ttl: 60
    // });

    return (
        <div className={"App"}>
            <ThemeProvider theme={lightTheme}>
                <CssBaseline/>
                <React.StrictMode>
                    <AuthContext.Provider value={currentAuthenticatedUser}>
                        <GoogleOAuthProvider
                            clientId={'877315751810-m2qboe99fehv6roceg5f42tcatngqqc1.apps.googleusercontent.com'}
                        >
                            <RouterProvider router={router}/>
                            <LoginModal open={login} handleClose={handleCloseLogin}/>
                        </GoogleOAuthProvider>
                    </AuthContext.Provider>
                </React.StrictMode>
            </ThemeProvider>
        </div>
    );
}

export default App;
