// setting up configuration for the app.
import 'firebase/database';
import 'firebase/auth';
import db from "../Db/firebaseConnect";

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
    return await db.ref('rooms/'+roomId).once('value').val();
};

const GetRoomsByUser = async ({email})=>{


    let roomlist =null;
    let userrooms =null;
    const process = (snapshot) =>{
        roomlist = snapshot.val()||{}
    };
    await db.ref('rooms').once('value',process);
    const process2 = (snapshot) =>{
        userrooms = snapshot.val()||{}
    };
    await db.ref('/users/' + email+"/active_rooms/").once('value',process2);
    console.log(roomlist);
    console.log(userrooms);
    /* var result = [];
    for(var i in roomlist)
        result[i] = roomlist[i];
    console.log(result); */
    //return roomlist;

    return sampleData
};
export default GetRoomsByUser;