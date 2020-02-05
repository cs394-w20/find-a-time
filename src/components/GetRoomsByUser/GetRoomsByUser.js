// setting up configuration for the app.
import 'firebase/database';
import 'firebase/auth';
import db from "../Db/firebaseConnect";
import {normalEmailToFirebaseEmail} from "components/Utility";
import {FilterOldRooms} from "./index";

const sampleRoom1 = {
    "roomId": 1,
    "users": {
        "suzy@northwestern_edu": {
            "name": "Suzy",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        },
        "jide@northwestern_edu": {
            "name": "Jidé",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        },
        "julia@northwestern_edu": {
            "name": "Julia",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        }
    },
    "time_interval": {
        "start": "2020-01-20",
        "end": "2020-01-22"
    },
    "meta_data": {
        "title": "CS 396 Project v3",
        "description": "Make sure you fill out this form so we can find a time to meet weekly!",
        "room_owner": "suzy@northwestern_edu"
    }
};

const sampleRoom2 = {
    "roomId": 19,
    "users": {
        "suzy@northwestern_edu": {
            "name": "Suzy",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        }
    },
    "time_interval": {
        "start": "2020-01-10",
        "end": "2020-01-12"
    },
    "meta_data": {
        "title": "CS 394 Meeting",
        "description": "Make sure you fill out this form so we can find a time to meet weekly!",
        "room_owner": "suzy@northwestern_edu"
    }
};

const sampleRoom3 = {
    "roomId": 20,
    "users": {
        "suzy@northwestern_edu": {
            "name": "Suzy",
            "picture": "https://i.pinimg.com/originals/f0/03/44/f00344d904062ce92b4b3b146060d874.png"
        }
    },
    "time_interval": {
        "start": "2020-02-10",
        "end": "2020-02-12"
    },
    "meta_data": {
        "title": "Chess Club meeting",
        "description": "Make sure you fill out this form so we can find a time to meet weekly!",
        "room_owner": "suzy@northwestern_edu"
    }
};

// ReactSearchBox `searches' on value, and the payload is key.
const sampleData = [
    {
        key: sampleRoom1,
        value: 'CS 396 Project v3',
    },
    {
        key: sampleRoom2,
        value: 'CS 394 Meeting',
    },
    {
        key: sampleRoom3,
        value: 'Chess Club meeting',
    }
];


const getRoom = async ({roomId})=>{
    let snapval = await db.ref('rooms/'+roomId).once('value');
    return snapval.val()||{};
};

const getUserRoomIds = async ({email})=>{
    let snapval = await db.ref('users/'+normalEmailToFirebaseEmail(email)+"/active_rooms").once('value');
    return snapval.val()||{};
};


const GetRoomsByUser = async ({email})=>{

    // get the list of roomIds for the user
    let roomIds = await getUserRoomIds({email});
    roomIds =Object.keys(roomIds);
    console.log(roomIds);

    // get the rooms by using the list of roomIds
    let rooms =[];
    let room;
    let roomId;
    for (let i=0; i<roomIds.length;i++){
        roomId=roomIds[i];
        room = await getRoom({roomId});
        room["roomId"] = roomIds[i];
        rooms.push(room)
    }
    console.log(rooms);

    // filter the old rooms from the current rooms
    let currentRooms = FilterOldRooms({email, rooms});
    console.log(currentRooms);

   // for(var i in userrooms)
   //        userrooms["roomId"] = 1;
   // userrooms = FilterOldRooms(email,userrooms);

    /* var result = [];
    for(var i in userrooms)
        result.push({
        key: roomlist.(i["roomId"]),
        value: 'i["roomId"]',
    })
            roomlist.(i["roomId"]);
    console.log(result); */
    //return result;

    return sampleData
};
export default GetRoomsByUser;