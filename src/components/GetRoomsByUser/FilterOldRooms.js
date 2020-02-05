import db from "../Db/firebaseConnect";
import moment from "moment";
import {DATE_FORMAT} from "../../constants";
import {normalEmailToFirebaseEmail} from "components/Utility";


/**
 * Removes old rooms from the Db
 */
const removeRooms = async ({oldRooms,email})=>{
    const _removeRoom = (roomId) =>{
        db.ref().transaction(()=>{
                // remove entry from the /users
                db.ref('/users/'+normalEmailToFirebaseEmail(email)+'/active_rooms/'+roomId).remove();
                // remove entry from the /rooms
                db.ref('/rooms/'+roomId).remove()
            }
        ).catch((e)=>console.error("Error in deleting a room",e));
    };

    oldRooms.forEach((room)=>_removeRoom(room.roomId));
};

/**
 * Filters the stale rooms from the current rooms rooms
 * and launches a async function in the background to delete the old
 * rooms
 * @param email - email address of the user in question
 * @param rooms - a list of rooms from dB each room. Note each room needs to have
 *                a extra parameter called "roomId" which holds the roomId.
 *                If you get data from Db this "roomId" is automatically excluded
 *                so must add this parameter manually, eg room["roomId"]=1, for
 *                each room.
 * @return list of current rooms
 */
const FilterOldRooms = ({email,rooms}) =>{
    const today = moment();
    let oldRooms = [];

    // used in `reduce` to filter the stale rooms from the current rooms
    const _filterRooms = (currentRooms, room) => {
        let endDay = moment(room.time_interval.end, DATE_FORMAT);

        if (today.isAfter(endDay)){
            oldRooms.push(room);
            return currentRooms
        }else{
            currentRooms.push(room);
            return currentRooms
        }
    };

    let currentRooms = rooms.reduce(_filterRooms,[]);
    // async remove of old rooms -- don't care about promise
    removeRooms({email,oldRooms});
    return currentRooms;

};

export default FilterOldRooms;