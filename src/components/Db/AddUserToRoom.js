import "firebase/database"
import "firebase/auth"
import db from "./firebaseConnect"

const AddUserToRoom = async ({ email, userId, userName, roomId, picture }) => {
  await db
    .ref("rooms/" + roomId + "/users/" + userId + "/")
    .set({ name: userName, picture: picture, email, id: userId })
    .catch(error => alert(error))
}

export default AddUserToRoom
