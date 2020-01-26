import React, {useContext, useEffect, useState} from "react"
// import UserProfile from "components/UserProfile"
import { AuthButton } from "components/AuthButton"
import { UserContext } from "context/UserContext"
import { Event } from "components/Event"
import Calendar from "calendar/Calendar"
import {AddUserToRoom} from "../../components/Db";
import {normalEmailToFirebaseEmail} from "../../components/Utility";

/**
 * Get roomId from the path
 * @returns {string} the roomId taken from the path
 */
const getRoomIdFromPath = () =>{
    return window.location.pathname.split("/")[2];
};

const EventPage = () => {
    const userContext = useContext(UserContext);

    /**
     * Adds user to room once logged in and on an EventPage by saving the email and profile pic in the roomId
     * ToDo: ideally in the calendar code we can show names and the associated pics of people available.
     */
    useEffect( ()=>{
            if (userContext.isUserLoaded){
                AddUserToRoom(
                    {
                        roomId:getRoomIdFromPath(),
                        email: normalEmailToFirebaseEmail(userContext.user.email),
                        userName: userContext.user.name,
                        picture: userContext.user.picture
                    })
            }
        }, [userContext.isUserLoaded]
    );

  return (
    <div>
      <div className="event-auth__container">
        <Event />
        <AuthButton isAuthorized={userContext.isAuthorized} />
      </div>
      <Calendar />
    </div>
  )
};

export default EventPage
