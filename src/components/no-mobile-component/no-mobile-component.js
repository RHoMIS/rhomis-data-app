import React, { useState, useContext, useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import { FaUserCircle } from 'react-icons/fa'
import axios from 'axios'
import { useHistory } from 'react-router'

import {MdMobileOff} from 'react-icons/md'
import AuthContext from '../authentication-component/AuthContext';

import { Store } from 'react-notifications-component';

import './no-mobile-component.css'


export default function NoMobile(){


    return(
        <div className="child-no-mobile-container">
        <Card className="card-style border-0 no-mobile-card">
            <Card.Header className='bg-dark text-white'>
                Screen Width To Small
            </Card.Header>

            <Card.Body>
            <div className="icon-container">
            <MdMobileOff size={100}/>
            </div>
           
            <div style={{ textAlign: "center", width: "100%" }}>
                We have detected you are using a device with a narrow screen. This
                application is not designed for these types of devices, please try 
                to use a laptop or desktop if you have access to one.
                </div>
            </Card.Body>


        </Card>
        </div>
    )
}