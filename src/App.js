// Copyright (C) 2022 Léo Gorman
// 
// This file is part of rhomis-data-app.
// 
// rhomis-data-app is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// rhomis-data-app is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with rhomis-data-app.  If not, see <http://www.gnu.org/licenses/>.

/* See this tutorial for authentication state management
https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
https://reactrouter.com/web/example/auth-workflow 
*/

// Import styling
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import router information
import React, { useState, useEffect} from 'react';
import axios from 'axios';

// Import the various components
import RoutingComponent from './components/routing-component/routing-component';
// Import the context which stores the authentication tokens
import AuthContext from './components/authentication-component/AuthContext';
import UserContext from './components/user-info-component/UserContext';


import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'



import NoMobile from './components/no-mobile-component/no-mobile-component';


function App() {
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null)


  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

function handleWindowSizeChange() {
    setWidth(window.innerWidth);
}
useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, []);

useEffect(() => {
  setIsMobile(width <= 1000) // use to 768

},[width])



  return (
    <>
      <ReactNotifications />

      <AuthContext.Provider value={[authToken, setAuthToken]}>
        <UserContext.Provider value={[userInfo, setUserInfo]}>
          <div className="main-app-background">
            <div className="main-page">
              {!isMobile?<RoutingComponent />:<NoMobile/>}
            </div >
          </div>
        </UserContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;