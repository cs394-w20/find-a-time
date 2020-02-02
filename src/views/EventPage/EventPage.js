import React, { useContext, useEffect, useState } from "react"
import { AuthButton } from "components/AuthButton"
import { Event } from "components/Event"
import { ShareBanner } from "components/ShareBanner"
import Calendar from "../../components/calendar/Calendar"
import PersonalCalendar from "../../components/PersonalCalendar/PersonalCalendar"
import { AddUserToRoom } from "components/Db"
import {
  normalEmailToFirebaseEmail,
  getRoomIdFromPath
} from "components/Utility"
import { UserContext } from "context/UserContext"
import { ToggleCalendar } from "./components"

const EventPage = () => {
  const userContext = useContext(UserContext)
  const [isPersonalCal, setIsPersonalCal] = useState(false)
  console.log("HERE IS THE USER CONTEXT!!!", userContext)
  //const {ListUpcomingEvents} = useContext(UserContext)

  useEffect(() => {}, [])

  /**
   * Adds user to room once logged in and on an EventPage by saving the email and profile pic in the roomId
   * Calls ListUpcomingEvents() to populate calender w/ Gcal Events
   */
  useEffect(() => {
    if (userContext.isUserLoaded) {
      userContext.ListUpcomingEvents({
        roomId: getRoomIdFromPath(),
        userName: normalEmailToFirebaseEmail(userContext.user.email)
      })

      AddUserToRoom({
        roomId: getRoomIdFromPath(),
        email: normalEmailToFirebaseEmail(userContext.user.email),
        userName: userContext.user.name,
        picture: userContext.user.picture
      })
    }
  }, [userContext.isUserLoaded])

  const onGroupAvailabilityClick = () => {
    setIsPersonalCal(false)
  }

  const onYourAvailabilityClick = () => {
    setIsPersonalCal(true)
  }

  return (
    <div>
      <div className="event-auth__container">
        <Event />
        <ShareBanner />
      </div>
      <ToggleCalendar
        onGroupAvailabilityClick={onGroupAvailabilityClick}
        onYourAvailabilityClick={onYourAvailabilityClick}
        isUserLoaded={!(userContext.isUserLoaded == null)}
      />

      {userContext.user && isPersonalCal ? (
        <PersonalCalendar
          isUserLoaded={userContext.isUserLoaded}
          user={userContext.user}
        />
      ) : (
        <Calendar isUserLoaded={userContext.isUserLoaded} />
      )}
    </div>
  )
}

export default EventPage
