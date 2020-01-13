import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "./CalendarStyles.css";
import localJSON from "./dummy_data.json";

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

  componentDidMount() {
    console.log("The local json file even info: ", localJSON.events);

    // Array of all the intervals where everybody is free
    const freeTimes = [];
    const events = localJSON.events;

    Object.keys(events).forEach(function(key, index) {
      // key: the name of the object key
      // index: the ordinal position of the key within the object
      const currDay = key;
      let currStart = "";
      let currId = 0;

      Object.keys(events[currDay]).forEach(function(key, index) {
        const currTime = key;
        if (events[currDay][key].length === 0) {
          if (currStart.length === 0) {
            currStart = currTime;
          }
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

            console.log("FREE TIME INTERVAL: ", currEvent);

            currStart = "";
            currId = currId + 1;
          }
        }


      })
    });

    console.log("All the free events: ", freeTimes);

    this.setState({
      startDate: "2020-01-05",
      events: freeTimes
      // events: [
      //   {
      //     id: 1,
      //     text: "Event 1",
      //     start: "2020-01-05T10:30:00",
      //     end: "2020-01-05T12:00:00",
      //     backColor: "#5FBB97"
      //   }
      // ]
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
