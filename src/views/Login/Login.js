import React, { useContext } from "react"
import { AuthButton } from "components/AuthButton"
import { UserContext } from "context/UserContext"
import { Redirect } from "react-router-dom"
import { ReactComponent as LoginImage } from "./LoginImage.svg"
import "./login.scss"

const Login = () => {
  const { isAuthorized } = useContext(UserContext)

  /*
  Change this to a separate route later
  */
  return isAuthorized ? (
    <Redirect to="/events/1" />
  ) : (
    <div className="login-container">
      <div className="login__button-container">
        <div className="login-header__text">
          Start using Find A Time with your Google account.
        </div>
        <AuthButton />
      </div>
      <div>
        <LoginImage alt="people next to a phone" className="login-image" />
      </div>
    </div>
  )
}

export default Login
