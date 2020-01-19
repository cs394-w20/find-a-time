import {DATE_FORMAT} from "../../constants";
import AddEvents from "./AddEvents";
import moment from 'moment';


export const ListUpcomingEvents = ({startDate, endDate, roomId, userName}) => {
    window.gapi.client.calendar.events
        .list({
            calendarId: "primary",
            timeMin: moment(startDate,DATE_FORMAT).toISOString(),
            timeMax: moment(endDate,DATE_FORMAT).toISOString(),
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
        });
};

export default ListUpcomingEvents;
