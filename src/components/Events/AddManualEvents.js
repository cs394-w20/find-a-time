import UpdateDb from "../Db/UpdateDb";
import moment from 'moment'
import {DATE_FORMAT} from "../../constants";
import findBuckets from "./FindBuckets";

const AddManualEvents = ({roomId, userName, start, end})=> {
    console.log('beforetodate', start, end)
    console.log('todate', start.toDateLocal(), end.toDateLocal())
    const intervalData = findBuckets(roomId, userName, moment(start.toDateLocal()), moment(end.toDateLocal()));
    console.log('addman')
    console.log(start)
    console.log(moment(start.toDate()))
    UpdateDb({roomId,userName,intervalData, updateType: "MANUAL"});
    console.log('addmanend')
}


export default AddManualEvents;
