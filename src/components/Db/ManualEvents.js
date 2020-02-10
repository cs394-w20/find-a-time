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

const HOURS_AND_MINUTES = createTimes();

const addFreeInterval = ({ roomId, date, interval, userName }) => {
    let dbRef = db.ref('rooms/' + roomId + "/data/" + date + "/" + interval + "/" + userName);
    dbRef.transaction((autoOrManual) => {
            if (autoOrManual === "AUTO") {
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

const ManualEvents = ({ roomId, userName, start, end }) => {
    console.log('in manual', moment(start), moment(end));
    //console.log('in manual', moment(start.toDateLocal()), moment(end.toDateLocal()))
    const intervalData = findBuckets(roomId, userName, moment(start), moment(end));//moment(start.toDateLocal()), moment(end.toDateLocal()));
    console.log(intervalData)
    let dateList = Object.keys(intervalData);
    let i, j, busyIntervalSet, date, interval;
    for (i = 0; i < dateList.length; i++) {
        date = dateList[i];

        if (!(isEmpty(intervalData[date]))) {
            busyIntervalSet = new Set(Object.keys(intervalData[date]));
            for (j = 0; j < HOURS_AND_MINUTES.length; j++) {
                interval = HOURS_AND_MINUTES[j];
                if (busyIntervalSet.has(interval)) {
                        console.log('hi remove interval', interval, date, roomId, userName)
                        addFreeInterval({roomId, date, interval, userName})
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


export default ManualEvents;