import React, { useEffect, useState, useRef} from "react";
import ReactSearchBox from 'react-search-box'
import {UserContext} from "context/UserContext";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";

import "./YourEvents.scss"
import CondensedEvent from "./CondensedEvent";
import Fuse from 'fuse.js'

const circleImg = require("./Images/circle.svg");
const clockImg = require("./Images/clock.svg");
const strollingHumaanImg = require("./Images/strollingHumaan.svg");
const runningHumaanImg = require("./Images/runningHumaan.svg");

const sampleRoom1 = {
    "roomId": 1,
    "users": {
        "suzy@northwestern_edu": {
            "name": "Suzy",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        }
    },
    "time_interval": {
        "start": "2020-01-20",
        "end": "2020-01-22"
    },
    "meta_data": {
        "title": "CS 396 Project v3",
        "description": "Make sure you fill out this form so we can find a time to meet weekly!",
        "room_owner": "suzy@northwestern_edu"
    }
};

const sampleRoom2 = {
    "roomId": 19,
    "users": {
        "suzy@northwestern_edu": {
            "name": "Suzy",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        }
    },
    "time_interval": {
        "start": "2020-01-10",
        "end": "2020-01-12"
    },
    "meta_data": {
        "title": "CS 394 Meeting",
        "description": "Make sure you fill out this form so we can find a time to meet weekly!",
        "room_owner": "suzy@northwestern_edu"
    }
};

const sampleRoom3 = {
    "roomId": 20,
    "users": {
        "suzy@northwestern_edu": {
            "name": "Suzy",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        }
    },
    "time_interval": {
        "start": "2020-02-10",
        "end": "2020-02-12"
    },
    "meta_data": {
        "title": "Chess Club meeting",
        "description": "Make sure you fill out this form so we can find a time to meet weekly!",
        "room_owner": "suzy@northwestern_edu"
    }
};

// ReactSearchBox `searches' on value, and the payload is key.
const sampleData = [
    {
        key: sampleRoom1,
        value: 'CS 396 Project v3',
    },
    {
        key: sampleRoom2,
        value: 'CS 394 Meeting',
    },
    {
        key: sampleRoom3,
        value: 'Chess Club meeting',
    }
];


const defaultFuseConfigs = {
    /**
     * At what point does the match algorithm give up. A threshold of 0.0
     * requires a perfect match (of both letters and location), a threshold
     * of 1.0 would match anything.
     */
    threshold: 0.05,
    /**
     * Determines approximately where in the text is the pattern expected to be found.
     */
    location: 0,
    /**
     * Determines how close the match must be to the fuzzy location
     * (specified by location). An exact letter match which is distance
     * characters away from the fuzzy location would score as a complete
     * mismatch. A distance of 0 requires the match be at the exact
     * location specified, a distance of 1000 would require a perfect
     * match to be within 800 characters of the location to be found
     * using a threshold of 0.8.
     */
    distance: 100,
    /**
     * When set to include matches, only the matches whose length exceeds this
     * value will be returned. (For instance, if you want to ignore single
     * character index returns, set to 2).
     */
    minMatchCharLength: 1,
    /**
     * List of properties that will be searched. This supports nested properties,
     * weighted search, searching in arrays of strings and objects.
     */
    keys: ['value'],
};

// fuse is a fuzzy search library that ReactSearchBox uses --- this will be called

const YourEvents = () => {
    const fuse = useRef();
    //const userContext = useContext(UserContext);
    const [data, setData] = useState(sampleData);

    useEffect(()=>{
        fuse.current = new Fuse(sampleData, defaultFuseConfigs);
    },[]);


    const onChange = (text) => {
        if (text !== '') {
            setData(fuse.current.search(text));
        } else {
            setData(sampleData);
        }
    };

    return (
        <div>
            <div className="eventpage__container-header-scroll">
                <div className="eventpage_month"> January</div>
                <div className="eventpage__searchbar">
                    <ReactSearchBox
                        placeholder="Search ..."
                        data={data}
                        onChange={onChange}
                    />
                </div>
                <div className="eventpage__divider"></div>
            </div>


            <div className="eventpage__container-scroll">
                <Paper style={{maxHeight: '100%', overflow: 'auto'}}>
                    <List component="div" className="eventpage__container-list">

                        {data.map((value) => <CondensedEvent key={value.key.roomId} payload={value.key}/>)}

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