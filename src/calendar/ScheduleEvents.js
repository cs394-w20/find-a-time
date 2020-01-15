import React, { useEffect, useState } from "react";

const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '30']
const dates = ['M', 'Tu', 'W', 'Th', 'F']; // replace this with the dates, try to get from gcal



//this creates every possible hour/minute combindation
const createTimes = () => {
    return hours.map(function (item) {
        return minutes.map(function (item2) {
            return `${item}:${item2}:00`;
        })
    }).flat()
}

const times = createTimes();

const AddEvents = (events) => {
    //for each event
    console.log('hi');
    console.log(events);
    events.map(event =>
        findIntervals(event))
    //find which intervals it falls under
    //for each busy interval call addUnavailableUser(name, interval)
}

const findIntervals = (event) => {
    console.log(event);
    const start = event.start.dateTime;//.split('T', 1);
    var d = new Date(start);
    var newstart = d.toUTCString();
    const end = toString(event.end.dateTime).split('T', 1);
    console.log(start);
    console.log(newstart);
    console.log(end);
}

const addUnavailableUser= ({id, name, date, interval}) => {
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

export default AddEvents;
