import React from "react"
import { Button } from "../Button"
import classnames from "classnames"
import "./AuthButton.css"

const AuthButton = ({ isAuthorized, handleAuthClick, handleSignoutClick }) => {
  const handleClick = isAuthorized ? handleSignoutClick : handleAuthClick
  const title = isAuthorized
    ? "Sign out of Google"
    : "Sign in with Google Calendar"
  return (
    <Button title={title} onClick={handleClick} className="auth-button" />
    // <button
    //   onClick={handleClick}
    //   className={classnames("auth-button", {
    //     "auth-button-secondary": isAuthorized
    //   })}
    // >
    //   {isAuthorized ? "Sign out of Google" : "Sign in with Google Calendar"}
    // </button>
  )
}

export default AuthButton
