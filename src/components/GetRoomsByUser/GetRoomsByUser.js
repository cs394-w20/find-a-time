// setting up configuration for the app.
import 'firebase/database';
import 'firebase/auth';
import db from "../Db/firebaseConnect";

const GetRoomsByUser = async (user)=>{
    let roomlist =null;
    let userrooms =null;
    const process = (snapshot) =>{
        roomlist = snapshot.val()||{}
    };
    await db.ref('rooms').once('value',process);
    const process2 = (snapshot) =>{
        userrooms = snapshot.val()||{}
    };
    await db.ref('/users' + user+"/active_rooms/").once('value',process2);
    console.log(roomlist);
    console.log(userrooms);
    /* var result = [];
    for(var i in roomlist)
        result[i] = roomlist[i];
    console.log(result); */
    return roomlist;
};
export default GetRoomsByUser;