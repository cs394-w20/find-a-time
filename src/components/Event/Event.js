import React from "react"
import "./Event.css"
const Event = ({
  eventName,
  eventDescription,
  eventCreator,
  eventCreatorPic
}) => {
  return (
    <div className="event__container">
      <div className="event__title">{eventName}</div>

      <div className="event__creator-container">
        <img
          alt={eventCreator}
          src={eventCreatorPic}
          className="event__creator-profile-pic nav-bar__user-avatar"
        />

        <div className="event__text">{eventCreator}</div>
      </div>

      <div className="event__description">{eventDescription}</div>
    </div>
  )
}

/*
Event.defaultProps = {
  eventName: "CS 394 Meeting",
  eventDescription:
    "Hey everyone! Please fill out this form whenever you can so that we can find a time to meet weekly! Make sure to connect your Google calendar so you don’t have to manually fill in events!",
  eventCreatorPic:
    "https://media.vanityfair.com/photos/545f9049cb308b5575a4902f/master/w_2560%2Cc_limit/matt-damon-bourne-again-rexusa_1338570b.jpg",
  eventCreator: "Jason Bourne"
}*/

export default Event
