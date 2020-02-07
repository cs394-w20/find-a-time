import React, { createContext, useState, useEffect } from "react"
import ListUpcomingEvents from "components/Events/ListUpcomingEvents"
import { ROOM_ID } from "constants"

export const UserContext = createContext()

var CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
var API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES =
  "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile"
// ""
// ]

/*

To add new handlers to this context object:
1. define the function (e.g. handleSetUser)
2. set the field in the initialState
3. Within the function, make sure you spread the current state, THEN set the new field you wish to update -> {...state, desiredFieldName}

*/

const UserContextProvider = ({ children }) => {
  const getUserProfileAndEvents = async () => {
    const token = window.gapi.client.getToken()
    if (!token) {
      return
    }
    const ACCESS_TOKEN = token.access_token

    try {
      // Get's the user profile info
      const userResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${ACCESS_TOKEN}`
      )
      const userJson = await userResponse.json()
      /*
    // get event data & push it to firebase
    await ListUpcomingEvents({
      roomId: ROOM_ID,
      userName: userJson.name
    });
    */
      // Get the upcoming events and add  to existing roomId
      console.log("User Info", userJson)
      signInUser(userJson)
    } catch (e) {
      console.error(e)
    }
  }

  const initClient = () => {
    window.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
      .then(function() {
        // Listen for sign-in state changes.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus)

        // Handle the initial sign-in state.
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      })
      .catch(err => console.warn(err))
  }

  const updateSigninStatus = isSignedIn => {
    if (isSignedIn) {
      getUserProfileAndEvents()
    }
    // setState({
    //   ...state,
    //   isLoading: false
    // })
  }
  useEffect(() => {
    const handleClientLoad = () => {
      window.gapi.load("client:auth2", initClient)
    }
    handleClientLoad()
    // getUserProfileAndEvents()
  }, [])

  const signOutUser = () => {
    setState({
      ...state,
      user: null,
      isUserLoaded: false,
      isAuthorized: false,
      isLoading: false
    })
    window.gapi.auth2.getAuthInstance().signOut()
  }

  /*

  
  */
  const signInUser = user => {
    // user is nullified (signed out) so set to null
    setState({
      ...state,
      user,
      isUserLoaded: true,
      isAuthorized: true,
      isLoading: false
    })
  }
  const initalState = {
    setNewUser: getUserProfileAndEvents,
    signInUser,
    signOutUser,
    ListUpcomingEvents,
    user: null,
    isUserLoaded: null,
    isLoading: true,
    isAuthorized: false
  }
  const [state, setState] = useState(initalState)
  return <UserContext.Provider value={state}>{children}</UserContext.Provider>
}

export default UserContextProvider
