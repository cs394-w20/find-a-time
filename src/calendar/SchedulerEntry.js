import React, { useEffect, useState } from "react";
// need to import database as db

const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '30']
const dates = ['M', 'Tu', 'W', 'Th', 'F']; // replace this with the dates, try to get from gcal

//1. create an empty schedule entry for each data/time option
//2. find the schedule based off id from database, compare times

const ScheduleEntry = id => {
    const times = createTimeEntries();
    var events = {};
    dates.map(function(item){
        events[item]= times;})
    return {id: id, events};
    //saveToFirebase(schedule);

}

const createTimeEntries = () => {
    const times = createTimes();
    var obj = {};
    times.map(function(item){
        obj[item] = [];})     
    return obj;
}

//this creates every possible hour/minute combindation
const createTimes = () => {
    return hours.map(function (item) {
        return minutes.map(function (item2) {
            return `${item}:${item2}:00`;
        })
    }).flat()
}

const saveToFirebase = ({ schedule }) => {

}

export default ScheduleEntry;
