import React, { useContext } from "react"
// import UserProfile from "components/UserProfile"
import { AuthButton } from "components/AuthButton"
import { UserContext } from "context/UserContext"
import { Event } from "components/Event"
import Calendar from "calendar/Calendar"

const EventPage = () => {
  const { isAuthorized } = useContext(UserContext)
  return (
    <div>
      <div className="event-auth__container">
        <Event />
        <AuthButton isAuthorized={isAuthorized} />
      </div>
      <Calendar />
    </div>
  )
}

export default EventPage
