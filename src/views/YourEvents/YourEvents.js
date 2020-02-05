import React, {useEffect, useState, useRef, useContext} from "react";
import ReactSearchBox from 'react-search-box'
import {UserContext} from "context/UserContext";
import List from "@material-ui/core/List";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import "./YourEvents.scss"
import Fuse from 'fuse.js'
import {CondensedEvent} from "./components";
import {GetRoomsByUser} from "../../components/GetRoomsByUser";
import {normalEmailToFirebaseEmail} from "../../components/Utility";

const circleImg = require("./Images/circle.svg");
const clockImg = require("./Images/clock.svg");
const strollingHumaanImg = require("./Images/strollingHumaan.svg");
const runningHumaanImg = require("./Images/runningHumaan.svg");


// fuse is a fuzzy search library that ReactSearchBox uses ---these are the parameters.
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
    distance: 1000,
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


const YourEvents = () => {
    //handy for keeping any mutable value around similar to how you’d use instance fields in classes.
    const fuse = useRef(new Fuse([], defaultFuseConfigs));
    const initialData = useRef([]);

    // gets user data
    const userContext = useContext(UserContext);

    const [data, setData] = useState([]);
    const [textValue, setTextValue] = useState('');

    /**
     * Sets the data and the fuzzy searcher for the room list once the user is logged in.
     */
    useEffect(() => {
        if (userContext.isUserLoaded) {
            let email = normalEmailToFirebaseEmail(userContext.user.email);

            GetRoomsByUser({email}).then((roomData) => {
                fuse.current = new Fuse(roomData, defaultFuseConfigs);
                setData(roomData);
                initialData.current=roomData;
            });
        }
    }, [userContext.isUserLoaded]);


    const onChange = (text) => {
        if (text !== '') {
            setData(fuse.current.search(text));
        } else {
            setData(initialData.current);
        }
        setTextValue(text);
    };

    const closeSearchBox = () => {
        setTextValue('');
    };


    return (
        <div className="yourevents__container-main">
            <div className="yourevents__container-header-scroll">
                <div className="yourevents__month"> January</div>
                <div className="yourevents__searchbar">
                    <ClickAwayListener onClickAway={closeSearchBox}>
                        <ReactSearchBox
                            placeholder="Search ..."
                            value={textValue}
                            data={data}
                            onChange={onChange}
                            fuseConfigs={defaultFuseConfigs}
                        />
                    </ClickAwayListener>
                </div>
                <div className="yourevents__divider"></div>
            </div>


            <div className="yourevents__container-scroll">
                <List component="div" className="yourevents__container-list">
                    {data.map((value) => <CondensedEvent key={value.key.roomId} payload={value.key}/>)}
                </List>
            </div>


            <img
                src={circleImg}
                alt="A circle"
                className="yourevents_img-circle"
            />

            <img
                src={clockImg}
                alt="A Clock"
                className="yourevents__img-clock"
            />

            <img
                src={strollingHumaanImg}
                alt="Strolling human"
                className="yourevents_img-strollingHumaan"
            />

            <img
                src={runningHumaanImg}
                alt="Running Human"
                className="yourevents_img-runningHumaan"
            />

        </div>
    )
};


export default YourEvents;