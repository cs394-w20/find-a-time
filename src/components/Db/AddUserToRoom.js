import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";

const AddUserToRoom = async ({userId, userName, roomId}) =>{
        await db.ref('rooms/' + roomId + "/users/")
            .set(userName)
            .catch(error => alert(error));
};

export default AddUserToRoom;
