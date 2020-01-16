// setting up configuration for the app.
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBb4_EJIIE5Cld3b8EUnJEki3XYd8wqdSM",
  authDomain: "find-a-time-19756.firebaseapp.com",
  databaseURL: "https://find-a-time-19756.firebaseio.com",
  projectId: "find-a-time-19756",
  storageBucket: "find-a-time-19756.appspot.com",
  messagingSenderId: "990635372360",
  appId: "1:990635372360:web:1c3b84e3ee6ce5fd084d7d",
  measurementId: "G-F6QD99Q788"
};

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
// Get a reference to the database service
const db = firebase.database();

const addFreeInterval = ({ eventId, date, interval, userName }) => {
  db.ref("rooms/" + eventId + "/data/" + date + "/" + interval + "/" + userName)
    .remove()
    .then(() => {
      console.log("Remove succeeded.");
    })
    .catch(error => {
      console.log("Remove failed: " + error.message);
    });
};

const addBusyInterval = ({ eventId, date, interval, userName }) => {
  db.ref("rooms/" + eventId + "/data/" + date + "/" + interval)
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
const UpdateDb = ({ eventId, date, interval, userName, isBusy }) => {
  console.log(eventId);
  if (isBusy) {
    addBusyInterval({ eventId, date, interval, userName });
  } else {
    addFreeInterval({ eventId, date, interval, userName });
  }
};

export default UpdateDb;
