import React, { useEffect, useState } from "react"
import firebase from "firebase/app"
import "firebase/database"
// need to import database as db

const hours = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23"
]
const minutes = ["00", "30"]
const dates = ["M", "Tu", "W", "Th", "F"] // replace this with the dates, try to get from gcal

// Firebase Configuration

//1. create an empty schedule entry for each data/time option
//2. find the schedule based off id from database, compare times

const ScheduleEntry = id => {
  const times = createTimeEntries()
  var events = {}
  dates.map(function(item) {
    events[item] = times
  })
  let schedule = { id: id, events }
  //saveToFirebase(schedule);
  return schedule
}

const createTimeEntries = () => {
  const times = createTimes()
  var obj = {}
  times.map(function(item) {
    obj[item] = []
  })
  return obj
}

//this creates every possible hour/minute combindation
const createTimes = () => {
  return hours
    .map(function(item) {
      return minutes.map(function(item2) {
        return `${item}:${item2}:00`
      })
    })
    .flat()
}

const addEvents = () => {
  //for each event
  //find which intervals it falls under
  //for each busy interval call addUnavailableUser(name, interval)
}

const addUnavailableUser = ({ id, name, date, interval }) => {
  //change the firebase entry to add the new unavailable user
  //similar to saveCourse
}

/*
const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};

const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets); 
  else moveCourse(course);
};
*/

const saveToFirebase = ({ schedule }) => {
  //firebase.database().ref().set(schedule);
}

export default ScheduleEntry
