import React, { useContext } from "react"
import { Redirect } from "react-router-dom"
import { UserContext } from "context/UserContext"

const ProtectedRoute = ({ component, children, ...rest }) => {
  const { isAuthorized } = useContext(UserContext)
  const Component = component
  if (isAuthorized) {
    return <Component {...rest} />
  }
  alert("You need to be signed in ")
  return <Redirect to="/" />
}

export default ProtectedRoute
