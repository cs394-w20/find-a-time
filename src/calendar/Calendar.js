import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "daypilot-pro-react";
import "./CalendarStyles.css";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewType: "Week",
      durationBarVisible: true,
      onTimeRangeSelected: args => {
        let selection = this.calendar;
        selection.clearSelection();
      },
    };
  }

  componentDidMount() {
    this.setState({
      startDate: "2020-01-05",
      events: [
        {
          id: 1,
          text: "Event 1",
          start: "2020-01-05T10:30:00",
          end: "2020-01-05T12:00:00",
          backColor: "#5FBB97"
        }
      ]
    });
  }

  render() {
    var {...config} = this.state;
    return (
      <div>
        <DayPilotCalendar
          {...config}
          ref={component => {
            this.calendar = component && component.control;
          }}
        />
      </div>
    );
  }
}

export default Calendar;
