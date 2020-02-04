import React, { useContext } from "react"
import { Redirect, withRouter } from "react-router-dom"
import { UserContext } from "./context/UserContext/UserContext"
import { Loading } from "components/Loading"

const ProtectedRoute = ({ component, children, ...rest }) => {
  const { isLoading, isAuthorized } = useContext(UserContext)
  const Component = component
  if (isAuthorized && !isLoading) {
    return <Component {...rest} />
  }

  /*
    Replace this later with an actual built in alert
  */
  if (!isLoading) {
    alert("You need to be signed in ")
    return <Redirect to="/login" />
  }

  return <Loading />
}

export default withRouter(ProtectedRoute)
