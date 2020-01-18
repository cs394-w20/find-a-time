import React, {useEffect, useState} from "react";
import UpdateDb from "../Db/UpdateDb";
import moment from 'moment'


//const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '30'];
//const dates = ['M', 'Tu', 'W', 'Th', 'F']; // replace this with the dates, try to get from gcal

//roomId, date, interval, userName, isBusy
const AddEvents = (roomId, userName, events) => {
    events.map(event => findIntervals(roomId, userName, event));
};


const getStartTime = (event) => {
    let start = event.start.dateTime;
    if (!start) {
        start = event.start.date;
    }
    return moment(start);
};

const getEndTime = (event) => {
    let end = event.end.dateTime;
    if (!end) {
        end = event.end.date;
    }
    return moment(end);
};

const getDay = (time) => {
    return time.format('YYYY-MM-DD')
};

const findIntervals = (roomId, userName, event) => {
    const start = getStartTime(event);
    const end = getEndTime(event);
    findBuckets(roomId, userName, start, end);
};


const findBuckets = (roomId, userName, startTime, endTime) => {


    // Finding the first time interval -- figuring out what minute to start at
    // if min is in [0,30) then set i=0, otherwise set i=1.
    let i;
    if (Number(minutes[0]) <= startTime.minute() && startTime.minute() < Number(minutes[1])){
        i = 0;
        // offset the startTime to the 0th min
        startTime.subtract(startTime.minute(),'minutes');

    }else{
        i = 1;
        // offset the startTime to the 30th min
        startTime.subtract(60-startTime.minute(),'minutes');

    }


    // keep incrementing startTime by 30min until startTime>= endTime then stop,
    // for each day record the 30min intervals seen in `dayPayload`,
    // once the day changes add `dayPayload` to `payload`
    let currentDay=  getDay(startTime);
    let dayPayload = {};
    let payload = {};


    while ((startTime < endTime)) {
        dayPayload[`${startTime.hour()}:${minutes[i]}`] = 1;
        i = (i+1)%(minutes.length);
        startTime.add(30,'minutes');

        if (getDay(startTime) !== currentDay){
            payload[currentDay] = dayPayload;
            currentDay = getDay(startTime);
            dayPayload = {};
        }
    }

    payload[currentDay]=dayPayload;

    // the actual payload w/ identifying information
    let actualPayload = {};
    actualPayload["userName"]= userName;
    actualPayload["roomId"]= roomId;
    actualPayload["data"] = payload;
    // push data to firebase
    UpdateDb(actualPayload);

};

export default AddEvents;
