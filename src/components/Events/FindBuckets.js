import UpdateDb from "../Db/UpdateDb";
import moment from 'moment'
import {DATE_FORMAT, MINUTES} from "../../constants";



const getDay = (time) => {
    return time.format(DATE_FORMAT)
};

const findBuckets = (roomId, userName, currTime, endTime) => {

    // Finding the first time interval -- figuring out what minute to start at
    // if min is in [0,30) then set i=0, otherwise set i=1.
    let i = 0;
    while (i < MINUTES.length - 1){
        if (Number(MINUTES[i]) <= currTime.minute() && currTime.minute() < Number(MINUTES[i + 1])){
            currTime.minutes(Number(MINUTES[i]));
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
        dayPayload[`${currTime.hour()}:${MINUTES[i]}`] = 1;
        i = (i+1)%(MINUTES.length);
        currTime.add(Number(MINUTES[1]),'minutes');

        if (getDay(currTime) !== currentDay){
            payload[currentDay] = dayPayload;
            currentDay = getDay(currTime);
            dayPayload = {};
        }
    }

    payload[currentDay]=dayPayload;

    return payload;

};
export default findBuckets;