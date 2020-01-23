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

const dbRef = db.ref();


//this creates every possible hour/minute combination
export const createTimes = () => {
    return HOURS.map(function (item) {
        return MINUTES.map(function (item2) {
            return `${item}:${item2}`;
        })
    }).flat()
};

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

  // method that formats data for calendar 
  formatData({dates,events,startDate}){

    const times = createTimes();
    const freeTimes = [];

    dates.forEach(function(key, dayIndex) {
      let currId = 0;
      let currStart = "";
      let currDay = dateToString(key);

      console.log(currDay);
      if(!(Object.keys(events).includes(currDay))) {
        console.log("Date not included in firebase");
        times.forEach(function(currTime, timeIndex) {
          const currEvent = {
            id: currId,
            text: "Possible meeting time",
            start: currDay.concat("T", "00:00:00"),
            end: currDay.concat("T", currTime.concat(":00"))
          };

          freeTimes.push(currEvent);
        })
      }

      else {
        times.forEach(function(currTime, timeIndex) {

          if (!(Object.keys(events[currDay]).includes(currTime))) {
            if(currStart.length === 0) currStart = currTime;
          }
          else {
            if (currStart.length > 0) {
              const currEvent = {
                id: currId,
                text: "Possible meeting time",
                start: currDay.concat("T", currStart.concat(":00")),
                end: currDay.concat("T", currTime.concat(":00"))
              };

              freeTimes.push(currEvent);

              currStart = "";
              currId = currId + 1;
            }
          }
        })
      }
    });

    this.setState({
      startDate: startDate,
      events: freeTimes
    });
  }



  // disconnect the handleData on unmount
  componentWillUnmount() {
    db.off('value', this.handleData)
  }

  // Callback function for firebase.
   handleData = (snap) =>{
    let dates = [];
    let events;
    let startDate = "";
    if (snap.val()){
      events = snap.val().rooms[ROOM_ID].data;
      startDate = snap.val().rooms[ROOM_ID].time_interval.start;
      dates = createDayArr(snap.val().rooms[ROOM_ID].time_interval.start,
          snap.val().rooms[ROOM_ID].time_interval.end);

      this.formatData({events,startDate,dates});
    }
  };

  async componentDidMount() {
    dbRef.on('value', this.handleData,error => alert(error));
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
