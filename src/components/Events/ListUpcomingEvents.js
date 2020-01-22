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
                window.gapi.client.calendar.events
                    .list({
                        calendarId: "primary",
                        timeMin: moment(time_interval.start,DATE_FORMAT).toISOString(),
                        timeMax: moment(time_interval.end,DATE_FORMAT).toISOString() ,
                        showDeleted: false,
                        singleEvents: true,
                        maxResults: 10,
                        orderBy: "startTime"
                    })
                    .then(response => {
                        const events = response.result.items;
                        // appendPre("Upcoming events:");
                        console.log(events);
                        AddEvents(roomId, userName, events);
                        if (events.length > 0) {
                            for (let i = 0; i < events.length; i++) {
                                let event = events[i];
                                let when = event.start.dateTime;
                                if (!when) {
                                    when = event.start.date;
                                }
                            }
                        }
                    })
                
            } catch (e) {
                console.error("roomId missing interval_time attribute, or interval_time not correctly formatted: ", e);
            }

            }

    )
};

export default ListUpcomingEvents;
