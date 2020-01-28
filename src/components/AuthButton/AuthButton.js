import React, { useContext } from "react"
import { Button } from "../Button"
import "./AuthButton.css"
import { UserContext } from "../../context/UserContext"

const AuthButton = ({ signInCallback }) => {
  const { signOutUser, isAuthorized } = useContext(UserContext)
  const handleAuthClick = async event => {
    await window.gapi.auth2.getAuthInstance().signIn()
    signInCallback()
  }

  /**
   *  Sign out the user upon button click.
   */
  const handleSignoutClick = event => {
    window.gapi.auth2.getAuthInstance().signOut()
    signOutUser()
  }
  const handleClick = isAuthorized ? handleSignoutClick : handleAuthClick
  const title = isAuthorized
    ? "Sign out of Google"
    : "Sign in with Google Calendar"

  const type = isAuthorized ? "secondary" : "primary"
  return (
    <Button
      title={title}
      onClick={handleClick}
      className="auth-button"
      type={type}
    />
  )
}

AuthButton.defaultProps = {
  signInCallback: () => {}
}

export default AuthButton
