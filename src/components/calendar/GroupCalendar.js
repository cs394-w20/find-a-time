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
  addThirtyMin, createTimes, createDayArr
} from "../../utilities"
import { DATE_FORMAT, ROOM_ID } from "../../constants"
import db from "../Db/firebaseConnect"
import { EventInvites } from "../EventInvites"
import AddManualEvents from "../Events/AddManualEvents";
import moment from "moment";
import { getRoomIdFromPath } from "../Utility"
import Calendar from "./Calendar"
import { UserContext } from "../../context/UserContext"



const GroupCalendar = ({isUserLoaded, user}) => {
  return (
    <Calendar isUserLoaded={isUserLoaded} type={'GROUP'} user={user.user}/>
  )
};

export default GroupCalendar
