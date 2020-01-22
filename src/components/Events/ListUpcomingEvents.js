import {DATE_FORMAT} from "../../constants";
import AddEvents from "./AddEvents";
import moment from 'moment';

/*
timeMin :datetime = the lower bound for the request
timeMax :datetime = the upper bound for the request
*/
export const ListUpcomingEvents = ({startDate, endDate, roomId, userName}) => {
    startDate =  moment(startDate,DATE_FORMAT);
    endDate = moment(endDate,DATE_FORMAT);

    window.gapi.client.calendar.events
        .list({
            calendarId: "primary",
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime"
        })
        .then(response => {
            const events = response.result.items;
            // appendPre("Upcoming events:");

            console.log(events);
            AddEvents({roomId, userName, events,startDate, endDate});

        });
};

export default ListUpcomingEvents;
