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

import React, { useContext, useEffect } from 'react'

import { Login, LoginComponent } from "../login-component/login-component"
import { DataQueryComponent } from "../data-query-component/data-query-component"
import { RegisterComponent } from '../register-component/register-component';
import PortalComponent from '../portal-component/portal-component';
import NotFoundComponent from '../not-found-component/not-found-component';
import ProjectManagementComponent from "../project-management-component/project-management-component"
import FormManagementComponent from '../form-management-component/form-management-component';
// import AccountManagementComponent from './components/account-management-component/account-management-component';
import MainNavbar from '../navigation-bar/navigation-bar-component'
import FormCreationComponent from '../form-creation-component/form-creation-component';
import AuthContext from '../authentication-component/AuthContext';
import UserContext from '../user-info-component/UserContext';
import axios from 'axios';
import {
    HashRouter as Router,

    // BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";


function CheckForLocalToken(props) {
    const localToken = localStorage.getItem("userToken")

    const currentDate = new Date()
    const localTokenCreationTime = new Date(localStorage.getItem("createdAt"))

    console.log("Difference")
    console.log(currentDate.getTime() - localTokenCreationTime.getTime())

    const timeDifference = currentDate.getTime() - localTokenCreationTime.getTime()
    if (timeDifference < 60 * 60 * 1000) {
        props.setAuthToken(localToken)
    }
}

async function FetchUserInformation(props) {
    const response = await axios({
        method: "get",
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/",
        headers: {
            'Authorization': props.authToken
        }
    })
    console.log("user info")
    console.log(response.data)

    return (response.data)

}

export default function RoutingComponent() {

    const [authToken, setAuthToken] = useContext(AuthContext)
    const [userInfo, setUserInfo] = useContext(UserContext)

    useEffect(() => {
        CheckForLocalToken({
            setAuthToken: setAuthToken
        })
    }, [])

    useEffect(() => {
        FetchUserInformation({
            authToken: authToken,
            setUserInfo: setUserInfo
        })
    }, [authToken])

    // Automatically log out 
    // after 1 hour of use
    setTimeout(() => {
        setAuthToken(null);
        localStorage.clear()
    }, 60 * 60 * 1000);

    console.log("Auth token context")
    console.log(authToken)


    if (authToken) {
        return (
            < Router >
                <MainNavbar />
                {/* <Fade> */}
                <Switch>
                    <Route exact path="/">
                        <Redirect from="/" to="/home" />
                    </Route>
                    <Route path="/home" component={PortalComponent} />
                    <Route path="/project-management" ><ProjectManagementComponent /></Route>
                    <Route path="/project/:projectname"><FormManagementComponent /></Route>
                    <Route path="/data-querying" component={DataQueryComponent} />
                    <Route path="/administration" component={FormCreationComponent} />
                    {/* <Route path="*" component={NotFoundComponent} /> */}
                    <Redirect from="*" to="/home" />

                </Switch >
                {/* </Fade> */}

            </Router >
        )
    }

    if (!authToken) {
        return (
            < Router >
                {/* <Fade> */}
                <Switch>
                    <Route exact path="/">
                        <Redirect from="/" to="/login" />
                    </Route>
                    <Route path="/register"><RegisterComponent /></Route>
                    <Route path="/login"><LoginComponent /></Route>
                    <Redirect from="*" to="/login" />
                </Switch >
                {/* </Fade> */}

            </Router >
        )
    }
}

