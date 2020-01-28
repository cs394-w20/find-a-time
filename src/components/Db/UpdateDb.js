// setting up configuration for the app.
import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";
import {HOURS, MINUTES} from "../../constants";

const createTimes = () => {
    return HOURS.map(function (item) {
        return MINUTES.map(function (item2) {
            return `${item}:${item2}`;
        })
    }).flat()
};

const HOURS_AND_MINUTES = createTimes();

const addFreeInterval = ({roomId, date, interval, userName}) => {
    db.ref('rooms/' + roomId + "/data/" + date + "/" + interval + "/" + userName)
        .remove().then(() => {
        console.log("Remove succeeded.")
    })
        .catch((error) =>{
            console.log("Remove failed: " + error.message)
        });
};

const addBusyInterval = ({roomId, date, interval, userName, type}) => {
    db.ref('rooms/' + roomId + "/data/" + date + "/" + interval)
        .child(userName)
        .set(type)
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
const UpdateDb = ({userName, roomId, intervalData, updateType}) => {

    let dateList = Object.keys(intervalData);
    let i, j, busyIntervalSet, date, interval;
    for (i = 0; i < dateList.length; i++) {
        date = dateList[i];
        console.log(date)
        console.log(intervalData)

        if (!(isEmpty(intervalData[date]))) {
            busyIntervalSet = new Set(Object.keys(intervalData[date]));
            console.log('busyintervalset')
            console.log(busyIntervalSet)
            /**
             * Adds busy and free intervals. Loops through the all the hr:mm pairs and checks if
             * this pair is in `busyIntervalSet` if so it updates db w/ busy, otherwise it update
             * db with free.
             */
            for (j = 0; j < HOURS_AND_MINUTES.length; j++) {
                interval = HOURS_AND_MINUTES[j];
                if (busyIntervalSet.has(interval)) {
                    console.log('hi')
                    addBusyInterval({"roomId": roomId, "userName": userName, "date": date, "interval": interval, "type": updateType})
                } else {
                    addFreeInterval({"roomId": roomId, "userName": userName, "date": date, "interval": interval})
                }

            }

        }else{
            // updates the db w/ free for all the dates the user is missing interval data.
            for (j = 0; j < HOURS_AND_MINUTES.length; j++) {
                interval = HOURS_AND_MINUTES[j];
                addFreeInterval({"roomId": roomId, "userName": userName, "date": date, "interval": interval})
            }
        }
    }

};


export default UpdateDb;


