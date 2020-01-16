import React, { useEffect, useState } from "react";
import UpdateDb from "../updateDb/UpdateDb";
var moment = require('moment');



const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '30']
const dates = ['M', 'Tu', 'W', 'Th', 'F']; // replace this with the dates, try to get from gcal


//eventId, date, interval, userName, isBusy
const AddEvents = (eventId, userName, events) => {
    events.map(event =>
        findIntervals(eventId, userName, event))
}

const findIntervals = (eventId, userName, event) => {
    const start = getStartTime(event);
    const end = getEndTime(event);
    findBuckets(eventId, userName, start, end);
}

const getStartTime = (event) => {
    var start = event.start.dateTime;
    if (!start){
        start = event.start.date;
    }
    return moment(start);
}

const getEndTime = (event) => {
    var end = event.end.dateTime;
    if (!end){
        end = event.end.date;
    }    
    return moment(end);
}

const getDay = (time) => {
    time = time.toISOString().split('T', 1);
    return time
}

const findBuckets = (eventId, userName, curr, end) => {
    const endMin = end.get('minute');
    const endHour = end.get('hour');
    var i = 0;
    while (i < minutes.length){
        if (minutes[i] <= curr.get('minute') < minutes[i + 1]){
            break
        }
        i += 1;
    }

    while (!(curr.get('day') == end.get('day') && curr.get('hour') == endHour && minutes[i] > endMin)){
        //eventId, date, interval, userName, isBusy
        UpdateDb(eventId, getDay(curr), userName, `${curr.get('hour')}:${minutes[i]}`, true);
        i += 1;
        if (i == minutes.length){
            curr.add(1, 'h');
            i = 0;
        }        
    }
}

export default AddEvents;
