// setting up configuration for the app.
import "firebase/database"
import "firebase/auth"
import db from "../Db/firebaseConnect"
import {
  normalEmailToFirebaseEmail,
  firebaseEmailToNormalEmail
} from "components/Utility"
import FilterOldRooms from "./FilterOldRooms"
import { DATE_FORMAT } from "../../constants"
import moment from "moment"

const sampleRoom1 = {
  roomId: 1,
  users: {
    "suzy@northwestern_edu": {
      name: "Suzy Linter",
      picture:
        "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
    },
    "jide@northwestern_edu": {
      name: "Jidé",
      picture:
        "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
    },
    "julia@northwestern_edu": {
      name: "Julia",
      picture:
        "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
    }
  },
  time_interval: {
    start: "2020-01-20",
    end: "2020-01-22"
  },
  meta_data: {
    title: "CS 396 Project v3",
    description:
      "Make sure you fill out this form so we can find a time to meet weekly!",
    room_owner: "suzy@northwestern_edu"
  }
};

const sampleRoom2 = {
  roomId: 19,
  users: {
    "suzy@northwestern_edu": {
      name: "Suzy",
      picture:
        "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
    }
  },
  time_interval: {
    start: "2020-02-10",
    end: "2020-02-12"
  },
  meta_data: {
    title: "CS 394 Meeting",
    description:
      "Make sure you fill out this form so we can find a time to meet weekly!",
    room_owner: "suzy@northwestern_edu"
  }
};

const sampleRoom3 = {
  roomId: 20,
  users: {
    "suzy@northwestern_edu": {
      name: "Suzy",
      picture:
        "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
    }
  },
  time_interval: {
    start: "2020-03-10",
    end: "2020-03-12"
  },
  meta_data: {
    title: "Chess Club meeting",
    description:
      "Make sure you fill out this form so we can find a time to meet weekly!",
    room_owner: "suzy@northwestern_edu"
  }
};

const sampleRoom4 = {
  roomId: 77,
  users: {
    "suzy@northwestern_edu": {
      name: "Suzy",
      picture:
          "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
    }
  },
  time_interval: {
    start: "2020-03-11",
    end: "2020-03-12"
  },
  meta_data: {
    title: "Cheeese",
    description:
        "Make sure you fill out this form so we can find a time to meet weekly!",
    room_owner: "suzy@northwestern_edu"
  }
};

// ReactSearchBox `searches' on value, and the payload is key.
const sampleData = [
  {
    key: sampleRoom1,
    value: "CS 396 Project v3"
  },
  {
    key: sampleRoom2,
    value: "CS 394 Meeting"
  },
  {
    key: sampleRoom3,
    value: "Chess Club meeting"
  },
  {
    key: sampleRoom4,
    value: "Cheeese"
  }
];

/**
 * Gets the room given a roomId
 */
const getRoom = async ({ roomId }) => {
  let snapval = await db.ref("rooms/" + roomId).once("value")
  return snapval.val() || {}
};

/**
 * Gets the roomId given a user's email
 * @param email - example: dominicanene@gmail.com
 */
const getUserRoomIds = async ({ email }) => {
  let snapval = await db
    .ref("users/" + normalEmailToFirebaseEmail(email) + "/active_rooms")
    .once("value")
  return snapval.val() || {}
};

/**
 * Gets the rooms given a list of roomIds
 * @return {Promise<[]>} - a list of rooms wrapped in a promise
 */
const getRoomsFromRoomIds = async ({ roomIds }) => {
  let rooms = [];
  let room;
  let roomId;
  for (let i = 0; i < roomIds.length; i++) {
    roomId = roomIds[i];
    room = await getRoom({ roomId });
    room["roomId"] = roomIds[i];
    rooms.push(room)
  }

  return rooms
};

// Sorts an array of rooms by Start Date
let sortTime = arr => {
  let time1 = moment();
  let time2 = moment();
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let min = i;
    for (let j = i + 1; j < len; j++) {
      time1 = moment(arr[min].key.time_interval.start, DATE_FORMAT);
      time2 = moment(arr[j].key.time_interval.start, DATE_FORMAT);
      if (time1.isAfter(time2)) {
        min = j
      }
    }
    if (min !== i) {
      let tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp
    }
  }
  return arr
};

const GetRoomsByUser = async ({ email }) => {
  // get the list of roomIds for the user
  let roomIds = await getUserRoomIds({ email });
  roomIds = Object.keys(roomIds);

  // get the rooms by using the list of roomIds
  let rooms = await getRoomsFromRoomIds({ roomIds });

  // filter the old rooms from the current rooms
  let currentRooms = FilterOldRooms({ email, rooms });

  // change emails to normal emails
  let userlist = 0
  for (let i = 0; i < currentRooms.length; i++) {
    userlist = Object.keys(currentRooms[i].users);
    for (let j = 0; j < userlist.length; j++) {
      currentRooms[i].users[firebaseEmailToNormalEmail(userlist[j])] =
        currentRooms[i].users[userlist[j]];
      delete currentRooms[i].users[userlist[j]]
    }
  }

  // put rooms into format for YourEvents
  let result = [];
  for (let i = 0; i < currentRooms.length; i++) {
    result.push({
      key: currentRooms[i],
      value: currentRooms[i].meta_data.title
    })
  }

  // sort rooms by Start Date
  let sortedresult = sortTime(result);
  return sortedresult
};

export default GetRoomsByUser
