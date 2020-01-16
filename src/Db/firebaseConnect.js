import 'firebase/database';
import 'firebase/auth';
import firebase from "firebase";

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
firebase.initializeApp(firebaseConfig);
// Get a reference to the database service
const db = firebase.database();

export default db;