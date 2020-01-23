import UpdateDb from "../Db/UpdateDb";
import moment from 'moment'
import {DATE_FORMAT} from "../../constants";


//const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minutes = ['00', '30'];
//const dates = ['M', 'Tu', 'W', 'Th', 'F']; // replace this with the dates, try to get from gcal

/**
 * @private Adds all the properties from the obj2 parameter to the obj1 parameter and returns obj1
 * @param {string} [obj1] passed by reference, the object which will be populated with the new properties
 * @param {string} [targetValue] The object which holds all the properties which are to be merged
 */
const _mergeRecursive = function(obj1, obj2) {
    //iterate over all the properties in the object which is being consumed
    for (var p in obj2) {
        // Property in destination object set; update its value.
        if ( obj2.hasOwnProperty(p) && typeof obj1[p] !== "undefined" ) {
            _mergeRecursive(obj1[p], obj2[p]);

        } else {
            //We don't have that level in the hierarchy so add it
            obj1[p] = obj2[p];

        }
    }
};


const AddEvents = ({roomId, userName, events, startDate, endDate}) => {

    // iterate through the events and calculate the slices they contain
    // then merge all the slices into one big json
    let i;
    let intervalData={};
    for (i=0;i<events.length; i++){
        if (i===0){
            intervalData=findIntervals(roomId, userName,events[i])
        }else{
            _mergeRecursive(intervalData,findIntervals(roomId, userName,events[i]))
        }
    }

    // loops through the dates between startDate and endDate (inclusive) and adds
    // a empty entry if the date does not exist in `intervalData`
    // This is so we can know when the user is busy and free. Implicitly if a day
    // is not in the events data, then it is free.
    let date;
    for (let m =startDate; m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
        date = m.format(DATE_FORMAT);
        if (!(date in intervalData)){
            intervalData[date]={};
        }
    }

    // update the firebase with the user's data for the given roomID
    UpdateDb({roomId,userName,intervalData});




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

export const getDay = (time) => {
    return time.format(DATE_FORMAT)
};

const findIntervals = (roomId, userName, event) => {
    const start = getStartTime(event);
    const end = getEndTime(event);
    return findBuckets(roomId, userName, start, end);
};


const findBuckets = (roomId, userName, currTime, endTime) => {

    // Finding the first time interval -- figuring out what minute to start at
    // if min is in [0,30) then set i=0, otherwise set i=1.
    let i = 0;
    while (i < minutes.length - 1){
        if (Number(minutes[i]) <= currTime.minute() && currTime.minute() < Number(minutes[i + 1])){
            currTime.minutes(Number(minutes[i]));
            break;
        }
        i += 1;
    }


    // keep incrementing currTime by 30min until currTime>= endTime then stop,
    // for each day record the 30min intervals seen in `dayPayload`,
    // once the day changes add `dayPayload` to `payload`
    let currentDay=  getDay(currTime);
    let dayPayload = {};
    let payload = {};

    while (currTime.isBefore(endTime)) {
        dayPayload[`${currTime.hour()}:${minutes[i]}`] = 1;
        i = (i+1)%(minutes.length);
        currTime.add(Number(minutes[1]),'minutes');

        if (getDay(currTime) !== currentDay){
            payload[currentDay] = dayPayload;
            currentDay = getDay(currTime);
            dayPayload = {};
        }
    }

    payload[currentDay]=dayPayload;

    return payload;

};
export default AddEvents;
