import React, {useContext, useEffect} from "react";
import ReactSearchBox from 'react-search-box'
import SearchIcon from "@material-ui/icons/Search";
import { UserContext } from "context/UserContext";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import "./YourEvents.scss"
import CondensedEvent from "./CondensedEvent";

const circleImg = require("./Images/circle.svg");
const clockImg = require("./Images/clock.svg");
const strollingHumaanImg = require("./Images/strollingHumaan.svg");
const runningHumaanImg = require("./Images/runningHumaan.svg");

const data = [
    {
        key: 'john',
        value: 'John Doe',
    },
    {
        key: 'jane',
        value: 'Jane Doe',
    },
    {
        key: 'mary',
        value: 'Mary Phillips',
    },
    {
        key: 'robert',
        value: 'Robert',
    },
    {
        key: 'karius',
        value: 'Karius',
    },
]


const YourEvents = () =>{
    const userContext = useContext(UserContext);


    return (
        <div>


                <div className="eventpage__container-header-scroll">
                    <div className="eventpage_month"> January </div>
                    <div className ="eventpage__searchbar">
                        <ReactSearchBox
                            placeholder="Search ..."
                            data={data}
                            callback={record => console.log(record)}
                        />
                    </div>
                    <div className="eventpage__divider"></div>
                </div>


                <div className="eventpage__container-scroll">
                    <Paper style={{maxHeight: '100%', overflow: 'auto'}} >
                        <List component="div" className="eventpage__container-list">
                            <CondensedEvent/>


                        </List>
                    </Paper>
                </div>


            <img
                src={circleImg}
                alt="A circle"
                className="eventpage_img-circle"
            />

            <img
                src={clockImg}
                alt="A Clock"
                className="eventpage__img-clock"
            />

            <img
                src={strollingHumaanImg}
                alt="Strolling human"
                className="eventpage_img-strollingHumaan"
            />

            <img
                src={runningHumaanImg}
                alt="Running Human"
                className="eventpage_img-runningHumaan"
            />

        </div>
    )
};



export default YourEvents;