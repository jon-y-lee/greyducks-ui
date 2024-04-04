import React, {useState} from 'react';
import './App.css';
import {GoogleOAuthProvider} from '@react-oauth/google';
import Calendar from './components/Calendar'; // We'll create this component next
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from "./components/Home";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import {AuthContext, UserAuthentication} from './contexts/auth/AuthContext';

function App() {

    const toggleAuth = (name: string, token: string) => {
        setCurrentAuthenticatedUser({name, token, toggleAuth})
    };

    const [currentAuthenticatedUser, setCurrentAuthenticatedUser]
        = useState<UserAuthentication>({name: null, token: null, toggleAuth: toggleAuth});
    const router = createBrowserRouter([
        {
            path: "calendar",
            element: <><ResponsiveAppBar/><Calendar/></>,
        },
        {
            path: "/",
            element: <><ResponsiveAppBar/><Home/></>,
        },
    ]);

    return (
        <div className={"App"}>
            <AuthContext.Provider value={currentAuthenticatedUser}>
                <GoogleOAuthProvider
                    clientId="312804416596-b9fg9pvslkk3vnmbtlngertcr6qqr653.apps.googleusercontent.com"
                >
                    <RouterProvider router={router}/>
                </GoogleOAuthProvider>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
