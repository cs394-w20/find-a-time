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
import moment from "moment-timezone";
import {DATE_FORMAT} from "../../constants";
import useScroll from "./components/useScroll";
import { Loading} from "../../components/Loading";



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
    const baseRef = useRef();

    //handles month changes on scroll
    const scrollState = useScroll({baseRef});

    // gets user data
    const userContext = useContext(UserContext);

    // state variables
    const [data, setData] = useState([]);
    const [textValue, setTextValue] = useState('');

    /**
     * Sets the data and the fuzzy searcher for the room list once the user is logged in.
     */
    useEffect(() => {
        if (userContext.isUserLoaded) {
            GetRoomsByUser({email:userContext.user.email}).then((roomData) => {
                fuse.current = new Fuse(roomData, defaultFuseConfigs);
                setData(roomData);
                initialData.current=roomData;
            });
        }
    }, [userContext.isUserLoaded]);



    const onChange = (text) => {
        let searchData;
        if (text !== '') {
            searchData = fuse.current.search(text);

            // remove ref of objects not in search results so that month can update
            let obj;
            for (let i=0; i< initialData.current.length; i++){
                obj = initialData.current[i];
                if (!(searchData.includes(obj))){
                    scrollState.removeRef({roomId:obj.key.roomId })
                }
            }

            setData(searchData);
        } else {
            setData(initialData.current);
        }
        setTextValue(text);
    };

    // doesn't really work in fact ReactSearchBox is pretty garbage.
    const closeSearchBox = () => {
        setTextValue('');
    };

    // List the condensed events
    const listEvents = () =>{
        let seenDates = new Set();

        let eventList = [];
        let _data;
        let start;

        for (let i=0;i<data.length;i++){
            _data = data[i];
            start = _data.key.time_interval.start;
            eventList.push(<CondensedEvent key={_data.key.roomId}
                                           payload={_data.key}
                                           hasDate={!(seenDates.has(start))}
                                           scrollState={scrollState}/>);
            seenDates.add(start);
        }
        return eventList;
    };

    return (

        <div className="yourevents__container-main">
            <div className="yourevents__container-header-scroll">
                <div className="yourevents__month">
                    <span>{scrollState.month==="Invalid date"? '': scrollState.month}</span></div>
                <div className="yourevents__searchbar">
                    <ClickAwayListener onClickAway={closeSearchBox}>
                        <ReactSearchBox
                            style={{zIndex:9}}
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


            <div className="yourevents__container-scroll" ref={baseRef}>
                    <List component="div" className="yourevents__container-list"  >
                        {listEvents()}
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