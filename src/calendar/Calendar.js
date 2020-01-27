import React, { Component } from "react"
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator
} from "daypilot-pro-react"
import "./CalendarStyles.css"
import "firebase/database"
import { stringToDate, dateToString } from "../utilities"
import { ROOM_ID } from "../constants"
import db from "../components/Db/firebaseConnect"
import { HOURS, MINUTES } from "../constants"
import localJSON from "./dummy_data.json"
import { EventInvites } from "../components/EventInvites"
var Rainbow = require("rainbowvis.js")

const dbRef = db.ref()

//password: thirtythree333333***
const SAMPLE_EMAIL_ADDRESS = ["find.a.time1@gmail.com"];



//this creates every possible hour/minute combination
export const createTimes = () => {
  return HOURS.map(function(item) {
    return MINUTES.map(function(item2) {
      return `${item}:${item2}`
    })
  }).flat()
}

const convertTime = time => {
  if (time < 10) {
    return "0" + time.toString()
  } else {
    return time.toString()
  }
}

const addThirtyMin = (currDay, currTime, seconds) => {
  if (seconds == ":00") {
    const endTime = currDay.concat("T", convertTime(currTime).concat(":30"))
    return endTime
  } else {
    const endTime = currDay.concat("T", convertTime(currTime + 1).concat(":00"))
    return endTime
  }
}

const createDayArr = (start, end) => {
  let startDate = stringToDate(start)
  let endDate = stringToDate(end)

  let newDate = startDate
  let dateArr = []
  while (newDate.getDate() !== endDate.getDate()) {
    dateArr.push(newDate)
    let tempDate = new Date(newDate)
    tempDate.setDate(newDate.getDate() + 1)
    newDate = tempDate
  }

  dateArr.push(endDate)
  return dateArr
}

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventClicked: false,
      viewType: "Week",
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
        })

        selection.clearSelection()
      }
    }

    // callback function for EventInvite
    this.eventInviteOnCloseCallback = this.eventInviteOnCloseCallback.bind(this)
  }

  /**
   * Call back function for firebase
   */
  handleDataCallback = snap => {
    let dates = []
    let events
    let startDate = ""
    let users = []

    if (snap.val()) {
      events = snap.val().rooms[ROOM_ID].data
      startDate = snap.val().rooms[ROOM_ID].time_interval.start
      users = snap.val().rooms[ROOM_ID].users
      dates = createDayArr(
        snap.val().rooms[ROOM_ID].time_interval.start,
        snap.val().rooms[ROOM_ID].time_interval.end
      )

      this.renderCalender({ events, startDate, dates, users })
    }
  }

  /**
   * Code to render the calendar
   */
  renderCalender = ({ dates, events, startDate, users }) => {
    const times = createTimes()
    const freeTimes = []

    console.log("These are the dates we got from the database: ", dates)
    console.log("These are the EVENTS we got from the database: ", events)

    console.log("THE USERS: ", users)
    const numUsers = Object.keys(users).length
    let colorSpectrum = new Rainbow()
    colorSpectrum.setNumberRange(0, numUsers)
    colorSpectrum.setSpectrum("green", "red")
    console.log("THE COLORS!! ", colorSpectrum.colourAt(2))

    let currTime = 0

    dates.forEach(function(key, dayIndex) {
      let currId = 0
      let currStart = ""
      let currDay = dateToString(key)
      let seconds = ":00"
      console.log("CURRENT DAY: ", currDay)

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
            const eventText = numUnavailable.toString() + " unavailable"

            const currEvent = {
              id: currId,
              text: eventText,
              start: strTime.concat(":00"),
              end: addThirtyMin(currDay, currTime, seconds).concat(":00"),
              backColor: "#" + colorSpectrum.colourAt(numUnavailable)
            }

            freeTimes.push(currEvent)
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

    this.setState({
      startDate: startDate,
      events: freeTimes,
      eventClicked: this.state.eventClicked
    })
  }

  componentDidMount() {
    dbRef.on("value", this.handleDataCallback, error => alert(error))
  }

  // disconnect the handleDataCallback on unmount
  componentWillUnmount() {
    dbRef.off("value", this.handleDataCallback)
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
    //console.log("testing")
    //console.log(eventData);
     console.log(eventData.e.data);
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

    //console.log("here1")
    //console.log(state)
  }

  /**
   * callback function for EventInvites. Called when the popup window closes
   * @link EventInvites
   */
  eventInviteOnCloseCallback = () => {
    this.setState({ eventClicked: false })
  }

  render() {
    return (
      <div className="calendar__container">
        <DayPilotCalendar
          {...this.state}
          ref={component => {
            this.calendar = component && component.control
          }}
          onEventClick={this.onEventDoubleClick}
        />
        {this.state.eventClicked && (
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
