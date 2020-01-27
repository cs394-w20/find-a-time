import 'firebase/database';
import 'firebase/auth';
import db from "./firebaseConnect";

const AddUserToRoom = async ({email, userName, roomId, picture}) =>{
        await db.ref('rooms/' + roomId + "/users/"+email +"/")
            .set({name:userName,picture:picture})
            .catch(error => alert(error));
};

export default AddUserToRoom;
