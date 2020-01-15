// setting up configuration for the app.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCH3KUTJ4R8YRDS6htIJrYORxiknxfd5dQ",
    authDomain: "findatime-4fb7c.firebaseapp.com",
    databaseURL: "https://findatime-4fb7c.firebaseio.com",
    projectId: "findatime",
    storageBucket: "findatime.appspot.com",
    messagingSenderId: "361706564526",
    appId: "1:361706564526:web:7e5f7bbfcc97dd023a763f",
    measurementId: "G-QKQSXZLMYZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Get a reference to the database service
const db = firebase.database();


const addFreeInterval = ({eventId, date, interval, userName}) => {
    db.ref('events/' + eventId + "/data/" + date + "/" + interval + "/" + userName)
        .remove().then(() => {
        console.log("Remove succeeded.")
    })
        .catch((error) =>{
            console.log("Remove failed: " + error.message)
        });
};

const addBusyInterval = ({eventId, date, interval, userName}) => {
    db.ref('events/' + eventId + "/data/" + date + "/" + interval)
        .child(userName)
        .set(1)
        .catch(error => alert(error));
};

/**
 * Updates firebaseDb with event data
 * @param eventId (string): the id of the event
 * @param date (string): the date
 * @param interval (string): the time interval
 * @param userName (string: the username
 * @param isBusy (boolean): indicates the type of update
 * @example {"eventId": 1, "date": "2020-01-10", "interval": "09:30:00", "userName": "Dan", "isBusy": 1};
 */
const UpdateDb = ({eventId, date, interval, userName, isBusy}) => {
    if (isBusy) {
        addBusyInterval({eventId, date, interval, userName});
    } else {
        addFreeInterval({eventId, date, interval, userName});
    }
};

export default UpdateDb;


