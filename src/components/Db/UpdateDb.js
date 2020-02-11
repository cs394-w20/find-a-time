// setting up configuration for the app.
import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";
import { HOURS, MINUTES } from "../../constants";
import moment from 'moment';

const createTimes = async({roomId}) => {
    const selectedhours = await SELECTEDHOURS({roomId})
    return selectedhours.map(function (item) {
        return MINUTES.map(function (item2) {
            return `${item}:${item2}`;
        })
    }).flat()
};

const SELECTEDHOURS = async ({ roomId }) => {
    let snapshot = await db.ref('rooms/' + roomId + '/hour_interval').once('value');
    var hourlst = [];
    var start = moment()
    //var strstart = hours.start_time;
    start.set({hour: Number(snapshot.val().start_time.substring(0, 2)), minute: 0, second: 0, millisecond: 0});
    var end = moment();
    end.set({hour: Number(snapshot.val().end_time.substring(0, 2)), minute: 0, second: 0, millisecond: 0});
    console.log('end hour', start, end)
    while (start.isBefore(end)) {
        hourlst.push(start.format("HH"));
        start.add(1, "h");
    }
    return hourlst;

};

//const HOURS_AND_MINUTES = createTimes();

const addFreeInterval = ({ roomId, date, interval, userName }) => {
    let dbRef = db.ref('rooms/' + roomId + "/data/" + date + "/" + interval + "/" + userName);
    dbRef.transaction((autoOrManual) => {
        if (autoOrManual === "MANUAL") {
            // Do nothing
            return;
        } else {
            // Delete record if it exists
            dbRef.remove()
                .catch((error) => {
                    console.log("remove failed: " + error.message)
                });
            return;
        }
    }).catch((error) => {
        console.log("addFreeInterval failed: " + error.message)
    });
};


const addBusyInterval = ({ roomId, date, interval, userName, type }) => {
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
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
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
const UpdateDb = async ({ userName, roomId, intervalData, updateType }) => {
    //SELECTEDHOURS({ roomId });
    const HOURS_AND_MINUTES = await createTimes({roomId});
    console.log('hours and mins', HOURS_AND_MINUTES);
    let dateList = Object.keys(intervalData);
    let i, j, busyIntervalSet, date, interval;
    for (i = 0; i < dateList.length; i++) {
        date = dateList[i];
        // console.log(date)
        // console.log(intervalData)

        if (!(isEmpty(intervalData[date]))) {
            busyIntervalSet = new Set(Object.keys(intervalData[date]));
            /**
             * Adds busy and free intervals. Loops through the all the hr:mm pairs and checks if
             * this pair is in `busyIntervalSet` if so it updates db w/ busy, otherwise it update
             * db with free.
             */
            for (j = 0; j < HOURS_AND_MINUTES.length; j++) {
                interval = HOURS_AND_MINUTES[j];
                if (busyIntervalSet.has(interval)) {
                    addBusyInterval({
                        "roomId": roomId,
                        "userName": userName,
                        "date": date,
                        "interval": interval,
                        "type": updateType
                    })
                } else {
                    addFreeInterval({ "roomId": roomId, "userName": userName, "date": date, "interval": interval })
                }

            }

        } else {
            // updates the db w/ free for all the dates the user is missing interval data.
            for (j = 0; j < HOURS_AND_MINUTES.length; j++) {
                interval = HOURS_AND_MINUTES[j];
                addFreeInterval({ "roomId": roomId, "userName": userName, "date": date, "interval": interval })
            }
        }
    }

};


export default UpdateDb;
