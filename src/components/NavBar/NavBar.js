import React, { useContext } from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"
import { UserContext } from "../../context/UserContext"

const NavBar = ({ isAuthorized }) => {
  const state = useContext(UserContext)
  /*
  
  Once creating an event is added, link `Create an event` to that route

  */
  return (
    <nav className="nav-bar__container">
      <Link to="/" className="nav-bar nav-bar__home">
        Find A Time
      </Link>
      <div className="nav-bar__links-container">
        <Link to="/" className="nav-bar nav-bar__item nav-bar__inactive">
          Create an event
        </Link>
        <Link to="/" className="nav-bar nav-bar__item nav-bar__inactive">
          Your events
        </Link>
        {console.log(state)}
      </div>
    </nav>
  )
}

const Avatar = ({ picture }) => {
  console.log(picture)
  return <img src={picture} alt="user" />
}

export default NavBar
