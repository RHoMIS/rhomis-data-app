import React, { useState, useContext, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";

import AuthContext from "../authentication-component/AuthContext";
import UserContext from "../user-info-component/UserContext";

import {
  GetInformationForFormComponent,
  Set,
  CheckForLocalToken,
} from "../fetching-context-info/fetching-context-info";

import { FetchUserInformation } from "../fetching-context-info/fetching-context-info";
import { AiOutlineArrowLeft } from "react-icons/ai";

import QRCode from "react-qr-code";
import { deflateSync } from "zlib";

import axios from "axios";

import MainCard from "../main-card-component/main-card-component";

async function ProcessData(props) {
  // console.log(props);
  const form = props.data.forms.filter(
    (item) =>
      item.name === props.formSelected && item.project === props.projectSelected
  )[0];
  const result = await axios({
    method: "post",
    url: process.env.REACT_APP_API_URL + "api/process-data",
    headers: {
      Authorization: props.authToken,
    },
    data: {
      commandType: props.commandType,
      projectName: props.projectSelected,
      formName: props.formSelected,
      formVersion: form.formVersion,
      draft: props.draft,
    },
  });
  return result;
}

function SetInitialFormState(props) {
  // Check if the form code in the URL is correct
  function CheckFormCode(props) {
    if (!props.data) {
      return false;
    }
    if (!props.data.forms) {
      return false;
    }
    let form = props.data.forms.filter(
      (item) =>
        (item.name === props.formSelected) &
        (item.project === props.projectSelected)
    );
    if (form.length === 1) {
      return true;
    }
    return false;
  }

  // Check if the user is a project manager
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

  // Check if the ODK configuration details are included
  function CheckODKConf(props) {
    if (!props.data) {
      return false;
    }

    if (!props.data.forms) {
      return false;
    }
    let form = props.data.forms.filter(
      (item) =>
        item.name === props.formSelected &&
        item.project === props.projectSelected
    );
    if (form.length !== 1) {
      return false;
    }

    if ((form[0].draft === true) & (props.draftOrLive === "draft")) {
      return form[0].draftCollectionDetails;
    }
    if ((form[0].live === true) & (props.draftOrLive === "live")) {
      return form[0].collectionDetails;
    }

    return false;
  }

  // Check if the encoded ODK settings exist
  function CheckEncodedSettings(props) {
    if (!props.data) {
      return false;
    }

    if (!props.data.forms) {
      return false;
    }
    let form = props.data.forms.filter(
      (item) =>
        item.name === props.formSelected &&
        item.project === props.projectSelected
    );

    if (form.length !== 1) {
      return false;
    }

    if (props.draftOrLive === "draft") {
      let odkConf = form[0].draftCollectionDetails;
      return deflateSync(JSON.stringify(odkConf)).toString("base64");
    }
    if (props.draftOrLive === "live") {
      let odkConf = form[0].collectionDetails;
      return deflateSync(JSON.stringify(odkConf)).toString("base64");
    }

    return false;
  }

  // Check if a code for the form should be rendered

  const renderODKFormCode = CheckFormCode({
    data: props.data,
    formSelected: props.formSelected,
    projectSelected: props.projectSelected,
    draftOrLive: props.draftOrLive,
  });

  const projectManagerOfForm = CheckProjectManager({
    data: props.data,
    projectSelected: props.projectSelected,
  });

  const odkConf = CheckODKConf({
    data: props.data,
    projectSelected: props.projectSelected,
    formSelected: props.formSelected,
    draftOrLive: props.draftOrLive,
  });

  const encoded_settings = CheckEncodedSettings({
    data: props.data,
    projectSelected: props.projectSelected,
    formSelected: props.formSelected,
    draftOrLive: props.draftOrLive,
  });
  // console.log("odkConf");

  // console.log(odkConf);

  let draft = false;
  let live = false;
  if (props.draftOrLive == "draft") {
    draft = true;
  }
  if (props.draftOrLive == "live") {
    live = true;
  }

  // Need to add data collecter as an option
  const stateToReturn = {
    renderODKFormCode: renderODKFormCode,
    projectManagerOfForm: projectManagerOfForm,
    odkConf: odkConf,
    encoded_settings: encoded_settings,
    draft: draft,
    live: live,
  };
  return stateToReturn;
}

function CardBody(props) {
  // console.log("Card body props");
  // console.log(props);

  const [formEditURL, setFormEditURL] = useState("");

  useEffect(() => {
    setFormEditURL("/xlsform/" + props.formSelected + "/edit");
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <p>
        <a href="https://docs.getodk.org/collect-install/" target="_blank">
          1. Install ODK
        </a>
      </p>
      <p>2. Open the ODK app</p>
      <p>3. Scan this QR code</p>
      {props.formState.encoded_settings ? (
        <QRCode value={props.formState.encoded_settings} />
      ) : (
        <Spinner
          as="span"
          animation="border"
          size="100px"
          role="status"
          aria-hidden="true"
        />
      )}

      {props.formState.draft ? (
        <div style={{ marginTop: "20px" }}>
          {/* <Button className="bg-dark border-0" style={{ "margin": "10px" }}
                        onClick={async () => {
                            await ProcessData({
                                commandType: "generate",
                                draft: props.formState.draft,
                                authToken: props.authToken,
                                data: props.data,
                                formSelected: props.formSelected,
                                projectSelected: props.projectSelected
                            })
                            // console.log("Finished Generating Data")
                        }}

                    >Generate Mock Submissions</Button> */}
          *Your form is currently saved as a draft. Draft submissions you make
          will be removed once the form is finalised.*
        </div>
      ) : (
        <></>
      )}

      <div style={{ marginTop: "20px" }}>
        <form
          method="post"
          action={process.env.REACT_APP_SURVEY_BUILDER_URL}
          className="inline"
        >
          <input type="hidden" name="token" value={props.authToken} />
          <input type="hidden" name="redirect_url" value={formEditURL} />
          <Button
            variant="dark"
            style={{ verticalAlign: "center" }}
            type="submit"
            value="submit"
          >
            {props.formState.draft ? "Edit Draft" : "Create New Draft"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function DataCollectionComponent() {
  const projectSelected = useParams().projectName;
  const formSelected = useParams().formName;
  const draftOrLive = useParams().draftOrLive;

  const [renderInstallCode, setRenderInstallCode] = useState(false);
  const [renderODKFormCode, setRenderODKFormCode] = useState(true);

  const [authToken, setAuthToken] = useContext(AuthContext);
  const [adminData, setAdminData] = useContext(UserContext);

  const history = useHistory();

  const [initialState, setInitialState] = useState({
    renderODKFormCode: false,
    projectManagerOfForm: false,
    dataAnalystOfForm: false,
    odkConf: false,
    encoded_settings: false,
    draft: false,
    live: false,
    data: {
      forms: [],
      users: [],
      projects: [],
    },
  });

  useEffect(() => {
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
    async function FetchUserInfo() {
      await FetchUserInformation({
        authToken: authToken,
        setUserInfo: setAdminData,
      });
    }

    FetchUserInfo();
  }, [authToken]);

  useEffect(() => {
    const new_form_state = SetInitialFormState({
      data: adminData,
      formSelected: formSelected,
      projectSelected: projectSelected,
      draftOrLive: draftOrLive,
    });

    // console.log("Setting initial state");
    // console.log(new_form_state);
    // console.log(adminData);

    setInitialState(new_form_state);
  }, [adminData]);

  return (
    <MainCard
      CardTitle="Collect Data"
      filters={[projectSelected, formSelected]}
      history={history}
      back_link={"/projects/" + projectSelected}
      doc_extension="source/user-guide/navigating-the-app.html#data-collection"
      CardBody={CardBody({
        formState: initialState,
        data: adminData,
        authToken: authToken,
        formSelected: formSelected,
        projectSelected: projectSelected,
      })}
    ></MainCard>
  );
}
