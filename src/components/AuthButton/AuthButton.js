import React from "react"
import "./AuthButton.css"

const AuthButton = ({ isAuthorized, handleAuthClick, handleSignoutClick }) => {
  const handleClick = isAuthorized ? handleSignoutClick : handleAuthClick
  return (
    <button onClick={handleClick} className="auth-button">
      {isAuthorized ? "Sign out of Google" : "Sign in with Google Calendar"}
    </button>
  )
}

export default AuthButton
