import React, {useState} from 'react';
import './App.css';
import {GoogleOAuthProvider} from '@react-oauth/google';
import WeeklyCalendar from './components/calendar/WeeklyCalendar'; // We'll create this component next
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from "./components/Home";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import {AuthContext, UserAuthentication} from './contexts/auth/AuthContext';
import AuthChecker from "./components/AuthChecker";
import Profile from "./components/Profile";
import Tasks from "./components/Tasks";
import Recipes from "./components/Recipes";
import Settings from "./components/settings/Settings";
import {ThemeProvider, createTheme, createMuiTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Backdrop, CircularProgress} from "@mui/material";

function App() {

    const toggleAuth = (
        name: string,
        token: string,
        email: string,
        id: string,
        given_name: string,
        family_name: string,
        picture: string
    ) => {
        setCurrentAuthenticatedUser({name, token, email, id, given_name, family_name, picture, toggleAuth})
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
        email: null,
        id: null,
        given_name: null,
        family_name: null,
        picture: null,
        toggleAuth: toggleAuth
    });

    const router = createBrowserRouter([
        {
            path: "calendar",
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
                        </GoogleOAuthProvider>
                    </AuthContext.Provider>
                </React.StrictMode>
            </ThemeProvider>
        </div>
    );
}

export default App;
