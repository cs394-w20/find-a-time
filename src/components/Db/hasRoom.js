import db from "./firebaseConnect";

// room existence check
const hasRoom = async ({roomId}) =>{
    let snapshot = await db.ref('rooms/' + roomId).once('value');

    return !(snapshot.val() === null)

};

export default hasRoom;