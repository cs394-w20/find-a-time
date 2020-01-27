import {firebaseEmailToNormalEmail} from "../../components/Utility";
import jstz from 'jstz';


const SAMPLE_EVENT = {
    'summary': 'Google I/O 2015',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
        'dateTime': '2015-05-28T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'end': {
        'dateTime': '2015-05-28T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
    },
    'attendees': [
        {'email': 'lpage@example.com'},
        {'email': 'sbrin@example.com'}
    ],
    'reminders': {
        'useDefault': false,
        'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
        ]
    }
};

const eventReminderSetting = {
    'useDefault': false,
    'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
    ]
};


const formatEventToPost = ({emailList, title, description, startTime, endTime}) => {
    let postedEvent = {};
    let timeZone = jstz.determine().name();

    postedEvent['attendees'] = emailList.map((email) => {
        return {'email': firebaseEmailToNormalEmail(email)}
    });
    postedEvent['start'] = {'dateTime': startTime, timeZone: timeZone};
    postedEvent['end'] = {'dateTime': endTime, timeZone: timeZone};
    postedEvent['description'] = description;
    postedEvent['summary'] = title;
    postedEvent['reminders'] = eventReminderSetting;

    return postedEvent;
};


const sendInvites = async (payload) => {
    const response = await window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': payload
    });
    if (response.status !== 200) throw response;
    return response["result"]["htmlLink"];
};


const _SendEventInvites = async ({emailList, title, description, startTime, endTime}) => {

    let payload = formatEventToPost({emailList, title, description, startTime, endTime});
    console.log(payload);
    return await sendInvites(payload)
};

export default _SendEventInvites;
