import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Button,
  Nav,
  Accordion,
  Table,
  Spinner,
  Form,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti";
import { useParams, useHistory } from "react-router-dom";

import AuthContext from "../authentication-component/AuthContext";
import UserContext from "../user-info-component/UserContext";

import {
  FetchUserInformation,
  CheckForLocalToken,
} from "../fetching-context-info/fetching-context-info";

import { GetInformationForFormComponent } from "../fetching-context-info/fetching-context-info";

import axios from "axios";

import { Store } from "react-notifications-component";
import { style } from "@mui/system";

import MainCard from "../main-card-component/main-card-component";

import "./data-access-component.css";

// ***************** MAIN RENDER COMPONENT **************** //
function RenderDataCard(props) {
  return (
    <>
      {props.showRawData ? <RenderRawDataCard {...props} /> : <></>}

      {props.showUnits ? <RenderUnitsForm {...props} /> : <></>}
      {props.showPrices ? (
        <RenderPriceAndCalorieConversions {...props} />
      ) : (
        <></>
      )}
      {props.showOutputs ? <RenderFinalOutputs {...props} /> : <></>}
    </>
  );
}

// **************** Render sub-components **************** //
function RenderRawDataCard(props) {
  var [rawData, setRawData] = useState();
  var [dataDownload, setDataDownloadLink] = useState();

  let background_color = "#4B5320";
  let text_color = "white";
  let show_tick = true;

  useEffect(() => {
    // console.log("Raw data props");

    // console.log(props);
    async function FetchRawData() {
      const NewRawUnitsData = await FetchData({
        authToken: props.authToken,
        dataType: "rawData",
        projectID: props.projectSelected,
        formID: props.formSelected,
        unit: false,
        data: true,
      });

      setRawData(NewRawUnitsData);
    }

    FetchRawData();
  }, []);

  useEffect(() => {
    if (rawData) {
      // console.log(rawData);
      const raw_data_download_link = generateDataDownloadLink(
        rawData,
        dataDownload
      );
      setDataDownloadLink(raw_data_download_link);
    }
  }, [rawData]);

  return (
    <Card style={{ marginTop: "30px", width: "100%" }}>
      <Card.Header
        style={{ backgroundColor: background_color, color: text_color }}
      >
        Raw Survey Responses
      </Card.Header>
      <Card.Body>
        Download the raw data from your survey. If you have collected more
        responses since last time you visited, click refresh to fetch new
        responses. You can also recalculate indicators for all of these
        responses, by going through each of the steps below
        <div style={{ display: "inline-grid", width: "100%" }}>
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            <>
              <Button
                style={{ margin: "2px" }}
                className="bg-dark border-0"
                onClick={async () => {
                  props.setLoading(true);
                  await ProcessData({
                    commandType: "raw-data",
                    formSelected: props.formSelected,
                    projectSelected: props.projectSelected,
                    process_label: "Raw Data and Unit Extraction",
                    data: props.userInfo,
                    authToken: props.authToken,
                  });

                  await GetInformationForFormComponent({
                    setAuthToken: props.setAuthToken,
                    authToken: props.authToken,
                    setUserInfo: props.setUserInfo,
                    projectName: props.projectSelected,
                    formName: props.formSelected,
                    setFormData: props.setFormData,
                    setShowRawData: props.setShowRawData,
                    setUserInfo: props.setUserInfo,
                  });
                  props.setLoading(false);
                }}
              >
                Refresh
              </Button>
              <a
                // Name of the file to download
                download={
                  props.projectSelected +
                  "_" +
                  props.formSelected +
                  "_" +
                  "raw_data.csv"
                }
                // link to the download URL
                href={dataDownload}
              >
                <Button style={{ margin: "2px" }} className="bg-dark border-0">
                  Download
                </Button>
              </a>

              <Button
                style={{ margin: "2px" }}
                className="bg-dark border-0"
                onClick={async () => {
                  props.setLoading(true);
                  await ProcessData({
                    commandType: "units",
                    formSelected: props.formSelected,
                    projectSelected: props.projectSelected,
                    process_label: "Extracting Units",
                    data: props.userInfo,
                    authToken: props.authToken,
                  });

                  await GetInformationForFormComponent({
                    setAuthToken: props.setAuthToken,
                    authToken: props.authToken,
                    setUserInfo: props.setUserInfo,
                    projectName: props.projectSelected,
                    formName: props.formSelected,
                    setFormData: props.setFormData,
                    setShowRawData: props.setShowRawData,
                    setUserInfo: props.setUserInfo,
                  });
                  props.setLoading(false);
                }}
              >
                Extract Units
              </Button>
            </>
          </div>
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            Last Updated: {props.formData.time_updated.rawDataExtracted}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function RenderUnitsForm(props) {
  let background_color = "";
  let text_color = "black";
  let show_tick = false;
  if (props.showPrices === true) {
    background_color = "#4B5320";
    text_color = "white";
    show_tick = true;
  }

  return (
    <Card style={{ marginTop: "30px", width: "100%" }}>
      <Card.Header
        style={{ backgroundColor: background_color, color: text_color }}
      >
        {show_tick ? (
          <>
            <TiTickOutline /> Units and Data Cleaning (Completed)
          </>
        ) : (
          "Units and Data Cleaning"
        )}
      </Card.Header>
      <Card.Body>
        Here you can provide conversion factors for any values which were
        recorded in the survey The units you enter here will be used to
        calculate key indicators, such as crop yield, amounts of livestock
        products produced, and amounts of inputs used. You can also correct any
        mispelt livestock or crop names
        <br />
        <br />
        Go through each table individually and convert units where you can. When
        you have converted all the units in one table click "Submit". When you
        have converted all of the units tick the confirmation box below and you
        will proceed to the next step in the calculations.
        <br />
        <br />
        For more information on converting units, click{" "}
        <a
          href={process.env.REACT_APP_DOCS + props.doc_extension}
          target="_blank"
        >
          here
        </a>
        <br />
        <br />
        <ShowUnitsForm
          {...props}
          formType="units"
          formLabel="Select the type of unit"
          checkBoxLabel="I confirm that I have verified and submitted all units, proceed to (re)calculate product prices"
          submissionLabel="Calculate Prices"
          commandType="prices"
          processLabel="Price Calculations"
          updatedTime={props.formData.time_updated.unitsExtracted}
        />
      </Card.Body>
    </Card>
  );
}

function RenderPriceAndCalorieConversions(props) {
  let background_color = "";
  let text_color = "black";
  let show_tick = false;
  if (props.showOutputs === true) {
    background_color = "#4B5320";
    text_color = "white";
    show_tick = true;
  }

  return (
    <Card style={{ marginTop: "30px", width: "100%" }}>
      <Card.Header
        style={{ backgroundColor: background_color, color: text_color }}
      >
        {show_tick ? (
          <>
            <TiTickOutline /> Prices and Calorie Conversion Verification
            (Completed){" "}
          </>
        ) : (
          "Prices and Calorie Conversion Verification"
        )}
      </Card.Header>
      <Card.Body>
        In the previous step you tidied crop and livestock names. You also
        provided numeric conversion factors for units. These were used these to
        identify which crops and livestock to calculate indicators for.
        <br />
        <br />
        We have estimated prices and calorie conversions for crops and livestock
        in this survey. Here you can verify them, these estimates will be used
        when calculating final indicators.
        <br />
        <br />
        Again, go through each table individually and convert units where you
        can. When you have converted all values in one table click "Submit".
        When you have converted all of tables, tick the confirmation box below
        and you will proceed to calculate final indicators.
        <br />
        <br />
        For more information on converting prices and calories, click{" "}
        <a
          href={process.env.REACT_APP_DOCS + props.doc_extension}
          target="_blank"
        >
          here
        </a>
        <br />
        <br />
        <ShowUnitsForm
          {...props}
          formType="prices"
          formLabel="Select the price/calorie conversion"
          checkBoxLabel="I confirm that I have verified and submitted all price and calorie conversions, proceed to (re)calculate RHoMIS indicators"
          submissionLabel="Calculate Indicators"
          commandType="indicators"
          processLabel="Indicator Calculations"
          updatedTime={props.formData.time_updated.pricesCalculated}
        />
      </Card.Body>
    </Card>
  );
}

function RenderFinalOutputs(props) {
  const [rhomisDataSelect, setRHoMISSelect] = useState(null);
  const [rhomisData, setRHoMISData] = useState(null);
  const [dataDownloadLink, setDataDownloadLink] = useState("");
  const [buttonLoading, setButtonLoading] = useState(true);
  let background_color = "#4B5320";
  let text_color = "white";

  useEffect(() => {
    async function RetrieveZipData() {
      await RetrieveZipFile({
        projectID: props.projectSelected,
        formID: props.formSelected,
        setButtonLoading: setButtonLoading,
        authToken: props.authToken,
        dataDownloadLink: dataDownloadLink,
        setDataDownloadLink: setDataDownloadLink,
      });

      setButtonLoading(false);
    }

    RetrieveZipData();
  }, []);

  return (
    <Card style={{ marginTop: "30px", width: "100%" }}>
      <Card.Header
        style={{ backgroundColor: background_color, color: text_color }}
      >
        Final Outputs
      </Card.Header>

      <Card.Body>
        You can now access all results for this survey by clicking the button
        below.
        <br />
        <br />
        The results in this bulk download include:
        <ul>
          <li>
            <strong>Documentation</strong>
          </li>
          <li>
            <strong>The most recent survey draft</strong>
          </li>
          <li>
            <strong>Indicator Data</strong>
          </li>
          <li>
            <strong>Processed Data</strong>
          </li>
          <li>
            <strong>Reformatted Outputs</strong>
          </li>
        </ul>
        <br />
        More details about the outputs will be included in the bulk-download
        folder, in a <strong>README.txt </strong>
        file.
        <div style={{ display: "inline-grid", width: "100%" }}>
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            {/* {!buttonLoading?<Button onClick={async ()=>{
          RetrieveZipFile({
            projectID:props.projectSelected,
            formID:props.formSelected,
            setButtonLoading:setButtonLoading,
            authToken:props.authToken,
            dataDownloadLink: dataDownloadLink,
            setDataDownloadLink: setDataDownloadLink
          })
        }}>Download Data</Button>:
        <Button disabled={true}><Spinner/></Button>} */}

            {buttonLoading ? (
              <Spinner></Spinner>
            ) : (
              <a
                // Name of the file to download
                download={
                  props.projectSelected + "_" + props.formSelected + ".zip"
                }
                // link to the download URL
                href={dataDownloadLink}
              >
                <Button style={{ margin: "2px" }} className="bg-dark border-0">
                  Download Results
                </Button>
              </a>
            )}
          </div>
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            Last Updated: {props.formData.time_updated.finalIndicators}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function RenderConversionTable(props) {
  // whenever the

  return (
    <div className="table-div">
      <Table className="units-table">
        <thead>
          <tr key="row_1">
            <th>Survey Value</th>
            <th>Conversion</th>
          </tr>
        </thead>
        <tbody>
          {props.unitsData.map((unit) => {
            return (
              <tr
                key={"unit-row-" + unit.survey_value + unit.id_rhomis_dataset}
              >
                <td
                  style={{ verticalAlign: "middle" }}
                  key={
                    "unit-row-" +
                    unit.survey_value +
                    "-survey-value-" +
                    unit.id_rhomis_dataset
                  }
                >
                  {unit.survey_value}
                </td>

                <td
                  style={{ verticalAlign: "middle" }}
                  key={
                    "unit-row-" +
                    unit.survey_value +
                    "-conversion-" +
                    unit.id_rhomis_dataset
                  }
                >
                  <form>
                    <input
                      className="form-control"
                      type="text"
                      defaultValue={unit.conversion}
                      onChange={(event) => {
                        UpdateUnitsData({
                          ...props,
                          update: event.target.value,
                          unit: unit,
                        });
                      }}
                    />
                  </form>{" "}
                </td>
                {/* <td key={"unit-row-"+unit.survey_value+"-survey-value"}>{unit.conversion}</td> */}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

function RenderSpinner() {
  return (
    <>
      <Spinner
        as="span"
        animation="border"
        style={{ marginTop: "4em", width: "4rem", height: "4rem" }}
        role="status"
        aria-hidden="true"
      />
    </>
  );
}

// *********** METHODS ************** //

async function FetchData(props) {
  // Basic post request, fetching information by:
  //dataType: type of data we are looking for (e.g. indicator data),

  const response = await axios({
    method: "post",
    url: process.env.REACT_APP_API_URL + "api/data",
    data: {
      dataType: props.dataType,
      projectID: props.projectID,
      formID: props.formID,
      unit: props.unit,
      data: props.data,
    },
    headers: {
      Authorization: props.authToken,
    },
  });

  // If the response is null return null
  // Otherwise return the dataset.
  var data = response.data;
  if (data === null) {
    return null;
  } else {
    return data;
  }
}

function UpdateUnitsData(props) {
  console.log("UPDATE UNIT DATA");
  console.log(props);

  let changing_units = props.unitsData;

  let index = changing_units.findIndex((elem) => {
    if (
      elem.unit_type === props.unit.unit_type &&
      elem.survey_value === props.unit.survey_value &&
      elem.id_rhomis_dataset === props.unit.id_rhomis_dataset
    ) {
      return true;
    }
  });
  // console.log(index);

  changing_units[index].conversion = props.update;

  console.log(changing_units);
  props.setUnitsData(changing_units);
}

async function SubmitUnitsData(props) {
  // console.log(props.unitsData);

  try {
    const result = await axios({
      method: "post",
      url: process.env.REACT_APP_API_URL + "api/conversions",
      headers: {
        Authorization: props.authToken,
      },
      data: {
        projectSelected: props.projectSelected,
        formSelected: props.formSelected,
        unitType: props.unitsSelect,
        unitsData: props.unitsData,
      },
    });

    if (result.status === 200) {
      Store.addNotification({
        title: "Success",
        message: props.process_label + " Completed",
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
}

function ShowUnitsForm(props) {
  const [unitsSelect, setUnitsSelect] = useState(null);
  const [unitsDownloadLink, setUnitsDownloadLink] = useState();
  const [unitsData, setUnitsData] = useState([
    {
      survey_value: "",
      conversion: "",
    },
  ]);

  const [submitAllUnits, setSubmitAllUnits] = useState(false);
  // console.log(props);

  const pricesNames = [
    "mean_crop_price_lcu_per_kg",
    "mean_livestock_price_per_animal",
    "mean_meat_price_per_kg",
    "mean_milk_price_per_litre",
    "mean_eggs_price_per_kg",
    "mean_bees_honey_price_per_kg",
    "crop_calories",
    "milk_calories",
    "eggs_calories",
    "honey_calories",
    "meat_calories",
    "staple_crop",
    "livestock_weight_kg",
    "livestock_count_to_tlu",
  ];
  useEffect(() => {
    // console.log("Units");
    // console.log(unitsData);
  }, [unitsData]);

  return (
    <>
      <Form>
        <Form.Label>{props.formLabel}</Form.Label>

        <Form.Select
          defaultValue="Select"
          onChange={async (event) => {
            // autosave progress
            await SubmitUnitsData({
              ...props,
              unitsData: unitsData,
              unitsSelect: unitsSelect,
              process_label: "Conversion Submission",
            });

            setUnitsSelect(event.target.value);
            const newUnitsData = await FetchData({
              authToken: props.authToken,
              dataType: event.target.value,
              projectID: props.projectSelected,
              formID: props.formSelected,
              unit: true,
              data: false,
            });
            const units_download_link = generateDataDownloadLink(
              newUnitsData,
              unitsDownloadLink
            );
            setUnitsDownloadLink(units_download_link);

            setUnitsData(newUnitsData);
          }}
        >
          <option key="default-select" disabled={true}>
            Select
          </option>
          {props.formData.units.map((unitType) => {
            if (props.formType === "units") {
              if (
                pricesNames.some((priceName) => priceName == unitType) === false
              ) {
                return (
                  <option key={"unit-option-" + unitType}>{unitType}</option>
                );
              }
            }
            if (props.formType === "prices") {
              if (
                pricesNames.some((priceName) => priceName == unitType) === true
              ) {
                return (
                  <option key={"unit-option-" + unitType}>{unitType}</option>
                );
              }
            }
            // return <option key={"unit-option-" + unitType}>{unitType}</option>;
          })}
        </Form.Select>
      </Form>
      <br />
      {unitsSelect ? (
        <RenderConversionTable
          unitsData={unitsData}
          setUnitsData={setUnitsData}
        />
      ) : (
        <></>
      )}

      <br />
      <Form>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label={props.checkBoxLabel}
            onChange={() => {
              let currentState = submitAllUnits;

              setSubmitAllUnits(!currentState);
            }}
          />
        </Form.Group>
      </Form>
      <div style={{ display: "inline-grid", width: "100%" }}>
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          {!submitAllUnits ? (
            <>
              <a
                // Name of the file to download
                download={
                  props.projectSelected +
                  "_" +
                  props.formSelected +
                  "_" +
                  unitsSelect +
                  ".csv"
                }
                // link to the download URL
                href={unitsDownloadLink}
              >
                <Button style={{ margin: "2px" }} className="bg-dark border-0">
                  Download
                </Button>
              </a>

              <Button
                className="bg-dark border-0"
                onClick={async () => {
                  await SubmitUnitsData({
                    ...props,
                    unitsData: unitsData,
                    unitsSelect: unitsSelect,
                    process_label: "Conversion Submission",
                  });
                }}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-dark border-0"
                onClick={async () => {
                  props.setLoading(true);
                  await ProcessData({
                    commandType: props.commandType,
                    formSelected: props.formSelected,
                    projectSelected: props.projectSelected,
                    process_label: props.processLabel,
                    data: props.userInfo,
                    authToken: props.authToken,
                  });

                  await GetInformationForFormComponent({
                    setAuthToken: props.setAuthToken,
                    authToken: props.authToken,
                    setUserInfo: props.setUserInfo,
                    projectName: props.projectSelected,
                    formName: props.formSelected,
                    setFormData: props.setFormData,
                    setShowRawData: props.setShowRawData,
                    setUserInfo: props.setUserInfo,
                  });
                  props.setLoading(false);
                }}
              >
                {props.submissionLabel}
              </Button>
            </>
          )}
        </div>
        <div style={{ marginLeft: "auto", marginRight: 0 }}>
          Last Updated: {props.updatedTime}
        </div>
      </div>
    </>
  );
}

async function ProcessData(props) {
  // console.log(props);
  const form = props.data.forms.filter(
    (item) =>
      item.name === props.formSelected && item.project === props.projectSelected
  )[0];

  Store.addNotification({
    id: "notification-start",
    title: props.process_label + " Started",
    message: "Please wait",
    type: "default",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
  });

  try {
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
        formVersion: form.liveVersion,
        draft: form.draft,
      },
    });

    if (result.status === 200) {
      Store.addNotification({
        title: "Success",
        message: props.process_label + " Completed",
        type: "default",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
        },
      });

      Store.removeNotification("notification-start");
    }
    return true;
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
    });
    return false;
  }
}

async function RetrieveZipFile(props) {
  // console.log(props);
  // console.log(process.env.REACT_APP_API_URL + "api/data/all-data");

  const response = await axios({
    method: "post",
    responseType: "arraybuffer",
    url: process.env.REACT_APP_API_URL + "api/data/all-data",
    data: {
      projectID: props.projectID,
      formID: props.formID,
    },
    headers: {
      Authorization: props.authToken,
    },
  });
  // console.log(response.data);

  props.setDataDownloadLink(
    generateZipDownloadLink(response.data, props.dataDownloadLink)
  );
  return;
}
function generateZipDownloadLink(ZipResponse, dataDownloadLink) {
  // Generating the csv string from the data we
  // hope to download (comes in JSON format)
  // Create a file-like immutable objesct
  const data = new Blob([ZipResponse], { type: "application/zip" });

  // Clears the previous URL used to download the data
  if (dataDownloadLink !== "") {
    window.URL.revokeObjectURL(dataDownloadLink);
  }

  // update the download link state
  return window.URL.createObjectURL(data);
}

function generateCSV(data) {
  //Return nothing if the data is null
  if (data === null) {
    return;
  }

  if (data.length === undefined) {
    return;
  }

  // Creating an empty list to include all of the lines of the csv
  var csv_lines = [];

  // This is the full RHoMIS Data set
  var full_data_set = data;

  // Identifying the column headers
  // Some households have more columns than other. This merges column
  // names in order based on the rows of each household
  var column_names = [];

  // Looping through households
  for (
    let household_index = 0;
    household_index < full_data_set.length;
    household_index++
  ) {
    // All of the column names for this individual household
    var household_column_names = Object.keys(full_data_set[household_index]);
    //Looping through individual column names for the individual household
    for (
      let column_index = 0;
      column_index < household_column_names.length;
      column_index++
    ) {
      // The new column name for that household
      var new_column = household_column_names[column_index];
      // Checking whether the new column has previously been encountered
      if (!column_names.some((column) => column === new_column)) {
        // If this is the first househould, adds the new element at the column index
        // not deleting any items
        if (household_index === 0) {
          column_names.splice(column_index, 0, new_column);
        }
        // Checks if this is a household after the first household
        if (household_index > 0) {
          // Check if the previous column was in the column index
          if (!household_column_names[column_index - 1] !== undefined) {
            // Looks at the column before, if it was encountered previously
            // we make sure this new column is added in the correct place
            var index_of_previous_column_name = column_names.indexOf(
              household_column_names[column_index - 1]
            );

            column_names.splice(
              index_of_previous_column_name + 1,
              0,
              new_column
            );
          } else {
            // If the previous column did not exist previously, we make sure to add the new column
            // at the end.
            column_names.splice(column_index + 1, 0, new_column);
          }
        }
      }
    }
  }
  // add all of the column names, seperated by a column and a space
  csv_lines.push(column_names.join(", "));

  // Now push each individual household to the csv
  var household_data = full_data_set.map((household) => {
    var household_array = column_names.map((column) => {
      if (household[column] !== null) {
        return household[column];
      } else {
        return "";
      }
    });
    // Join the column values by comma
    var household_row = household_array.join(", ");
    return household_row;
  });
  csv_lines = csv_lines.concat(household_data);

  // Join each line and seperate by \n
  var csv_string = csv_lines.join("\n");
  return csv_string;
}

function generateDataDownloadLink(dataToDownload, dataDownloadLink) {
  // Generating the csv string from the data we
  // hope to download (comes in JSON format)
  const dataCSV = generateCSV(dataToDownload);
  // Create a file-like immutable objesct
  const data = new Blob([dataCSV], { type: "text/plain" });

  // Clears the previous URL used to download the data
  if (dataDownloadLink !== "") {
    window.URL.revokeObjectURL(dataDownloadLink);
  }
  // update the download link state
  return window.URL.createObjectURL(data);
}

async function CheckFormData(props) {
  // console.log("Checking form data");
  // console.log(props);

  if (props.formData.rawDataExtracted == true) {
    // Extract Units
    props.setShowRawData(true);
  }

  if (props.formData.rawDataExtracted == false) {
    // Store.addNotification({
    //   id: 'unit_extraction',
    //   title: "Extracting Units",
    //   message: "Please wait while we extract units from the dataset",
    //   type: "default",
    //   insert: "top",
    //   container: "top-right",
    //   animationIn: ["animate__animated", "animate__fadeIn"],
    //   animationOut: ["animate__animated", "animate__fadeOut"],
    // });
    props.setLoading(true);
    const processing_result = await ProcessData({
      commandType: "raw-data",
      formSelected: props.formSelected,
      projectSelected: props.projectSelected,
      process_label: "Extraction of Raw Data",
      data: props.data,
      authToken: props.authToken,
      setLoading: props.setLoading,
    });

    if (processing_result === true) {
      await GetInformationForFormComponent({
        setAuthToken: props.setAuthToken,
        authToken: props.authToken,
        setUserInfo: props.setUserInfo,
        projectName: props.projectSelected,
        formName: props.formSelected,
        setFormData: props.setFormData,
        setShowRawData: props.setShowRawData,
        userInfo: props.setUserInfo,
      });
      props.setLoading(false);

      Store.removeNotification("unit_extraction");
    }
  }

  if (props.formData.unitsExtracted == true) {
    // Extract Units
    props.setShowUnits(true);
  }

  if (props.formData.pricesCalculated == true) {
    props.setShowPrices(true);
  }
  if (props.formData.pricesCalculated == false) {
  }

  if (props.formData.finalIndicators == true) {
    props.setShowOutputs(true);
  }
  if (props.formData.finalIndicators == false) {
    //
  }
}

export default function DataAccessComponent() {
  const projectSelected = useParams().projectName;
  const formSelected = useParams().formName;

  const [authToken, setAuthToken] = useContext(AuthContext);
  const [adminData, setAdminData] = useContext(UserContext);

  const history = useHistory();

  const [formData, setFormData] = useState({});

  const [loading, setLoading] = useState(true);
  const [showUnits, setShowUnits] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [showOutputs, setShowOutputs] = useState(false);

  const [showRawData, setShowRawData] = useState(false);

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
    // console.log("getting user info");
    async function GetUserInfo() {
      await GetInformationForFormComponent({
        setAuthToken: setAuthToken,
        authToken: authToken,
        setUserInfo: setAdminData,
        projectName: projectSelected,
        formName: formSelected,
        setFormData: setFormData,
        setShowRawData: setShowRawData,
        setUserInfo: setAdminData,
      });
      setLoading(false);
    }
    GetUserInfo();
  }, [authToken]);

  useEffect(() => {
    // console.log("Form Data");
    // console.log(formData);

    async function CheckAndUpdateFormInformation() {
      await CheckFormData({
        setAuthToken: setAuthToken,
        authToken: authToken,

        setUserInfo: setAdminData,
        setFormData: setFormData,

        formData: formData,

        data: adminData,
        projectSelected: projectSelected,
        formSelected: formSelected,

        setShowUnits: setShowUnits,
        setShowPrices: setShowPrices,
        setShowOutputs: setShowOutputs,
        setLoading: setLoading,

        setShowRawData: setShowRawData,
      });
    }

    CheckAndUpdateFormInformation();
  }, [formData]);

  return (
    <>
      <MainCard
        CardTitle="Data"
        filters={[projectSelected, formSelected]}
        history={history}
        back_link={"/projects/" + projectSelected}
        doc_extension="source/user-guide/processing-data.html#managing-data"
        CardBody={
          loading
            ? RenderSpinner()
            : RenderDataCard({
                authToken: authToken,
                formData: formData,
                projectSelected: projectSelected,
                formSelected: formSelected,
                showUnits: showUnits,
                showRawData: showRawData,
                userInfo: adminData,
                showPrices: showPrices,
                showOutputs: showOutputs,
                setAuthToken: setAuthToken,
                setFormData: setFormData,
                setLoading: setLoading,
                setUserInfo: setAdminData,
                doc_extension:
                  "source/user-guide/processing-data.html#managing-data",
              })
        }
      ></MainCard>
    </>
  );
}
