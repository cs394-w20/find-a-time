import React, {useEffect, useState} from "react";
import UpdateDb from "../Db/UpdateDb";

var moment = require('moment');


const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '30'];
const dates = ['M', 'Tu', 'W', 'Th', 'F']; // replace this with the dates, try to get from gcal


//eventId, date, interval, userName, isBusy
const AddEvents = (eventId, userName, events) => {
    console.log(events);
    events.map(event =>
        findIntervals(eventId, userName, event));
    //findIntervals(eventId, userName, events[0]);

};


const getStartTime = (event) => {
    var start = event.start.dateTime;
    if (!start) {
        start = event.start.date;
    }
    return moment(start);
};

const getEndTime = (event) => {
    var end = event.end.dateTime;
    if (!end) {
        end = event.end.date;
    }
    return moment(end);
};

const getDay = (time) => {
    time = time.toISOString().split('T', 1);
    return time
};

const findIntervals = (eventId, userName, event) => {
    const start = getStartTime(event);
    const end = getEndTime(event);
    findBuckets(eventId, userName, start, end);
};


const findBuckets = (eventId, userName, curr, end) => {
    const endMin = end.get('minute');
    const endHour = end.get('hour');
    let i = 0;

    console.log(Number(minutes[0]));
    // 0,1

    // Getting the first bucket -- figuring out what minute to start at
    while (i < minutes.length - 1) {
        if (Number(minutes[i]) <= curr.get('minute') && curr.get('minute') < Number(minutes[i + 1])) {
            break
        }
        i += 1;
    }

    //console.log("Finding intervals");
    let returnList = [];
    let payload;

    // eslint-disable-next-line eqeqeq

    //start: 6pm    end: 8pm , today
    // i = 0
    // i =1

    // Keep  changing curr, and while curr != end{day, hr, min}
    console.log("Herrrrrrrr");
    console.log(curr.toString());
    console.log(end.toString());
    console.log(curr.get('date')); //wrong
    console.log(getDay(curr)); //wrong



    console.log(end.get('day')); //wrong
    console.log(curr.get('hour'));
    console.log(endHour);
    console.log(Number(minutes[i]));
    console.log(endMin);





    while (!(getDay(curr) === getDay(end) && curr.get('hour') === endHour/* && Number(minutes[i]) > endMin*/)) {
        payload = {
            "eventId": eventId,
            "date": getDay(curr),
            "userName": userName,
            "interval": `${curr.get('hour')}:${minutes[i]}`,
            "isBusy": true
        };

        returnList.push(payload);
        console.log("hey");
        // UpdateDb(payload);
        i += 1;
        if (i === minutes.length) {
            curr.add(1, 'h');
            i = 0;
        }
    }

    console.log("length of list: " + returnList.length);
    returnList.forEach((item) => {
        UpdateDb(item)
    });


};

export default AddEvents;
