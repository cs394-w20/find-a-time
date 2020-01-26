import React from "react"
import { AuthButton } from "components/AuthButton"
import { Event } from "components/Event"
import Calendar from "calendar/Calendar"

const EventPage = () => {
  return (
    <div>
      <div className="event-auth__container">
        <Event />
        <AuthButton />
      </div>
      <Calendar />
    </div>
  )
}

export default EventPage
