import { useParams } from "react-router-dom";
import { FetchUserInformation } from "../fetching-context-info/fetching-context-info";
import { Spinner } from "react-bootstrap";

import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Table, DropdownButton, Dropdown } from "react-bootstrap";

import axios from "axios";
import AuthContext from "../authentication-component/AuthContext";
import UserContext from "../user-info-component/UserContext";
import "../project-management-component/project-management-component.css";
import "./form-management-component.css";
import "../../App.css";

import { useHistory } from "react-router";

import { AiOutlineArrowLeft } from "react-icons/ai";

import QRCode from "react-qr-code";
import { deflateSync } from "zlib";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

/*
 Format date so it appears correctly 
 */
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}

function NoInfoFound() {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Form Name</th>
          <th>Status</th>

          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={3}>Forms Not Found</td>
        </tr>
      </tbody>
    </Table>
  );
}

// Render the Submission Count
function SubmissionsCount(props) {
  let submissions = "";

  if (props.form === undefined) {
    return (
      <>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      </>
    );
  }
  if (props.form.submissions === undefined) {
    return (
      <>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      </>
    );
  }

  if (props.draftOrLive === "draft") {
    submissions = props.form.submissions.draft;
  }

  if (props.draftOrLive === "live") {
    submissions = props.form.submissions.live;
  }

  return (
    <>
      {props.submissionsLoading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        submissions
      )}
    </>
  );
}


async function FinalizeForm(props) {

  console.log("Finalizing form")
  console.log(props)
  const result = await axios({
      method: 'post',
      url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/forms/publish",
      headers: {
          'Authorization': props.authToken
      },
      params: {
          form_name: props.form,
          project_name: props.project
      }
  })
}

// Render the options button for each form
function FormOptions(props) {
  console.log("Form Options Props");
  console.log(props);

  let render_live = false;
  let render_draft = false;
  let edit_published = false;

  if (props.form == undefined) {
    return <></>;
  }

  if (props.form.submissions == undefined) {
    return <></>;
  }

  if (props.form.live === true) {
    render_live = true;
  }

  if (props.form.draft === true) {
    render_draft = true;
  }

  if ((props.form.draft === false) & (props.form.live === true)) {
    edit_published = true;
  }

  return (
    <>
      <DropdownButton
        title="Options"
        variant="dark"
        menuVariant="dark border-0"
        drop="end">
        {/* LIVE FORMS OPTIONS */}
        {render_live ? (
          <>
            <Dropdown.Header>Live Forms</Dropdown.Header>

            <Dropdown.Item
              className="dark text-white border-0"
              onClick={() => {
                props.history.push(
                  "/projects/" +
                    props.projectSelected +
                    "/forms/" +
                    props.form.name +
                    "/collect/live"
                );
              }}>
              Collect Data
            </Dropdown.Item>

            <form
              method="post"
              action={process.env.REACT_APP_SURVEY_BUILDER_URL}
              class="inline">
              <input type="hidden" name="token" value={props.authToken} />
              <input
                type="hidden"
                name="redirect_url"
                // New endpoint for survey builder

                value={"/xlsform/" + props.form.name + "/edit"}
              />

              {/* Edit Published Form */}

              {edit_published ? (
                <button type="submit" value="submit" className="form-button">
                  Create New Draft
                </button>
              ) : (
                <></>
              )}
            </form>

            {props.form.submissions.live > 0 ? (
              <Dropdown.Item
                className="dark text-white border-0"
                onClick={() => {
                  props.history.push(
                    "/projects/" +
                      props.projectSelected +
                      "/forms/" +
                      props.form.name +
                      "/data"
                  );
                }}>
                Access Data
              </Dropdown.Item>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {render_draft ? (
          <>
            <Dropdown.Header>Draft Forms</Dropdown.Header>

            <Dropdown.Item
              className="dark text-white border-0"
              onClick={() => {
                props.history.push(
                  "/projects/" +
                    props.projectSelected +
                    "/forms/" +
                    props.form.name +
                    "/collect/draft"
                );
              }}>
              Test Survey
            </Dropdown.Item>
            <form
              method="post"
              action={process.env.REACT_APP_SURVEY_BUILDER_URL}
              class="inline">
              <input type="hidden" name="token" value={props.authToken} />
              <input
                type="hidden"
                name="redirect_url"
                value={"/xlsform/" + props.form.name + "/edit"}
              />
              <button type="submit" value="submit" className="form-button">
                Edit Draft
              </button>
            </form>

            <DropdownItem>Finalise</DropdownItem>
          </>
        ) : (
          <></>
        )}
        <Dropdown.Header>Settings</Dropdown.Header>

        <Dropdown.Item
          className="dark text-white border-0"
          onClick={() => {
            props.history.push(
              "/projects/" +
                props.projectSelected +
                "/forms/" +
                props.form.name +
                "/users"
            );
          }}>
          Manage Users
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
}

// A table for all of the
// forms
function FormTables(props) {
  const history = useHistory();

  // Don't allow users to finalize from this table
  let allowToFinalize = false;

  // Checking whether or not
  // the component is has all of the
  // form data needed for the table
  if (!props.data) {
    return <NoInfoFound />;
  }
  if (!props.data.user) {
    return <NoInfoFound />;
  }
  if (!props.data.user.roles) {
    return <NoInfoFound />;
  }
  if (props.data.user.roles.projectManager !== undefined) {
    if (props.data.user.roles.projectManager.includes(props.projectSelected))
      allowToFinalize = true;
  }

  // Filtering through the forms based on
  // URL parameters. Passed through props.
  let formsExist = false;

  if (props.data.forms !== undefined) {
    if (props.data.forms.length > 0) {
      let formsForProject = props.data.forms.filter(
        (form) => form.project === props.projectSelected
      );
      formsExist = formsForProject.length > 0;
    }
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Form Name</th>
          <th>Draft Version</th>
          <th>Draft Submissions</th>

          <th>Live Version</th>
          <th>Live Submissions</th>

          <th></th>
        </tr>
      </thead>
      <tbody>
        {formsExist ? (
          props.data.forms.map((form) => {
            // let date = new Date(form.createdAt)
            let dateString = formatDate(form.createdAt);
            if (form.project === props.projectSelected) {
              let disableButton = true;

              let accessData = false;

              if (allowToFinalize === false) {
                disableButton = false;
              }

              if (form.draft) {
                disableButton = false;
              }

              if (form.submissions > 0) {
                accessData = true;
              }

              return (
                <tr>
                  <td style={{ "vertical-align": "middle" }}>{form.name}</td>
                  <td style={{ "vertical-align": "middle" }}>
                    {form.draft ? form.draftVersion : ""}
                  </td>
                  <td style={{ "vertical-align": "middle" }}>
                    <SubmissionsCount
                      submissionsLoading={props.submissionsLoading}
                      form={form}
                      draftOrLive="draft"
                    />
                  </td>

                  <td style={{ "vertical-align": "middle" }}>
                    {form.live ? form.liveVersion : ""}
                  </td>

                  <td style={{ "vertical-align": "middle" }}>
                    <SubmissionsCount
                      submissionsLoading={props.submissionsLoading}
                      form={form}
                      draftOrLive="live"
                    />
                  </td>

                  <td style={{ "text-align": "center" }}>
                    <FormOptions
                      history={history}
                      form={form}
                      projectSelected={props.projectSelected}
                      authToken={props.authToken}
                      accessData={accessData}
                    />
                  </td>
                </tr>
              );
            }
          })
        ) : (
          <>
            <tr>
              <td style={{ "text-align": "center" }} colSpan={5}>
                No forms created yet
              </td>
            </tr>
          </>
        )}
        {/* <tr><td style={{ "text-align": "center" }} colSpan={5}><a href="https://rhomis-survey.stats4sdtest.online"><Button >Start Creating a Survey</Button></a></td></tr></>} */}
      </tbody>
    </Table>
  );
}

function RenderProjectAdmin(props) {
  let renderUserForm = false;

  const [newUser, setNewUser] = useState("");

  if (!props.data) {
    return <NoInfoFound />;
  }
  if (!props.data.user) {
    return <NoInfoFound />;
  }
  if (!props.data.user.roles) {
    return <NoInfoFound />;
  }

  if (props.data.user.roles.projectManager !== undefined) {
    if (props.data.user.roles.projectManager.includes(props.projectSelected))
      renderUserForm = true;
  }

  return (
    <>
      <Card className="project-management-card">
        <Card.Header as="h5">Select a Form</Card.Header>
        <Card.Body>
          {/* <Card.Title>Special title treatment</Card.Title> */}
          <FormTables
            submissionsLoading={props.submissionsLoading}
            projectSelected={props.projectSelected}
            authToken={props.authToken}
            setAdminData={props.setAdminData}
            data={props.data}
            filters={props.filters}
            setFilters={props.setFilters}
            setFormSelected={props.setFormSelected}
          />
        </Card.Body>
      </Card>
    </>
  );
}

function FormManagementComponent() {
  // const { projectName } = useParams()

  const history = useHistory();
  const projectSelected = useParams().projectName;
  const [authToken, setAuthToken] = useContext(AuthContext);
  const [adminData, setAdminData] = useContext(UserContext);

  const [submissionsLoading, setSubmissionLoading] = useState(true);

  const [formData, setFormData] = useState();

  console.log("admin data");
  console.log(adminData);

  const [formSelected, setFormSelected] = useState(null);
  const [filters, setFilters] = useState(null);
  const data = null;

  useEffect(() => {
    console.log("projectSelected:  " + projectSelected);

    async function GetUserInfo() {
      await FetchUserInformation({
        authToken: authToken,
        setUserInfo: setAdminData,
        getSubmissionCount: true,
        projectName: projectSelected,
      });

      setSubmissionLoading(false);
    }

    GetUserInfo();
  }, []);

  return (
    <div id="project-management-container" className="sub-page-container">
      <Card className="main-card border-0">
        <Card.Header className=" bg-dark text-white">
          <div className="main-card-header-container">
            <h3>Form Overview</h3>
            <div
              style={{
                display: "flex",
                "flex-direction": "row",
                "margin-left": "auto",
              }}>
              <div className="main-card-header-item">{projectSelected}</div>
              <Button
                className="bg-dark border-0"
                onClick={() => {
                  history.push("/projects");
                }}>
                <AiOutlineArrowLeft size={25} />
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="main-card-body">
          <RenderProjectAdmin
            authToken={authToken}
            projectSelected={projectSelected}
            formSelected={formSelected}
            setAdminData={setAdminData}
            data={adminData}
            setFormSelected={setFormSelected}
            filters={filters}
            setFilters={setFilters}
            submissionsLoading={submissionsLoading}
          />
        </Card.Body>
      </Card>
    </div>
  );
}

export default FormManagementComponent;
