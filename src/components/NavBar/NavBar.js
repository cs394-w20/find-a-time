import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"
import { UserContext } from "../../context/UserContext"

const NavBar = ({}) => {
  const value = useContext(UserContext)
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
        {console.log(value)}
        {value.isUserLoaded && <Avatar picture={value.user.picture} />}
      </div>
    </nav>
  )
}

const Avatar = ({ picture }) => {
  console.log(picture)
  return <img src={picture} alt="user" className="nav-bar__user-avatar" />
}

export default NavBar
