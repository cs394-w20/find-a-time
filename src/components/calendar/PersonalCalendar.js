import React, {Component, useContext} from "react"
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator
} from "daypilot-pro-react"
import "firebase/database"
import { stringToDate, dateToString, convertTime,
         addThirtyMin, createTimes, createDayArr } from "../../utilities"
import {DATE_FORMAT, ROOM_ID, HOURS, MINUTES} from "../../constants"
import db from "../Db/firebaseConnect"
import { EventInvites } from "../EventInvites"
import AddManualEvents from "../Events/AddManualEvents";
import moment from "moment";
import { getRoomIdFromPath } from "../Utility"
import { UserContext } from "../../context/UserContext"
import normalEmailToFirebaseEmail  from "../Utility/normalEmailToFirebaseEmail"
import Calendar from "./Calendar"
var Rainbow = require("rainbowvis.js")


const PersonalCalendar = ({isUserLoaded, user, email, roomId}) => {
  return (
    <Calendar isUserLoaded={isUserLoaded} roomId = {roomId} type={'PERSONAL'} user={user} email={email} />
  )
};


const dbRef = db.ref()
// DayPilotCalendar API Reference --> https://api.daypilot.org/daypilot-calendar-viewtype/

//password: thirtythree333333***
const SAMPLE_EMAIL_ADDRESS = ["find.a.time1@gmail.com"];

/**
 * Checks if there is data for the specific room that the calendar can render
 * @param snap value returned from firebased
 * @param roomId the room id
 * @return boolean
 */
const checkIfDataExists =(snap) =>{
  return ('data' in snap.val())
};

class PersonalCalendar2 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      eventClicked: false,
      viewType: "Days",
      days:"7",
      durationBarVisible: true,
      onTimeRangeSelected: args => {
        let selection = this.calendar

        DayPilot.Modal.prompt("Add a new event: ", "Event name").then(function(
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
          const currUserEmail = normalEmailToFirebaseEmail(props.user.email);
          AddManualEvents({roomId: getRoomIdFromPath(), userName: currUserEmail, start: args.start, end: args.end});
        })

        selection.clearSelection()
      }
    }

    // callback function for EventInvite
    this.eventInviteOnCloseCallback = this.eventInviteOnCloseCallback.bind(this)

    // get the roomId
    this.roomId = getRoomIdFromPath();
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

      startDate =snap.val().time_interval.start;
      endDate = snap.val().time_interval.end;

      users = snap.val().users;
      dates = createDayArr(
          startDate,
          endDate
      );


      if (checkIfDataExists(snap)){

        // add empty date to the  `events` object for all the days with missing days if there is any.
        events = snap.val().data;
        let _startDate = moment(startDate, DATE_FORMAT);
        let _endDate = moment( endDate, DATE_FORMAT);
        let date;
        for (let m =_startDate; m.diff(_endDate, 'days') <= 0; m.add(1, 'days')) {
          date = m.format(DATE_FORMAT);
          if (!(date in events)){
            events[date]={};
          }
        }

        this.renderCalender( {events, startDate, dates, users})
      }else{
        events =null;
        this.renderCalender( {events, startDate, dates, users})
      }
    }
  };

  /**
   * Code to render the calendar
   */
  renderCalender = ({ dates, events, startDate, users }) => {
    const times = createTimes()
    const freeTimes = []

    const currUserEmail = normalEmailToFirebaseEmail(this.props.user.email);
    console.log("USER EMAIL: ", currUserEmail);

    // console.log("These are the dates we got from the database: ", dates)
    console.log("These are the EVENTS we got from the database: ", events)
    // console.log("These are the USERS we got from the database: ", users)
    const numUsers = Object.keys(users).length
    let colorSpectrum = new Rainbow()
    colorSpectrum.setNumberRange(0, numUsers)
    colorSpectrum.setSpectrum("green", "red")
    console.log("THE COLORS!! ", colorSpectrum.colourAt(2))

    let currTime = 0

    if (events !==null){
      dates.forEach(function(key, dayIndex) {
        let currId = 0
        let currStart = ""
        let currDay = dateToString(key)
        let seconds = ":00"

        if (!Object.keys(events).includes(currDay)) {
          console.log("Date not included in firebase")
        }

        let strTime = currDay.concat("T", convertTime(currTime).concat(seconds))

        while (convertTime(currTime).concat(seconds) !== "24:00") {
          let i = 0

          while (i < 2) {

            strTime = currDay.concat("T", convertTime(currTime).concat(seconds))
            let timeStamp = convertTime(currTime).concat(seconds)

            // CASE 1: Time slot where everybody is available
            if (!Object.keys(events[currDay]).includes(timeStamp)) {

            }
            // CASE 2: Time slot is not available for everyone
            else {

              const unavailable = events[currDay][timeStamp]

              if (Object.keys(unavailable).includes(currUserEmail)) {
                console.log(currUserEmail, " is UNAVAILABLE at the time: ", timeStamp, " on day: ", currDay);
                const currEvent = {
                  id: currId,
                  text: 'hi',
                  start: strTime.concat(":00"),
                  end: addThirtyMin(currDay, currTime, seconds).concat(":00")
                }
                freeTimes.push(currEvent)
              }

            }

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
      })
    }

    this.setState({
      startDate: startDate,
      events: freeTimes,
      eventClicked: this.state.eventClicked
    })
  }

  componentDidMount() {
    db.ref("/rooms/"+this.props.roomId).on("value", this.handleDataCallback, error => alert(error))
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

    const emailList = SAMPLE_EMAIL_ADDRESS;
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
  componentDidUpdate(prevProps, prevState , snapshot) {
    if (prevState.eventClicked !== this.state.eventClicked) {
      if (!(this.props.isUserLoaded)){
        this.setState({eventClicked: false});
      }
    }
  };

  render()
  {

    return (
      <div className="calendar__container">

        <DayPilotCalendar
          {...this.state}
          ref={component => {
            this.calendar = component && component.control
          }}

          onEventClick={this.onEventDoubleClick}
        />
        {(this.state.eventClicked && this.props.isUserLoaded) && (
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

export default PersonalCalendar;
