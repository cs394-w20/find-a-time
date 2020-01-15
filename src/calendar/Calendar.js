import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "./CalendarStyles.css";
import localJSON from "./dummy_data.json";
import 'firebase/database';
import firebase from 'firebase/app';

var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "find-a-time-19756.firebaseapp.com",
  databaseURL: "https://find-a-time-19756.firebaseio.com",
  projectId: "find-a-time-19756",
  storageBucket: "find-a-time-19756.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();

const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '30']

//this creates every possible hour/minute combindation
const createTimes = () => {
    return hours.map(function (item) {
        return minutes.map(function (item2) {
            return `${item}:${item2}:00`;
        })
    }).flat()
}

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: "Week",
      durationBarVisible: true,
      onTimeRangeSelected: args => {
        let selection = this.calendar;

        DayPilot.Modal.prompt("Add a new event: ", "Event name").then(function(modal) {
          selection.events.add(new DayPilot.Event({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result
          }));
        });

        selection.clearSelection();

      },
    };
  }

  async componentDidMount() {

    // Array of all the intervals where everybody is free
    const times = createTimes();
    const freeTimes = [];
    var events;

    // Fetch data from firebase
    await dbRef.once('value', snap => {
      events = snap.val().events;
    });

    Object.keys(events).forEach(function(currDay, dayIndex) {
      let currId = 0;
      let currStart = "";

      times.forEach(function(currTime, timeIndex) {
        if (!(Object.keys(events[currDay]).includes(currTime))) {
          if(currStart.length === 0) currStart = currTime;
        }
        else {
          if (currStart.length > 0) {
            const currEvent = {
              id: currId,
              text: "Possible meeting time",
              start: currDay.concat("T", currStart),
              end: currDay.concat("T", currTime)
            }

            freeTimes.push(currEvent);

            currStart = "";
            currId = currId + 1;
          }
        }
      })
    });

    this.setState({
      startDate: "2020-01-05",
      events: freeTimes
    });
  }

  render() {
    // var {...config} = this.state;
    return (
      <div>
        <DayPilotCalendar
          {...this.state}
          ref={component => {
            this.calendar = component && component.control;
          }}
        />
      </div>
    );
  }
}

export default Calendar;
