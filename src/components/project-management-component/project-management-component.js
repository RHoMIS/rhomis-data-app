import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Card, Table } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../authentication-component/AuthContext";
import UserContext from "../user-info-component/UserContext";
import "./project-management-component.css";
import "../../App.css";

import { Store } from "react-notifications-component";
import Spinner from "react-bootstrap";

import MainCard from "../main-card-component/main-card-component";

import { useHistory } from "react-router";

import { AiOutlineArrowLeft } from "react-icons/ai";

import QRCode from "react-qr-code";
import { deflateSync } from "zlib";

import {
  FetchUserInformation,
  CheckForLocalToken,
} from "../fetching-context-info/fetching-context-info";

async function CreateProject(props) {
  props.setLoading(true);

  // console.log(props.projectName);
  // console.log(props.authToken);

  Store.addNotification({
    title: "Creating Project",
    type: "default",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 2000,
    },
  });
  try {
    const projectCreationResponse = await axios({
      method: "post",
      url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/projects/create",
      data: {
        name: props.projectName,
        description: props.projectDescription,
      },
      headers: {
        Authorization: props.authToken,
      },
    });

    if (projectCreationResponse.status === 200) {
      Store.addNotification({
        title: "Success",
        message: "Project Created",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
        },
      });
    }
    return projectCreationResponse;
  } catch (err) {
    // console.log(err.response);
    Store.addNotification({
      title: "Error",
      message: err.response.data,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2000,
      },
    });
  }

  // Create project

  props.setLoading(false);

  return;
}

function NoProjectFound(props) {
  return (
    <div>
      <Table style={{ width: "100%" }} striped bordered hover>
        <thead key="table-header">
          <tr key="table-row-1">
            <th key="table-head-item-1">Project Name</th>
            <th key="table-head-item-2">Description</th>
            <th key="table-head-item-3">Created at</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "center" }} colSpan={3}>
              No projects found
            </td>
          </tr>
        </tbody>
      </Table>

      <div style={{ display: "inline-grid", width: "100%" }}>
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          <Button
            type="submit"
            className="bg-dark border-0"
            onClick={async () => {
              await FetchUserInformation({
                authToken: props.authToken,
                setUserInfo: props.setAdminData,
              });
            }}
          >
            New Project
          </Button>
        </div>
      </div>
    </div>
  );
}

function RenderProjectInformation(props) {
  const history = useHistory();

  const [newProjectName, setNewProjectName] = useState();
  const [newProjectDescription, setNewProjectDescription] = useState();

  const [loading, setLoading] = useState(false);

  // console.log(props);
  if (!props.data) {
    return (
      <NoProjectFound
        authToken={props.authToken}
        setAdminData={props.setAdminData}
      />
    );
  }

  if (!props.data.projects) {
    return (
      <NoProjectFound
        authToken={props.authToken}
        setAdminData={props.setAdminData}
      />
    );
  }

  if (props.data.projects.length === 0) {
    return (
      <NoProjectFound
        authToken={props.authToken}
        setAdminData={props.setAdminData}
      />
    );
  }

  if (props.data.projects !== undefined) {
    return (
      <div style={{ width: "100%" }}>
        <Table style={{ width: "100%" }} striped bordered hover>
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
              let date = new Date(project.createdAt);
              let dateString = date.toDateString();
              return (
                <tr key={"table-row-" + index}>
                  <td
                    style={{ verticalAlign: "middle" }}
                    key={"table-row-" + index + "-item-1"}
                  >
                    {project.name}
                  </td>
                  <td
                    style={{ verticalAlign: "middle" }}
                    key={"table-row-" + index + "-item-2"}
                  >
                    {project.description}
                  </td>
                  <td
                    style={{ verticalAlign: "middle" }}
                    key={"table-row-" + index + "-item-3"}
                  >
                    {dateString}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                    key={"table-row-" + index + "-item-4"}
                  >
                    <Button
                      className="bg-dark text-white border-0"
                      onClick={() => {
                        history.push("/projects/" + project.name);
                      }}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div style={{ display: "inline-grid", width: "100%" }}>
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            <Form style={{ marginBottom: "10px", marginRight: 0 }}>
              <Form.Group>
                <Form.Label>
                  <strong>New Project Name</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="New Project"
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <strong>Project Description</strong>
                </Form.Label>
                <Form.Control
                  type="textarea"
                  placeholder="A short description..."
                  rows={3}
                  onChange={(e) => {
                    setNewProjectDescription(e.target.value);
                  }}
                />
              </Form.Group>
            </Form>
            <div style={{ display: "inline-grid", width: "100%" }}>
              <div style={{ marginLeft: "auto", marginRight: 0 }}>
                <Button
                  type="submit"
                  className="bg-dark border-0"
                  onClick={async () => {
                    await CreateProject({
                      authToken: props.authToken,
                      projectName: newProjectName,
                      projectDescription: newProjectDescription,
                      setLoading: setLoading,
                    });

                    setLoading(true);
                    await FetchUserInformation({
                      authToken: props.authToken,
                      setUserInfo: props.setAdminData,
                    });
                    setLoading(true);
                  }}
                >
                  Add Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default function ProjectManagementComponent(props) {
  const history = useHistory();

  const [authToken, setAuthToken] = useContext(AuthContext);

  const [adminData, setAdminData] = useContext(UserContext);

  const [projectSelected, setProjectSelected] = useState(false);
  useEffect(async () => {
    async function CheckLoggedIn() {
      const logged_in = await CheckForLocalToken({
        setAuthToken: setAuthToken,
      });
      if (logged_in == false) {
        history.push("/logout");
      }
    }

    CheckLoggedIn();
  }, []);

  useEffect(async () => {
    // console.log("Effect running");
    await FetchUserInformation({
      authToken: authToken,
      setUserInfo: setAdminData,
    });
  }, [authToken]);

  return (
    <>
      <MainCard
        CardTitle="Select a Project"
        filters={[]}
        history={history}
        back_link={"/"}
        doc_extension="source/user-guide/navigating-the-app.html#project-management"
        CardBody={RenderProjectInformation({
          data: adminData,
          setProjectSelected: setProjectSelected,
          authToken: authToken,
          setAdminData: setAdminData,
        })}
      ></MainCard>
    </>
  );
}
