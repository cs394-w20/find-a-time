import React, { useContext } from "react"
import { AuthButton } from "components/AuthButton"
import { UserContext } from "context/UserContext"
import { Redirect } from "react-router-dom"
import { ReactComponent as LoginImage } from "./LoginImage.svg"
import "./login.scss"

const Login = ({ signInCallback }) => {
  const { isAuthorized, setNewUser } = useContext(UserContext)

  /*
  Change this to a separate route later
  */

  console.log(isAuthorized)
  return isAuthorized ? (
    <Redirect to="/events" />
  ) : (
    <div className="login-container">
      <div className="login__button-container">
        <div className="login-header__text">
          Start using Find A Time with your Google account.
        </div>
        <AuthButton
          signInCallback={signInCallback ? signInCallback : setNewUser}
        />
      </div>
      <div>
        <LoginImage alt="people next to a phone" className="login-image" />
      </div>
    </div>
  )
}

export default Login
