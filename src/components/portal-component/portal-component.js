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

import React, { Component, useState, useEffect, useContext } from "react";
import { Form, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../authentication-component/AuthContext";
import { MdHelpOutline } from "react-icons/md";

import MainCard from "../main-card-component/main-card-component";

import axios from "axios";

import { Redirect, useHistory } from "react-router";

import { PortalDataAll } from "./portal-data";

import { CheckForLocalToken } from "../fetching-context-info/fetching-context-info";

import "./portal-component.css";
import "../../App.css";

async function FetchProjectInformation(authToken) {
  // Basic get request for metadata
  const response = await axios({
    method: "get",
    url: process.env.REACT_APP_AUTHENTICATOR_URL + "api/user/",
    headers: {
      Authorization: authToken,
    },
  });
  // console.log(response.data);

  return response.data;
}

function PortalCard(props) {
  const Icon = props.data.icon;
  const history = useHistory();

  if (props.data.external === false) {
    return (
      <div
        onClick={() => {
          history.push(props.data.link);
        }}
      >
        <Card
          key={"card-" + props.data.name}
          className="sub-card portal-card border-0"
        >
          <div
            key={"header-container-" + props.data.name}
            className="portal-card-header-container"
          >
            <h4
              key={"card-header-" + props.data.name}
              className="portal-card-header"
            >
              {props.data.name}
            </h4>
          </div>
          <div
            key={"icon-container-" + props.data.name}
            className="portal-icon-container"
          >
            <Icon size={100} color="white" />
          </div>
        </Card>
      </div>
    );
  }

  if ((props.data.external === true) & (props.data.label === "surveyBuilder")) {
    // console.log("Auth token");

    // console.log(props.authToken);
    return (
      <div>
        <form method="post" action={props.data.link} className="inline">
          <input type="hidden" name="token" value={props.authToken} />
          <input
            type="hidden"
            name="redirect_url"
            value="/admin/xlsform/create"
          />
          <button
            type="submit"
            style={{
              margin: 0,
              padding: 0,
              border: 0,
              backgroundColor: "white",
            }}
          >
            <Card
              key={"card-" + props.data.name}
              className="sub-card portal-card border-0"
            >
              <div
                key={"header-container-" + props.data.name}
                className="portal-card-header-container"
              >
                <h4
                  key={"card-header-" + props.data.name}
                  className="portal-card-header"
                >
                  {props.data.name}
                </h4>
              </div>
              <div
                key={"icon-container-" + props.data.name}
                className="portal-icon-container"
              >
                <Icon size={100} color="white" />
              </div>
            </Card>
          </button>
        </form>
      </div>
    );
  }

  if (props.data.name === "surveyBuilder") {
    return (
      <div>
        <form method="post" action={props.data.link} className="inline">
          <input type="hidden" name="token" value={props.authToken} />
          <input type="hidden" name="redirect_url" value="/admin/module" />
          <button
            type="submit"
            style={{
              margin: 0,
              padding: 0,
              border: 0,
              backgroundColor: "white",
            }}
          >
            <Card
              key={"card-" + props.data.name}
              className="sub-card portal-card border-0"
            >
              <div
                key={"header-container-" + props.data.name}
                className="portal-card-header-container"
              >
                <h4
                  key={"card-header-" + props.data.name}
                  className="portal-card-header"
                >
                  {props.data.name}
                </h4>
              </div>
              <div
                key={"icon-container-" + props.data.name}
                className="portal-icon-container"
              >
                <Icon size={100} color="white" />
              </div>
            </Card>
          </button>
        </form>
      </div>
    );
  }

  if ((props.data.external === true) & (props.data.label !== "surveyBuilder")) {
    return (
      <div>
        <a
          style={{ textDecoration: "none" }}
          href={props.data.link}
          target="_blank"
        >
          <Card className="sub-card portal-card border-0">
            <div className="portal-card-header-container">
              <h4 className="portal-card-header">{props.data.name}</h4>
            </div>
            <div className="portal-icon-container">
              <Icon size={100} color="white" />
            </div>
          </Card>
        </a>
      </div>
    );
  }
}

function RenderPortalCards(props) {
  const portalCardData = [];
  // console.log(props.data[0]);
  // console.log(props.userData);

  if (props.userData) {
    if (props.userData.basic === true) {
      const cardToAdd = props.data.filter(
        (item) => item.label === "surveyBuilder"
      );
      portalCardData.push(...cardToAdd);
    }
    if (props.userData.dataCollector.length > 0) {
      const cardToAdd = props.data.filter(
        (item) => item.label === "dataCollector"
      );
      portalCardData.push(...cardToAdd);
    }

    if (
      (props.userData.projectManager.length > 0) |
      (props.userData.analyst.length > 0)
    ) {
      const cardToAdd = props.data.filter(
        (item) => item.label === "projectManager"
      );
      portalCardData.push(...cardToAdd);
    }

    if (props.userData.administrator === true) {
      const cardToAdd = props.data.filter(
        (item) => item.label === "administrator"
      );
      portalCardData.push(...cardToAdd);
    }

    if (
      (props.userData.researcher.length > 0) |
      (props.userData.basic === true)
    ) {
      const cardToAdd = props.data.filter(
        (item) => item.label === "globalData"
      );
      portalCardData.push(...cardToAdd);
    }
    if (props.userData.basic === true) {
      const cardToAdd = props.data.filter((item) => item.label === "help");
      portalCardData.push(...cardToAdd);
    }
  }

  if (!props.userData) {
    portalCardData.push(props.data[0]);
  }

  return (
    <>
      {portalCardData.map((PortalItem) => {
        return (
          <PortalCard
            data={PortalItem}
            authToken={props.authToken}
            key={PortalItem.label}
          />
        );
      })}
    </>
  );
}

export default function PortalComponent() {
  const [userData, setUserData] = useState(null);
  const [useInfoAvail, setUserInfoAvail] = useState(false);
  const history = useHistory();
  const [authToken, setAuthToken] = useContext(AuthContext);

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
    const newUserData = await FetchProjectInformation(authToken);
    setUserData(newUserData);
    setUserInfoAvail(true);
  }, [authToken]);

  return (
    <MainCard
      CardTitle="Home"
      filters={[]}
      history={null}
      back_link={null}
      doc_extension="source/user-guide/first-time-user.html#rhomis-portal"
      CardBody={RenderPortalCards({
        data: PortalDataAll,
        userData: userData,
        authToken: authToken,
      })}
    ></MainCard>
  );
}
