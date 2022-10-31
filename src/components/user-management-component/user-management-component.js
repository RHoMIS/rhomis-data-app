import React, { useState, useContext, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import axios from "axios";

import AuthContext from "../authentication-component/AuthContext";
import UserContext from "../user-info-component/UserContext";

import { Store } from "react-notifications-component";

import { useHistory, useParams } from "react-router-dom";

import { AiOutlineArrowLeft } from "react-icons/ai";

import { CheckForLocalToken } from "../fetching-context-info/fetching-context-info";

import MainCard from "../main-card-component/main-card-component";

function CheckProjectManager(props) {
  if (!props.data) {
    return false;
  }
  if (!props.data.user) {
    return false;
  }

  if (!props.data.user.roles) {
    return false;
  }

  if (!props.data.user.roles.projectManager) {
    return false;
  }

  if (props.data.user.roles.projectManager.includes(props.projectSelected)) {
    return true;
  }

  return false;
}

function BuildRequest(props) {
  // console.log(props)
  if (props.userType === "projectManager") {
    return {
      method: "post",
      url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/project-manager",
      headers: {
        Authorization: props.authToken,
      },
      data: {
        projectName: props.projectName,
        email: props.email,
      },
    };
  }
  if (props.userType === "dataCollector") {
    return {
      method: "post",
      url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/data-collector",
      headers: {
        Authorization: props.authToken,
      },
      data: {
        formName: props.formName,
        email: props.email,
      },
    };
  }

  if (props.userType === "analyst") {
    return {
      method: "post",
      url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/analyst",
      headers: {
        Authorization: props.authToken,
      },
      data: {
        formName: props.formName,
        email: props.email,
      },
    };
  }
}

async function AddFormUser(props) {
  let request = BuildRequest(props);

  try {
    const result = await axios(request);

    if (result.status === 200) {
      Store.addNotification({
        title: "Success",
        message: "User Added",
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

    return result;
  } catch (err) {
    // console.log(err)
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
    return err;
  }
}

function UserForm(props) {
  const [newUser, setNewUser] = useState();

  const [projectManagerEmail, setProjectManagerEmail] = useState();

  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  // console.log("User form props")
  // console.log(props)
  return (
    <>
      {props.projectManagerOfForm ? (
        <>
          <Card.Body>
            <Card>
              <Card.Header as="h5">Add Project Manager</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>User email</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        setProjectManagerEmail(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <Button
                    className="bg-dark text-white border-0 float-right"
                    style={{ marginTop: "10px" }}
                    onClick={async () => {
                      // console.log(props.projectSelected)
                      const result = await AddFormUser({
                        authToken: props.authToken,
                        email: projectManagerEmail,
                        projectName: props.projectSelected,
                        formName: null,
                        userType: "projectManager",
                      });
                      // console.log(result)
                    }}
                  >
                    Add Project Manager
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <br />
            <Card>
              <Card.Header as="h5">Add Form Level User</Card.Header>

              <Card.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>User email</Form.Label>
                    <Form.Control
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>User Role</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      defaultValue="Open this select menu"
                      onChange={(event) => {
                        setUserType(event.target.value);
                      }}
                    >
                      <option disabled={true}>Open this select menu</option>
                      <option value="dataCollector">
                        Data Collector: Can access training materials and
                        configure enumerator devices
                      </option>
                      <option value="analyst">
                        Data Analyst: Can download processed data
                      </option>
                    </Form.Select>
                  </Form.Group>

                  <Button
                    className="bg-dark text-white border-0 float-right"
                    style={{ marginTop: "10px" }}
                    onClick={async () => {
                      const result = await AddFormUser({
                        authToken: props.authToken,
                        email: email,
                        formName: props.formSelected,
                        userType: userType,
                      });
                    }}
                  >
                    Add User
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Card.Body>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default function UserManagementComponent() {
  const [projectManagerOfForm, setProjectManagerOfForm] = useState(false);

  const projectSelected = useParams().projectName;
  const formSelected = useParams().formName;

  const [adminData, setAdminData] = useContext(UserContext);
  const [authToken, setAuthToken] = useContext(AuthContext);

  const history = useHistory();

  // console.log("Admin data")
  // console.log(adminData)

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
    const projectManager = CheckProjectManager({
      data: adminData,
      projectSelected: projectSelected,
    });
    // console.log("project manager")
    // console.log(projectManager)
    setProjectManagerOfForm(projectManager);
  }, [authToken]);

  useEffect(() => {
    const projectManager = CheckProjectManager({
      data: adminData,
      projectSelected: projectSelected,
    });
    // console.log("project manager")
    // console.log(projectManager)
    setProjectManagerOfForm(projectManager);
  }, [adminData]);

  return (
    <>
      <MainCard
        CardTitle="User Management"
        filters={[projectSelected, formSelected]}
        history={history}
        back_link={"/projects/" + projectSelected}
        doc_extension="source/user-guide/navigating-the-app.html#user-management"
        CardBody={UserForm({
          projectSelected: projectSelected,
          formSelected: formSelected,
          projectManagerOfForm: projectManagerOfForm,
          authToken: authToken,
        })}
      />
    </>
  );
}
