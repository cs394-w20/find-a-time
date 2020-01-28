import React, { useContext, useEffect } from "react"
import { AuthButton } from "components/AuthButton"
import { Event } from "components/Event"
import Calendar from "calendar/Calendar"
import { AddUserToRoom } from "components/Db"
import {
  normalEmailToFirebaseEmail,
  getRoomIdFromPath
} from "components/Utility"
import { UserContext } from "context/UserContext"

const EventPage = () => {
  const userContext = useContext(UserContext)
  //const {ListUpcomingEvents} = useContext(UserContext)

  /**
   * Adds user to room once logged in and on an EventPage by saving the email and profile pic in the roomId
   * ToDo: ideally in the calendar code we can show names and the associated pics of people available.
   */
  useEffect(() => {
    if (userContext.isUserLoaded) {
      userContext.ListUpcomingEvents({
        roomId: getRoomIdFromPath(),
        userName: userContext.user.name
      })

      AddUserToRoom({
        roomId: getRoomIdFromPath(),
        email: normalEmailToFirebaseEmail(userContext.user.email),
        userName: userContext.user.name,
        picture: userContext.user.picture
      })
    }
  }, [userContext.isUserLoaded])

  return (
    <div>
      <div className="event-auth__container">
        <Event />

        <AuthButton />
      </div>
      <Calendar isUserLoaded={userContext.isUserLoaded} />
    </div>
  )
}

export default EventPage
