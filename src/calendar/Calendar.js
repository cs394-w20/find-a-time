import React, { Component } from "react";
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

const dbRef = db.ref();


//this creates every possible hour/minute combination
export const createTimes = () => {
    return HOURS.map(function (item) {
        return MINUTES.map(function (item2) {
            return `${item}:${item2}`;
        })
    }).flat()
};

const convertTime = (time) => {
  if (time < 10) {
    return "0" + time.toString();
  }
  else {
    return time.toString();
  }
}


const addThirtyMin = (currDay, currTime, seconds) => {
  if (seconds == ":00") {
    return currDay.concat("T", convertTime(currTime).concat(":30"));
  }
  else {
    return currDay.concat("T", convertTime(currTime+1).concat(":00"));
  }
}

const createDayArr = (start, end) => {
  let startDate = stringToDate(start);
  let endDate = stringToDate(end);

  let newDate = startDate;
  let dateArr = [];
  while(newDate.getDate() !== endDate.getDate()) {
    dateArr.push(newDate);
    let tempDate = new Date(newDate);
    tempDate.setDate(newDate.getDate() + 1);
    newDate = tempDate;
  }

  dateArr.push(endDate);
  return dateArr;
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: "Week",
      durationBarVisible: true,
      onTimeRangeSelected: args => {
        let selection = this.calendar;

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
          );
        });

        selection.clearSelection();
      }
    };
  }

  async componentDidMount() {
    // Array of all the intervals where everybody is free
    const times = createTimes();
    let dates = [];
    const freeTimes = [];
    let events;
    let startDate = "";

    // Fetch data from firebase
    await dbRef.once('value', snap => {
      events = snap.val().rooms[ROOM_ID].data;
      startDate = snap.val().rooms[ROOM_ID].time_interval.start;
      dates = createDayArr(snap.val().rooms[ROOM_ID].time_interval.start,
                           snap.val().rooms[ROOM_ID].time_interval.end);
    });

    console.log("These are the dates we got from the database: ", dates);
    console.log("These are the EVENTS we got from the database: ", events);

    let currTime = 0;

    dates.forEach(function(key, dayIndex) {
      let currId = 0;
      let currStart = "";
      let currDay = dateToString(key);
      let seconds = ":00";
      console.log("CURRENT DAY: ", currDay);

      if(!(Object.keys(events).includes(currDay))) {
        console.log("Date not included in firebase");
      }

      let strTime = currDay.concat("T", convertTime(currTime).concat(seconds));

      while (convertTime(currTime).concat(seconds) !== "24:00") {

        let strTime = currDay.concat("T", convertTime(currTime).concat(seconds));
        // let endTime = currDay.concat("T", convertTime(currTime).concat(seconds));

        console.log("Start at: ", strTime);

        // CASE 1: Time slot where everybody is available
        const currEvent = {
          id: currId,
          text: "Possible meeting time",
          start: strTime,
          end: addThirtyMin(currDay, currTime, seconds),
          unavailable: []
        };

        console.log("Ends at: ", currEvent.end);

        currTime = currTime + 1;
        if (seconds == ":00") {
          seconds = ":30";
        }
        else {
          seconds = ":00";
        }


      }

      currTime = 0; // Reset currTime for next date


    //   if(!(Object.keys(events).includes(currDay))) {
    //     console.log("Date not included in firebase");
    //     times.forEach(function(currTime, timeIndex) {
    //       const currEvent = {
    //         id: currId,
    //         text: "Possible meeting time",
    //         start: currDay.concat("T", "00:00:00"),
    //         end: currDay.concat("T", currTime.concat(":00"))
    //       };
    //
    //       freeTimes.push(currEvent);
    //     })
    //   }
    //
    //   else {
    //     times.forEach(function(currTime, timeIndex) {
    //       console.log("currStart: ", currStart);
    //       if (!(Object.keys(events[currDay]).includes(currTime))) {
    //         if(currStart.length === 0) currStart = currTime;
    //       }
    //       else {
    //         if (currStart.length > 0) {
    //           const currEvent = {
    //             id: currId,
    //             text: "Possible meeting time",
    //             start: currDay.concat("T", currStart.concat(":00")),
    //             end: currDay.concat("T", currTime.concat(":00"))
    //           };
    //
    //           freeTimes.push(currEvent);
    //           console.log("A freetime on ", currDay, " is: ", currEvent);
    //
    //           currStart = "";
    //           currId = currId + 1;
    //         }
    //       }
    //   })
    // }

  });


    this.setState({
      startDate: startDate,
      events: freeTimes
    });
  };

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
