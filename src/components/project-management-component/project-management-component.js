import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import UserContext from '../user-info-component/UserContext'
import './project-management-component.css'
import '../../App.css'


import { useHistory } from 'react-router'

import { AiOutlineArrowLeft } from 'react-icons/ai'

import QRCode from 'react-qr-code'
import { deflateSync } from 'zlib'

import { FetchUserInformation, CheckForLocalToken } from '../fetching-context-info/fetching-context-info'


function NoProjectFound() {

    return (
        <div>
            <Table striped bordered hover>
                <thead key="table-header">
                    <tr key="table-row-1">

                        <th key="table-head-item-1">Project Name</th>
                        <th key="table-head-item-2">Description</th>
                        <th key="table-head-item-3">Created at</th>


                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ "text-align": "center" }} colSpan={3}>No projects found</td>
                    </tr>

                </tbody>

            </Table>
        </div >
    )
}

function RenderProjectInformation(props) {

    const history = useHistory()
    console.log(props)
    if (!props.data) {
        return (<NoProjectFound />)


    }

    if (!props.data.projects) {
        return (<NoProjectFound />)
    }


    if (props.data.projects.length === 0) {
        return (<NoProjectFound />)
    }


    if (props.data.projects !== undefined) {
        return (
            <div>
                <Table striped bordered hover>
                    <thead key="table-header">
                        <tr key="table-row-1">
                            <th key="table-head-item-1">Project Name</th>
                            <th key="table-head-item-2">Description</th>
                            <th key="table-head-item-3">Created at</th>
                            <th key="table-head-item-4"></th>
                        </tr>
                    </thead>
                    <tbody key="table-body">
                        {props.data.projects.map((project, index) => {
                            let date = new Date(project.createdAt)
                            let dateString = date.toDateString()
                            return (
                                <tr key={"table-row-" + index}>

                                    <td style={{ "vertical-align": "middle" }} key={"table-row-" + index + "-item-1"}>{project.name}</td>
                                    <td style={{ "vertical-align": "middle" }} key={"table-row-" + index + "-item-2"}>{project.description}</td>
                                    <td style={{ "vertical-align": "middle" }} key={"table-row-" + index + "-item-3"}>{dateString}</td>
                                    <td style={{ "vertical-align": "middle" }} key={"table-row-" + index + "-item-4"}>
                                        <Button className="bg-dark text-white border-0" onClick={() => {
                                            history.push("/projects/" + project.name)
                                            // props.setProjectSelected(project.name)
                                            // const currentFilters = props.filters
                                            // currentFilters.push("Project: " + project.name)
                                            // props.setFilters(currentFilters)
                                            // props.setTitle("Select a Form")
                                        }}>
                                            Select
                                        </Button></td>
                                </tr>
                            )

                        })}

                    </tbody>
                </Table>
            </div>


        )
    }

}

function BackButton(props) {

    if (props.filters.length === 1) {
        props.setProjectSelected(false)
        props.setFilters([])
        props.setTitle("Select a Project")
    }

    if (props.filters.length === 2) {
        props.setFormSelected(false)
        const newFilters = props.filters[0]
        props.setFilters([newFilters])
        props.setTitle("Select a Form")

    }

}

export default function ProjectManagementComponent(props) {

    const history = useHistory()

    const [authToken, setAuthToken] = useContext(AuthContext)

    const [adminData, setAdminData] = useContext(UserContext)


    const [filters, setFilters] = useState([])

    const [title, setTitle] = useState("Select a Project")

    // const [projectName, setProjectName] = useState(null)

    const [projectSelected, setProjectSelected] = useState(false)
    const [formSelected, setFormSelected] = useState(false)

    useEffect(async () => {
        console.log("Effect running")
        await FetchUserInformation({
            authToken: authToken,
            setUserInfo: setAdminData
        })
    }, [])


    return (
        <div id="project-management-container" className="sub-page-container">

            <Card className="main-card border-0">
                <Card.Header className=" bg-dark text-white">
                    <div className="main-card-header-container">
                        <h3>{title}</h3>
                        <div style={{ "display": "flex", "flex-direction": "row", "margin-left": "auto" }} >
                            {/* Render the filters in the top of the card */}
                            {filters ? filters.map((filter) => {
                                return <div className="main-card-header-item">{filter}</div>
                            }) : ''}
                            {/* Render the refresh button if no  */}
                            {filters.length > 0 ?
                                <Button className="bg-dark border-0" onClick={() => {
                                    BackButton({
                                        setProjectSelected: setProjectSelected,
                                        setFilters: setFilters,
                                        filters: filters,
                                        setFormSelected: setFormSelected,
                                        setTitle: setTitle,

                                    })
                                }}>
                                    <AiOutlineArrowLeft size={25} />
                                </Button> :
                                <Button className="bg-dark border-0" onClick={() => {
                                    history.push("/")

                                }
                                }><AiOutlineArrowLeft size={25} /></Button>}
                        </div>
                    </div>


                </Card.Header>

                <Card.Body className="main-card-body">
                    <RenderProjectInformation data={adminData} setProjectSelected={setProjectSelected} filters={filters} setFilters={setFilters} setTitle={setTitle} />



                </Card.Body>
            </Card >
        </div >
    )
}
