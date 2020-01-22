// setting up configuration for the app.
import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";


const GetStartEndTimeForRoomId = async (roomId)=>{
    let time_interval=null;
    const process = (snapshot) =>{
        time_interval = snapshot.val()||"MISSING"
    };
    await db.ref('/rooms/' +roomId+"/time_interval/").once('value',process);
    return time_interval;
};

export default GetStartEndTimeForRoomId;
