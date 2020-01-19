// setting up configuration for the app.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";
import {HOURS, MINUTES} from "../../constants";



const getHoursAndMinutes = () => {
    let hrAndMin = [];
    let hr;
    let i;
    for (hr in HOURS) {
        for (i = 0; i < MINUTES.length; i++) {
            hrAndMin.push(`${hr}:${MINUTES[i]}`)
        }
    }
    return hrAndMin;
};

const HOURS_AND_MINUTES = getHoursAndMinutes();

const addFreeInterval = ({roomId, date, interval, userName}) => {
    db.ref('rooms/' + roomId + "/data/" + date + "/" + interval + "/" + userName)
        .remove().then(() => {
        console.log("Remove succeeded.")
    })
        .catch((error) =>{
            console.log("Remove failed: " + error.message)
        });
};

const addBusyInterval = ({roomId, date, interval, userName}) => {
    db.ref('rooms/' + roomId + "/data/" + date + "/" + interval)
        .child(userName)
        .set(1)
        .catch(error => alert(error));
};

/**
 * Checks if a json object is empty
 * @type {Function}
 */
const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

/**
 * Updates firebaseDb with event data
 * @param roomId (string): the id of the room
 * @param data (string): the data
 * @param userName (string): the username
 */
const UpdateDb = ({userName, roomId, data}) => {
    let dateList = Object.keys(data);
    let i, j, busyIntervalSet, date, interval;

    for (i = 0; i < dateList.length; i++) {
        date = dateList[i];

        if (!(isEmpty(data[date]))) {
            busyIntervalSet = new Set(Object.keys(data[date]));

            for (j = 0; j < HOURS_AND_MINUTES.length; j++) {
                interval = HOURS_AND_MINUTES[j];
                if (busyIntervalSet.has(interval)) {
                    addBusyInterval({"roomId": roomId, "userName": userName, "date": date, "interval": interval})
                } else {
                    addFreeInterval({"roomId": roomId, "userName": userName, "date": date, "interval": interval})
                }

            }

        }
    }


};


export default UpdateDb;


