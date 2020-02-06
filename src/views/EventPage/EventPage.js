import React, { useContext, useEffect, useState } from "react"
import { AuthButton } from "components/AuthButton"
import { Event } from "components/Event"
import { ShareBanner } from "components/ShareBanner"
import Calendar from "../../components/calendar/Calendar"
import { Loading } from "components/Loading"
import PersonalCalendar from "../../components/PersonalCalendar/PersonalCalendar"
import { AddUserToRoom } from "components/Db"
import db from "components/Db/firebaseConnect"
import { normalEmailToFirebaseEmail } from "components/Utility"
import { UserContext } from "context/UserContext"
import { ToggleCalendar } from "./components"

const EventPage = ({ match }) => {
  const userContext = useContext(UserContext)
  const [isPersonalCal, setIsPersonalCal] = useState(false)

  const [eventData, setEventData] = useState(null)

  useEffect(() => {
    const roomId = match.params.id
    if (!roomId) {
      return
      /*
          Need to handle error gracefully here
          */
    }

    const fetchRooms = () => {
      db.ref("/rooms/" + roomId)
        .once("value")
        .then(snapshot => setEventData(snapshot.val()))
    }

    fetchRooms()
    return async () => {
      await db.ref().off()
    }
  }, [match.params.id])
  /**
   * Adds user to room once logged in and on an EventPage by saving the email and profile pic in the roomId
   * Calls ListUpcomingEvents() to populate calender w/ Gcal Events
   */
  useEffect(() => {
    if (userContext.isUserLoaded) {
      userContext.ListUpcomingEvents({
        roomId: match.params.id,
        userName: normalEmailToFirebaseEmail(userContext.user.email)
      })

      AddUserToRoom({
        roomId: match.params.id,
        email: normalEmailToFirebaseEmail(userContext.user.email),
        userName: userContext.user.name,
        picture: userContext.user.picture
      })
    }
  }, [userContext, match.params.id])

  const onGroupAvailabilityClick = () => {
    setIsPersonalCal(false)
  }

  const onYourAvailabilityClick = () => {
    setIsPersonalCal(true)
  }

  return eventData ? (
    <div>
      <div className="event-auth__container">
        <ShareBanner />
        <Event
          eventCreator={eventData.users[eventData.meta_data.room_owner].name}
          eventCreatorPic={
            eventData.users[eventData.meta_data.room_owner].picture
          }
          eventDescription={eventData.meta_data.description}
          eventName={eventData.meta_data.title}
        />

        {!userContext.isAuthorized && !userContext.isLoading && (
          <AuthButton title="Sign in with Google to start using Find a Time!" />
        )}
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
  ) : (
    <Loading />
  )
}

export default EventPage
