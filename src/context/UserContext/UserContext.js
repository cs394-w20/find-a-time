import React, { createContext, useState } from "react"

export const UserContext = createContext()

const UserContextProvider = ({ children }) => {
  const handleSetUser = user => {
    console.log("ran context user", user)
    setState(user)
  }
  const initalState = {
    setNewUser: handleSetUser,
    user: null
  }
  const [state, setState] = useState(initalState)
  return <UserContext.Provider value={state}>{children}</UserContext.Provider>
}

export default UserContextProvider
