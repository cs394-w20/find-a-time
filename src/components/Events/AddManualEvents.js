import UpdateDb from "../Db/UpdateDb";
import moment from 'moment'
import {DATE_FORMAT} from "../../constants";
import findBuckets from "./FindBuckets";

const AddManualEvents = ({roomId, userName, start, end})=> {
    const intervalData = findBuckets(roomId, userName, start, end);
    UpdateDb({roomId,userName,intervalData, updateType: "MANUAL"});
}


export default AddManualEvents;
