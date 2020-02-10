import db from "./firebaseConnect";
//import AddManualEvents from "../Events/AddManualEvents"
import moment from "moment";
import findBuckets from "../Events/FindBuckets";
import UpdateDb from "./UpdateDb"
import { HOURS, MINUTES } from "../../constants";

const createTimes = () => {
    return HOURS.map(function (item) {
        return MINUTES.map(function (item2) {
            return `${item}:${item2}`;
        })
    }).flat()
};

const inBusyList = async ({ path }) => {
    let snapshot = await db.ref(path).once("value");
    return !(snapshot.val() ===null)
}

const HOURS_AND_MINUTES = createTimes();

const addFreeInterval = ({ roomId, date, interval, userName }) => {
    db.ref('rooms/' + roomId + "/data/" + date + "/" + interval + "/" + userName)
        .remove().then(() => {
            console.log("Remove succeeded.")
        })
        .catch((error) => {
            console.log("Remove failed: " + error.message)
        });
};

const ManualEvents = ({ roomId, userName, start, end }) => {
    console.log('in manual', moment(start.toDateLocal()), moment(end.toDateLocal()))
    const intervalData = findBuckets(roomId, userName, moment(start.toDateLocal()), moment(end.toDateLocal()));
    console.log(intervalData)
    let dateList = Object.keys(intervalData);
    let i, j, busyIntervalSet, date, interval;
    for (i = 0; i < dateList.length; i++) {
        date = dateList[i];

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
                    var path = 'rooms/' + roomId + "/data/" + date + "/" + interval + "/" + userName;
                    if (!inBusyList({ path })) {//((db.ref('rooms/' + roomId + "/data/" + date + "/" + interval + "/")).hasChild(userName)) {
                        console.log('hi')
                        addFreeInterval(roomId, date, interval, userName)
                    }
                    else {
                        console.log('add')
                        db.ref('rooms/' + roomId + "/data/" + date + "/" + interval)
                            .child(userName)
                            .set("MANUAL")
                            .catch(error => alert(error));
                    }

                }
            }
        }
    }
}

const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

const AddManualEvents = ({ roomId, userName, intervalData }) => {
    //const intervalData = findBuckets(roomId, userName, moment(start.toDateLocal()), moment(end.toDateLocal()));
    UpdateDb({ roomId, userName, intervalData, updateType: "MANUAL" });
}

export default ManualEvents;