import React, { useEffect, useState, useContext } from "react"
import ListUpcomingEvents from "../Events/ListUpcomingEvents"
import { ROOM_ID } from "constants"
import { UserContext } from "context/UserContext"

const UserProfile = () => {
  const { setNewUser } = useContext(UserContext)
  const [user, setUser] = useState(null)
  useEffect(() => {
    const getUserProfileAndEvents = async () => {
      const token = window.gapi.client.getToken()
      const ACCESS_TOKEN = token.access_token

      // Get's the user profile info
      const userResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${ACCESS_TOKEN}`
      )
      const userJson = await userResponse.json()

      console.error(userJson)
      // Get the upcoming events and add  to existing roomId
      ListUpcomingEvents({
        roomId: ROOM_ID,
        userName: userJson.name
      })
      console.log("User Info", userJson)
      setUser(userJson)
      setNewUser(userJson)
    }
    getUserProfileAndEvents()
  }, [])

  return user && <div>Welcome, {user.name}</div>
}

export default UserProfile
