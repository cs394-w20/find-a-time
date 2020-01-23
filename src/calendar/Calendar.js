import React, { Component } from "react"
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator
} from "daypilot-pro-react";
import "./CalendarStyles.css";
import 'firebase/database';
import {stringToDate, dateToString} from '../utilities';
import {ROOM_ID} from '../constants';
import db from '../components/Db/firebaseConnect';
import {HOURS, MINUTES} from "../constants";
import localJSON from "./dummy_data.json";
import {AddUserToRoom} from "../components/Db";
var Rainbow = require('rainbowvis.js');

const dbRef = db.ref();




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
  }


  /**
   * Call back function for firebase
   */
  handleDataCallback = (snap) =>{
    let dates = [];
    let events;
    let startDate = "";
    let users = [];

    if (snap.val()){
      events = snap.val().rooms[ROOM_ID].data;
      startDate = snap.val().rooms[ROOM_ID].time_interval.start;
      users = snap.val().rooms[ROOM_ID].users;
      dates = createDayArr(snap.val().rooms[ROOM_ID].time_interval.start,
          snap.val().rooms[ROOM_ID].time_interval.end);

      this.renderCalender({events,startDate,dates,users});
    }
  };


  /**
   * Code to render the calendar
   */
  renderCalender = ({dates,events,startDate,users})=>{
    const times = createTimes();
    const freeTimes = [];

    console.log("These are the dates we got from the database: ", dates);
    console.log("These are the EVENTS we got from the database: ", events);

    console.log("THE USERS: ", users);
    const numUsers = Object.keys(users).length;
    let colorSpectrum = new Rainbow();
    colorSpectrum.setNumberRange(0, numUsers);
    colorSpectrum.setSpectrum('green', 'red');
    console.log("THE COLORS!! ", colorSpectrum.colourAt(2));


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
            const unavailable = events[currDay][timeStamp];
            const numUnavailable = Object.keys(unavailable).length;
            const eventText = numUnavailable.toString() + " unavailable";


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

    });


    this.setState({
      startDate: startDate,
      events: freeTimes
    });
};


  componentDidMount() {
    dbRef.on('value', this.handleDataCallback,error => alert(error));
  };


  // disconnect the handleDataCallback on unmount
  componentWillUnmount() {
    db.off('value', this.handleDataCallback)
  }


  render() {
    return (
      <div className="calendar__container">
        <DayPilotCalendar
          {...this.state}
          ref={component => {
            this.calendar = component && component.control
          }}
        />
      </div>
    )
  }
}

export default Calendar
