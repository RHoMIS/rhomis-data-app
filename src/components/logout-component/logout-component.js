/**/

import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router'

import AuthContext from '../authentication-component/AuthContext';













function LogoutComponent(props) {

    let [authToken, setAuthToken] = useContext(AuthContext)
    let history = useHistory()
    useEffect(() => {
        setAuthToken(null)
        localStorage.clear()
        history.push('/login')

        // Store.addNotification({
        //     title: "Logging Out",
        //     message: "You have been logged out of this session",
        //     type: "danger",
        //     insert: "top",
        //     container: "top-right",
        //     animationIn: ["animate__animated", "animate__fadeIn"],
        //     animationOut: ["animate__animated", "animate__fadeOut"],
        //     dismiss: {
        //         duration: 3000
        //     }
        // });


    }, [])

    return (
        <>
        </>
    )
}

export {
    LogoutComponent,
}