import React, { Component, useContext } from "react"
import {
    DayPilot,
    DayPilotCalendar,
    DayPilotNavigator
} from "daypilot-pro-react"
import "./CalendarStyles.css"
import "firebase/database"
import {
    stringToDate, dateToString, convertTime,
    addThirtyMin, maddThirtyMin, createTimes, createDayArr
} from "../../utilities"
import { DATE_FORMAT, ROOM_ID } from "../../constants"
import db from "../Db/firebaseConnect"
import { EventInvites } from "../EventInvites"
import AddManualEvents from "../Events/AddManualEvents";
import moment from "moment";
import { getRoomIdFromPath } from "../Utility"
import { UserContext } from "../../context/UserContext"
import normalEmailToFirebaseEmail from "../Utility/normalEmailToFirebaseEmail"
import ManualEvents from "../Db/ManualEvents"
import MonthDayNavigator from "./MonthDayNavigator";
import firebaseEmailToNormalEmail from "../Utility/firebaseEmailToNormalEmail";
var Rainbow = require("rainbowvis.js")


const EventPage = () => {
    const userContext = useContext(UserContext)
    console.log("THE USER CONTEXT: ", userContext);
}

// DayPilotCalendar API Reference --> https://api.daypilot.org/daypilot-calendar-viewtype/

/**
 * Checks if there is data for the specific room that the calendar can render
 * @param snap value returned from firebased
 * @param roomId the room id
 * @param currUser the current user
 * @return boolean
 */
const checkIfDataExists = (snap) => {
    return ('data' in snap.val())
};


class Calendar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            eventClicked: false,
            viewType: "Days",
            days: "2",
            durationBarVisible: true,
            eventMoveHandling: "Disabled",
            eventResizeHandling: "Disabled",

            onTimeRangeSelected: args => {
                let selection = this.calendar
                if (this.props.type == "PERSONAL") {
                    const currUserEmail = normalEmailToFirebaseEmail(this.props.email);
                    //ManualEvents({ roomId: getRoomIdFromPath(), userName: currUserEmail, start: args.start, end: args.end })
                    console.log('argtype', typeof(args.end))
                    AddManualEvents({ roomId: getRoomIdFromPath(), userName: currUserEmail, start: args.start, end: args.end });
                }
                selection.clearSelection()
            },

            user: this.props.user,
            email: this.props.email
        }

        // callback function for EventInvite
        this.eventInviteOnCloseCallback = this.eventInviteOnCloseCallback.bind(this)

        // get the roomId
        this.roomId = getRoomIdFromPath();
        this.currUser = this.props.user;
    }

    /**
     * Call back function for firebase on mount
     */
    handleDataCallback = snap => {
        let dates = [];
        let events;
        let startDate = moment(new Date()).format(DATE_FORMAT);
        let endDate = "";
        let users = [];
        let meta_data;


        if ((snap.val())) {

            // set the start and end time.
            this.setState({time_interval:snap.val().time_interval});

            //startDate = snap.val().time_interval.start;
            endDate = snap.val().time_interval.end;

            meta_data = snap.val().meta_data;

            users = snap.val().users;
            dates = createDayArr(
                startDate,
                endDate
            );

            this.setState({dates});
            this.setState({users});
            this.setState({startDate});
            this.setState({endDate});
            this.setState({meta_data});


            // set the dates

            if (checkIfDataExists(snap)) {

                // add empty date to the  `events` object for all the days with missing days if there is any.
                events = snap.val().data;

                let _startDate = moment(startDate, DATE_FORMAT);
                let _endDate = moment(endDate, DATE_FORMAT);
                let date;
                for (let m = _startDate; m.diff(_endDate, 'days') <= 0; m.add(1, 'days')) {
                    date = m.format(DATE_FORMAT);
                    if (!(date in events)) {
                        events[date] = {};
                    }
                }

                this.setState({events_:events});
                this.renderCalender({ events, startDate, dates, users, type: this.props.type, currUser: this.state.user, email: this.state.email })
            } else {
                this.setState({events_:null});
                this.renderCalender({ events:null, startDate, dates, users, type: this.props.type, currUser: this.state.user, email: this.state.email })
            }
        }
    };

    /**
     * Code to render the calendar
     */
    renderCalender = ({ dates, events, startDate, users, type, currUser, email }) => {
        const freeTimes = []

        const numUsers = Object.keys(users).length
        let colorSpectrum = new Rainbow()
        colorSpectrum.setNumberRange(0, numUsers)
        colorSpectrum.setSpectrum("green", "red")

        if (events !== null) {
            dates.forEach(function (key, dayIndex) {
                let currId = 0
                let currDay = dateToString(key)

                if (!Object.keys(events).includes(currDay)) {
                    console.log("Date not included in firebase")
                }
                const currUserEmail = normalEmailToFirebaseEmail(email);
                var mtime = moment(currDay);
                mtime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                while (currDay == mtime.format('YYYY-MM-DD')) {
                    var mstrTime = currDay.concat("T", mtime.format('HH:mm'));
                    let timeStamp = mtime.format('HH:mm');

                    if (Object.keys(events[currDay]).includes(timeStamp)) {
                        if (type === "GROUP") {
                            const unavailable = events[currDay][timeStamp]
                            const numUnavailable = Object.keys(unavailable).length
                            let availableList = ""
                            const eventText = (numUnavailable === 0) ? `${numUsers}/${numUsers} free` :
                                (numUsers - numUnavailable).toString() +
                                "/" + numUsers.toString() + " free"

                            let availableUsers = []

                            let allEmails = Object.keys(users)
                            if (numUnavailable > 0) {
                              let unavailableEmails = Object.keys(unavailable)

                              // Emails of users who CAN attend this event
                              let availableEmails = allEmails.filter(x => !unavailableEmails.includes(x));
                              // console.log("EMAILS OF THOSE WHO CAN ATTEND: ", availableEmails);

                              availableEmails.forEach(function(email, index) {
                                const currUserInfo = users[email]
                                availableUsers.push([currUserInfo, firebaseEmailToNormalEmail(email)])
                              })
                            }else{
                                allEmails.forEach(function(email, index) {
                                    const currUserInfo = users[email];
                                    availableUsers.push([currUserInfo, firebaseEmailToNormalEmail(email)])
                                })
                            }

                            const currEvent = {
                                id: currId,
                                text: eventText,
                                start: mstrTime.concat(":00"),
                                end: maddThirtyMin(currDay, mtime.clone()).concat(":00"),
                                backColor: "#" + colorSpectrum.colourAt(numUnavailable),
                                available: availableUsers
                            }
                            freeTimes.push(currEvent)
                        }
                        if (type === "PERSONAL") {
                            if (Object.keys(events[currDay][timeStamp]).includes(currUserEmail)) {
                                const eventText = (events[currDay][timeStamp][currUserEmail]=== "AUTO") ? "Google" : "Manual";
                                const boxColor = (events[currDay][timeStamp][currUserEmail]=== "AUTO") ? "Red" : "Blue";
                                const currEvent = {
                                    id: currId,
                                    start: mstrTime.concat(":00"),
                                    text: eventText,
                                    backColor: boxColor,
                                    end: maddThirtyMin(currDay, mtime.clone()).concat(":00"),
                                }
                                freeTimes.push(currEvent)
                            }
                        }
                    }
                    mtime.add(30, 'm');
                    currId = currId + 1

                }
            }
            )
        }

        this.setState({
            startDate: startDate,
            events: freeTimes,
            eventClicked: this.state.eventClicked
        })
    }

    componentDidMount() {
        db.ref("/rooms/" + this.props.roomId).on("value", this.handleDataCallback, error => alert(error))

    }

    // disconnect the handleDataCallback on unmount
    componentWillUnmount() {
        db.ref().off("value", this.handleDataCallback)
    }

    /**
     * ToDo: Replace static data. eventData.e.data should contain emails of people available, and need a global
     * constant w/ the title of the event and description of event. Probably needs to be firebase real time
     * since these can change. Probably add to the Context variable.
     * @param eventData
     */
    onEventDoubleClick = eventData => {
        const startSelected = eventData.e.data.start.value;
        const endSelected = eventData.e.data.end.value;
        const availableUsers = eventData.e.data.available;

        console.log("!!!AVAILABLE USERS: ", availableUsers)

        // console.log(eventData.e.data.end.value)
        //console.log(this.state.eventClicked)

        const emailList = ["find.a.time1@gmail.com"]; // password: thirtythree333333***
        const title = "CS 394 Meeting";
        const description = "Hey everyone! Please fill out this form whenever you\n" +
            "                          can so that we can find a time to meet weekly! Make\n" +
            "                          sure to connect your Google calendar so you don’t have\n" +
            "                          to manually fill in events!";

        this.setState({
            eventClicked: true,
            eventData: {
                startSelected,
                endSelected,
                availableUsers
            }
        })

    };

    /**
     * callback function for EventInvites. Called when the popup window closes
     * @link EventInvites
     */
    eventInviteOnCloseCallback = () => {
        this.setState({ eventClicked: false })
    };

    /**
     * if user is not logged in it turns off eventClicked
     * if dates is updated and required variables are not null then re-render the calendar.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.eventClicked !== this.state.eventClicked) {
            if (!(this.props.isUserLoaded)) {
                this.setState({ eventClicked: false });
            }
        }

        if (prevState.dates !== this.state.dates &&
            (this.state.users) &&
            (this.state.startDate) &&
            (this.state.dates)){
            this.renderCalender({ events: this.state.events_, startDate: this.state.startDate, dates: this.state.dates, users: this.state.users, type: this.props.type, currUser: this.state.user, email: this.state.email })
        }
    };


    dateClickCallBack = (startingDate) =>{
        let updateDates = createDayArr(
            startingDate,
            this.state.endDate
        );
        this.setState({dates:updateDates});
        this.setState({startDate:startingDate});

    };

    render() {
        if (this.state.eventClicked && this.props.type == "PERSONAL"){
            console.log('clicked', this.state.eventData, "hi", this.state.eventClicked);
            console.log(this.state.eventData.startSelected, this.state.eventData.endSelected)
            const currUserEmail = normalEmailToFirebaseEmail(this.props.email);
            ManualEvents({ roomId: getRoomIdFromPath(), userName: currUserEmail, start: this.state.eventData.startSelected, end: this.state.eventData.endSelected })
        }

        return (
            <div className={"calendar__container"}>
                <MonthDayNavigator time_interval={this.state.time_interval} dateClickCallBack={this.dateClickCallBack}/>

                <div className={"calendar__container_inner"}>
                    <DayPilotCalendar
                        {...this.state}
                        ref={component => {
                            this.calendar = component && component.control
                        }}

                        onEventClick={this.onEventDoubleClick}
                    />
                </div>



                {(this.state.eventClicked && this.props.isUserLoaded && this.props.type == "GROUP") && (
                    <EventInvites
                        meta_data = {this.state.meta_data}
                        users={this.state.users}
                        eventData={this.state.eventData}
                        eventClicked={this.state.eventClicked}
                        eventInviteOnCloseCallback={this.eventInviteOnCloseCallback}
                    />
                )}
            </div>
        )
    }
}

export default Calendar
