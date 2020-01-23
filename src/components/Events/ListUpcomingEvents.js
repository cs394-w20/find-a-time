import {DATE_FORMAT} from "../../constants";
import AddEvents from "./AddEvents";
import moment from 'moment';
import { GetStartEndTimeForRoomId} from "../Db";
/*
timeMin :datetime = the lower bound for the request
timeMax :datetime = the upper bound for the request
*/

export const ListUpcomingEvents = ({roomId, userName}) => {

    GetStartEndTimeForRoomId(roomId).then((time_interval) =>
        {
            try{
                let startDate = moment(time_interval.star,DATE_FORMAT);
                let endDate = moment(time_interval.end,DATE_FORMAT);

                window.gapi.client.calendar.events
                    .list({
                        calendarId: "primary",
                        timeMin: startDate.toISOString(),
                        timeMax: endDate.toISOString() ,
                        showDeleted: false,
                        singleEvents: true,
                        maxResults: 10,
                        orderBy: "startTime"
                    })
                    .then(response => {
                        const events = response.result.items;
                        // appendPre("Upcoming events:");
                        AddEvents({roomId, userName, events, startDate, endDate});

                    })
                
            } catch (e) {
                console.error("roomId missing interval_time attribute, or interval_time not correctly formatted: ", e);
            }

            }

    )
};

export default ListUpcomingEvents;
