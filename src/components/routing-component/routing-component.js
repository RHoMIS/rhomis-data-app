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

import React, { useContext, useEffect, useState} from 'react'

import { Login, LoginComponent } from "../login-component/login-component"
import { DataQueryComponent } from "../data-query-component/data-query-component"
import { RegisterComponent } from '../register-component/register-component';
import PortalComponent from '../portal-component/portal-component';
import NotFoundComponent from '../not-found-component/not-found-component';
import ProjectManagementComponent from "../project-management-component/project-management-component"
import FormManagementComponent from '../form-management-component/form-management-component';
import MainNavbar from '../navigation-bar/navigation-bar-component'
import FormCreationComponent from '../form-creation-component/form-creation-component';

import DataCollectionComponent from '../data-collection-component/data-collection-component';
import DataAccessComponent from '../data-access-component/data-access-component';
import UserManagementComponent from '../user-management-component/user-management-component';
import AuthContext from '../authentication-component/AuthContext';
import UserContext from '../user-info-component/UserContext';
import {
    HashRouter as Router,
    RouteProps,
    useHistory,
    useLocation,
    // BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";


import { FetchUserInformation, CheckForLocalToken } from '../fetching-context-info/fetching-context-info';


export default function RoutingComponent() {

    const [authToken, setAuthToken] = useContext(AuthContext)

    const [loading, setLoading] = useState(false)
    const [authenticated, setAuthenticated] = useState(null)

    // const [userInfo, setUserInfo] = useContext(UserContext)
    const history = useHistory()
    // const location = useLocation()

    useEffect(() => {
        CheckForLocalToken({
            setAuthToken: setAuthToken
        })
    }, [])




    // useEffect(() => {
    //     FetchUserInformation({
    //         authToken: authToken,
    //         setUserInfo: setUserInfo
    //     })
    // }, [authToken])




    console.log("Auth token context")
    console.log(authToken)

  
        if (authToken) {
           return(<AuthenticatedComponents authToken={authToken} />)
        }
    
        if (!authToken) {
            return ( <PublicComponents authToken={authToken} />)
        }
    
    
   
    

}

function AuthenticatedComponents(props){
    return (
        < Router >
            <MainNavbar />
            <Switch>
                <Route exact path="/">
                    <Redirect from="/" to="/home" />
                </Route>
                <Route path="/home" component={PortalComponent} />
                <Route path="/register"><RegisterComponent /></Route>

                <Route path="/projects/:projectName/forms/:formName/collect/:draftOrLive" component={DataCollectionComponent} />
                <Route path="/projects/:projectName/forms/:formName/users" component={UserManagementComponent} />
                <Route path="/projects/:projectName/forms/:formName/data" component={DataAccessComponent} />
                <Route path="/projects/:projectName" component={FormManagementComponent} />

                <Route path="/projects" ><ProjectManagementComponent /></Route>



                <Route path="/data-querying" component={DataQueryComponent} />
                <Route path="/administration" component={FormCreationComponent} />

                {/* <Route path="*" component={NotFoundComponent} /> */}
                <Redirect from="*" to="/home" />

            </Switch >
            {/* </Fade> */}

        </Router >
    )

}


function PublicComponents(props){

    // const history = useHistory()

    // useEffect(()=>{
    //     history.push("/login")
    // })
    
    return (
        < Router >
            {/* <Fade> */}
            <Switch>
                <Route exact path="/">
                    <Redirect from="/" to="/login" />
                </Route>
                <Route path="/register"><RegisterComponent /></Route>
                <Route path="/login"><LoginComponent /></Route>
            </Switch >
            {/* </Fade> */}

        </Router >
    )
}


