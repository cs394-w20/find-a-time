
import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";

export const addRoomToUser = async ({email, roomId})=>{
        await db.ref('users/' + email + "/active_rooms/" + roomId + "/")
            .set(1)
            .catch(error => alert(error));
};
// Adds user to room iff the room exists
const AddUserToRoom = async ({email, userName, roomId, picture}) =>{
        await db.ref('rooms/' + roomId + "/users/" + email + "/")
            .set({name: userName, picture: picture})
            .catch(error => alert(error));
        await addRoomToUser({email, roomId});
};



export default AddUserToRoom;
