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

var Rainbow = require("rainbowvis.js")


const EventPage = () => {
    const userContext = useContext(UserContext)
    console.log("THE USER CONTEXT: ", userContext);
}

const dbRef = db.ref()
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
            days: "4",
            durationBarVisible: true,
            eventMoveHandling: "Disabled",
            eventResizeHandling: "Disabled",

            onTimeRangeSelected: args => {
                let selection = this.calendar
                if (this.props.type == "PERSONAL") {
                    DayPilot.Modal.prompt("Add a new event: ", "Event name").then(function (
                        modal
                    ) {
                        selection.events.add(
                            new DayPilot.Event({
                                start: args.start,
                                end: args.end,
                                id: DayPilot.guid(),
                                text: modal.result
                            })
                        )
                    })
                    const currUserEmail = normalEmailToFirebaseEmail(this.props.email);

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
     * Call back function for firebase
     */
    handleDataCallback = snap => {
        let dates = [];
        let events;
        let startDate = "";
        let endDate = "";
        let users = [];

        if ((snap.val())) {

            startDate = snap.val().time_interval.start;
            endDate = snap.val().time_interval.end;

            users = snap.val().users;
            dates = createDayArr(
                startDate,
                endDate
            );


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

                this.renderCalender({ events, startDate, dates, users, type: this.props.type, currUser: this.state.user, email: this.state.email })
            } else {
                events = null;
                this.renderCalender({ events, startDate, dates, users, type: this.props.type, currUser: this.state.user, email: this.state.email })
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

        let currTime = 0

        if (events !== null) {
            dates.forEach(function (key, dayIndex) {
                let currId = 0
                let currDay = dateToString(key)
                let seconds = ":00"

                if (!Object.keys(events).includes(currDay)) {
                    console.log("Date not included in firebase")
                }

                let strTime = currDay.concat("T", convertTime(currTime).concat(seconds))

                if (type === "GROUP") {
                    while (convertTime(currTime).concat(seconds) !== "24:00") {
                        let i = 0

                        while (i < 2) {
                            strTime = currDay.concat("T", convertTime(currTime).concat(seconds))
                            let timeStamp = convertTime(currTime).concat(seconds)

                            // CASE 1: Time slot where everybody is available
                            if (!Object.keys(events[currDay]).includes(timeStamp)) {
                                const currEvent = {
                                    id: currId,
                                    text: "ALL available",
                                    start: strTime.concat(":00"),
                                    end: addThirtyMin(currDay, currTime, seconds).concat(":00"),
                                    backColor: "#" + colorSpectrum.colourAt(0)
                                }
                                freeTimes.push(currEvent)
                            }
                            // CASE 2: Time slot is not available for everyone
                            else {
                                const unavailable = events[currDay][timeStamp]
                                const numUnavailable = Object.keys(unavailable).length
                                const eventText = (numUsers - numUnavailable).toString() +
                                    " / " + numUsers.toString() + " available"

                                const currEvent = {
                                    id: currId,
                                    text: eventText,
                                    start: strTime.concat(":00"),
                                    end: addThirtyMin(currDay, currTime, seconds).concat(":00"),
                                    backColor: "#" + colorSpectrum.colourAt(numUnavailable)
                                }

                                freeTimes.push(currEvent)
                            }

                            //elif (prop)

                            if (seconds == ":00") {
                                seconds = ":30"
                            } else if (seconds == ":30") {
                                seconds = ":00"
                            }

                            currId = currId + 1
                            i += 1
                        }
                        currTime = currTime + 1
                    }

                    currTime = 0 // Reset currTime for next date
                }
                if (type === "PERSONAL") {
                    // console.log("The logged in user's email: ", email)
                    const currUserEmail = normalEmailToFirebaseEmail(email);
                    var mtime = moment(currDay);
                    mtime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                    while (currDay == mtime.format('YYYY-MM-DD')) {
                        var mstrTime = currDay.concat("T", mtime.format('HH:mm'));
                        let timeStamp = mtime.format('HH:mm');
                        if (Object.keys(events[currDay]).includes(timeStamp)) {
                            //const unavailable = events[currDay][timeStamp]

                            if (Object.keys(events[currDay][timeStamp]).includes(currUserEmail)) {
                                console.log(currUserEmail, " is UNAVAILABLE at the time: ", timeStamp, " on day: ", currDay);
                                const currEvent = {
                                    id: currId,
                                    start: mstrTime.concat(":00"),
                                    text: " ",
                                    end: maddThirtyMin(currDay, mtime.clone()).concat(":00")
                                }
                                freeTimes.push(currEvent)
                            }
                        }
                        mtime.add(30, 'm');
                        currId = currId + 1

                    }
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
        // console.log(eventData.e.data.start.value)
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
                emailList,
                title,
                description
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
     * Self explanatory - if user is not logged in it turns off eventClicked
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.eventClicked !== this.state.eventClicked) {
            if (!(this.props.isUserLoaded)) {
                this.setState({ eventClicked: false });
            }
        }
    };

    render() {

        return (
            <div className={"calendar__container"}>

                <DayPilotCalendar
                    {...this.state}
                    ref={component => {
                        this.calendar = component && component.control
                    }}

                    onEventClick={this.onEventDoubleClick}
                />
                {(this.state.eventClicked && this.props.isUserLoaded && this.props.type == "GROUP") && (
                    <EventInvites
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
