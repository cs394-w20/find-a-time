import React, { createContext, useState } from "react"

export const UserContext = createContext()

/*

To add new handlers to this context object:
1. define the function (e.g. handleSetUser)
2. set the field in the initialState
3. Within the function, make sure you spread the current state, THEN set the new field you wish to update -> {...state, desiredFieldName}

*/

const UserContextProvider = ({ children }) => {
  const signOutUser = () => {
    setState({
      ...state,
      user: null,
      isUserLoaded: false
    })
  }
  const handleSetUser = user => {
    // user is nullified (signed out) so set to null and change userIsloaded to false
    setState({ ...state, user, isUserLoaded: true })
  }
  const initalState = {
    setNewUser: handleSetUser,
    signOutUser,
    user: null,
    isUserLoaded: false
  }
  const [state, setState] = useState(initalState)
  return <UserContext.Provider value={state}>{children}</UserContext.Provider>
}

export default UserContextProvider
