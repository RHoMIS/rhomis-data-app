import React, { useContext, useState, useEffect } from 'react'
import { Container, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthContext from '../authentication-component/AuthContext';
import { MdOutlineMenu } from 'react-icons/md'

import axios from 'axios';

import './navigation-bar-component.css'
/*
Setting up a standard react navbar to navigation component. Please
note that if you want to maintain state or context between routes,
you must use the 'react-router-dom' "link". I have integrated
this with the Nav.Link component
*/


async function GetAdminData(props) {

    const result = await axios({
        method: 'get',
        url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/meta-data",
        headers: {
            'Authorization': props.authToken
        }
    })

    if (result.status === 200) {
        if (result.data.projects.length > 0) {
            props.setShowProjectManagement(true)
        }
        if (result.data.user.roles.administrator === true) {
            props.setShowAdmin(true)
        }
        if (result.data.user.roles.dataCollector.length > 0) {
            props.setShowCollectData(true)
        }
    }
    if (result.status === 400) {
        alert(result.data)
    }
}





export default function MainNavbar(props) {
    // props.Logout()
    const [authToken, setAuthToken] = useContext(AuthContext)
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = async () => setShow(true);
    const [showAdmin, setShowAdmin] = useState(false)
    const [showCollectData, setShowCollectData] = useState(false)
    const [showProjectManagement, setShowProjectManagement] = useState(false)

    useEffect(async () => {
        await GetAdminData({
            authToken: authToken,
            setShowAdmin: setShowAdmin,
            setShowCollectData: setShowCollectData,
            setShowProjectManagement: setShowProjectManagement,
        })

    }, [])




    return (
        <>
            <Navbar fixed="top" bg="dark" variant="dark" expand="false">
                {/* <Container fluid> */}

                <div className="menu-button" onClick={handleShow}><MdOutlineMenu className="menu-button-icon" size={30} /></div>
                <h2 style={{ "color": "white" }}>RHoMIS</h2>
                <Nav.Link className="logout-button" as={Link} to="/login" onClick={() => {
                    setAuthToken(null)
                    localStorage.clear()
                }} >Logout</Nav.Link>



                <Offcanvas
                    backdrop="true"
                    style={{ "background-color": "#212529", "width": "25%" }}
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                    show={show}
                    onHide={handleClose}

                >

                    <Offcanvas.Header closeVariant="white" closeButton style={{ "color": "white", "background-color": "#212529" }}>
                        <Offcanvas.Title id="offcanvasNavbarLabel"><h2 style={{ "padding-left": "20px" }}>Dashboard</h2></Offcanvas.Title>
                    </Offcanvas.Header>
                    <div className="side-bar-container">

                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/">Portal</Nav.Link>
                        </div>
                        <div className="side-bar-item">
                            <form style={{ "width": "100%" }} method="post" action={process.env.REACT_APP_SURVEY_BUILDER_URL} class="inline">
                                <input type="hidden" name="token" value={authToken} />
                                <input type="hidden" name="redirect_url" value="/admin/xlsform/create" />
                                <input className="form-link" type="submit" value="Build a Survey"
                                />
                            </form>
                        </div>

                        {showProjectManagement ? <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => { handleClose() }} to="/projects">Manage Projects</Nav.Link>
                        </div> : <></>}





                        {showAdmin ? <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} onClick={() => {
                                handleClose()

                            }} to="/administration">Administration</Nav.Link>
                        </div> : <></>}
                        <div className="side-bar-item">
                            <Nav.Link className="side-bar-link" as={Link} to="/login" onClick={() => {
                                setAuthToken(null)
                                localStorage.clear()
                            }} >Logout</Nav.Link>
                        </div>
                    </div>

                </Offcanvas>

            </Navbar >




        </>

    )
}

