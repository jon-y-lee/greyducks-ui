import React from 'react';
import './App.css';
import {GoogleOAuthProvider} from '@react-oauth/google';
import Calendar from './components/Calendar'; // We'll create this component next
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const router = createBrowserRouter([
    {
      path: "/calendar",
      element: <Calendar/>,
    },
    {
      path: "/",
      element: <div/>,
    },

  ]);

  return (
      <div className={"App"}>
        <GoogleOAuthProvider
            clientId="312804416596-b9fg9pvslkk3vnmbtlngertcr6qqr653.apps.googleusercontent.com"
        >
          <RouterProvider router={router}/>
        </GoogleOAuthProvider>
      </div>
  );
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
