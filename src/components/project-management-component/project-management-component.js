import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Card, Table } from 'react-bootstrap'
import axios from 'axios'
import AuthContext from '../authentication-component/AuthContext'
import UserContext from '../user-info-component/UserContext'
import './project-management-component.css'
import '../../App.css'

import MainCard from '../main-card-component/main-card-component'

import { useHistory } from 'react-router'

import { AiOutlineArrowLeft } from 'react-icons/ai'

import QRCode from 'react-qr-code'
import { deflateSync } from 'zlib'

import { FetchUserInformation, CheckForLocalToken } from '../fetching-context-info/fetching-context-info'


function NoProjectFound() {

    return (
        <div>
            <Table style={{"width":'100%'}} striped bordered hover>
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

            <div style={{ display: "inline-grid", width: "100%" }}>
                <div style={{ marginLeft: "auto", marginRight: 0 }}>
                    <a href={process.env.REACT_APP_SURVEY_BUILDER_URL}>
                <Button className='bg-dark border-0'>New Project</Button>
                </a>
                </div>
                </div>
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
            <div style={{"width":'100%'}}>
                <Table style={{"width":'100%'}} striped bordered hover>
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
                                    <td style={{ "vertical-align": "middle", 'text-align': 'center'}} key={"table-row-" + index + "-item-4"}>
                                        <Button className="bg-dark text-white border-0" onClick={() => {
                                            history.push("/projects/" + project.name)
                                            
                                        }}>
                                            Select
                                        </Button></td>
                                </tr>
                            )

                        })}

                    </tbody>
                </Table>
                <div style={{ display: "inline-grid", width: "100%" }}>
                <div style={{ marginLeft: "auto", marginRight: 0 }}>
                    <a href={process.env.REACT_APP_SURVEY_BUILDER_URL}>
                <Button className='bg-dark border-0'>New Project</Button>
                </a>
                </div>
                </div>

            </div>


        )
    }

}



export default function ProjectManagementComponent(props) {

    const history = useHistory()

    const [authToken, setAuthToken] = useContext(AuthContext)

    const [adminData, setAdminData] = useContext(UserContext)


    const [projectSelected, setProjectSelected] = useState(false)
    useEffect(async () => {
        async function CheckLoggedIn(){
            const logged_in = await CheckForLocalToken({
              setAuthToken: setAuthToken
            }
            )
            if (logged_in==false){
              history.push("/logout")
            }
          }
      
          CheckLoggedIn()
        
    }, [])

    useEffect(async () => {
        console.log("Effect running")
        await FetchUserInformation({
            authToken: authToken,
            setUserInfo: setAdminData
        })
    },[authToken])


 


    return (
        <>

<MainCard
    
    CardTitle="Select a Project"
    filters={[]}
    history={history}
    back_link={"/"}
    doc_extension="source/user-guide/navigating-the-app.html#project-management"

    CardBody={
        RenderProjectInformation({data:adminData, setProjectSelected:setProjectSelected})
     }    
    >
    </MainCard>
        
        </>
    )
}
