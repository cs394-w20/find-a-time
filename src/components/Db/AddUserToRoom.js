import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";

// Adds user to room iff the room exists
const AddUserToRoom = async ({email, userName, roomId, picture}) =>{
        let dbRef = db.ref('rooms/' + roomId);

        await dbRef.transaction(async (room) => {
                if (room !== null) {
                        db.ref('rooms/' + roomId + "/users/" + email + "/")
                            .set({name: userName, picture: picture})
                            .catch(error => alert(error));

                        db.ref('users/' + email + "/active_rooms/" + roomId + "/")
                            .set(1)
                            .catch(error => alert(error));
                }
        });

};

export default AddUserToRoom;
