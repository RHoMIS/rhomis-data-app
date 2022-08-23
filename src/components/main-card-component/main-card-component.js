import React from "react";
import {  Card, Button } from 'react-bootstrap'

import {MdHelpOutline} from 'react-icons/md'
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function MainCard(props, {children}){

    /* Expecting the arguments
    CardTitle: The title you want for the card
    HelpLink: The link to the help documentation for this section
    CardBody: The card Body
    filters:
    history: the history of the component
    back_link: the link to return to 

    */

    return(
          <div className="sub-page-container">
            <Card className="main-card border-0">
                <Card.Header className="bg-dark text-white">
                <div className="main-card-header-container">
                <Button className="bg-dark border-0">
                <MdHelpOutline size={30} style={{"color":"white"}}/>
                </Button>

                <h3 className="main-card-header"> {props.CardTitle}</h3>
                    <div
              style={{
                display: "flex",
                "flex-direction": "row",
                "margin-left": "auto",
              }}>
                {props.filters.map((filter)=>{
                     return <div className="main-card-header-item">{filter}</div>
                })}


                {props.back_link !== null ? <Button
                className="bg-dark border-0"
                onClick={() => {
                  props.history.push(props.back_link);
                }}>
                <AiOutlineArrowLeft size={25} />
              </Button>:<></>}
                    
                   </div>
                   </div>
                </Card.Header>
                <Card.Body className="main-card-body">
                    {props.CardBody}

                </Card.Body>
            </Card>

        </div >
    )

}