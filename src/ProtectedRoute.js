import React, { useContext } from "react"
import { Redirect } from "react-router-dom"
import { UserContext } from "./context/UserContext/UserContext"

const ProtectedRoute = ({ component, children, ...rest }) => {
  const { isAuthorized } = useContext(UserContext)
  const Component = component
  if (isAuthorized) {
    return <Component {...rest} />
  }

  /*
    Replace this later with an actual built in alert
  */
  alert("You need to be signed in ")
  return <Redirect to="/" />
}

export default ProtectedRoute
