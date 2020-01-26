import React, { useContext, useEffect, useState } from "react"
import { Link, withRouter } from "react-router-dom"
import classnames from "classnames"
import "./NavBar.css"
import { UserContext } from "../../context/UserContext"

const NavBar = props => {
  const value = useContext(UserContext)

  const [activeLink, setActiveLink] = useState("")

  useEffect(() => {
    const checkPath = () => {
      setActiveLink(props.location.pathname)
    }

    checkPath()
  }, [props.location])
  /*
  
  Once creating an event is added, link `Create an event` to that route

  */

  return (
    <nav className="nav-bar__container">
      <Link to="/" className="nav-bar nav-bar__home">
        Find A Time
      </Link>
      <div className="nav-bar__links-container">
        <Link
          to="/create"
          className={classnames(`nav-bar nav-bar__item `, {
            "nav-bar__active": activeLink.indexOf("/create") !== -1
          })}
        >
          Create an event
        </Link>
        <Link
          to="/"
          className={classnames("nav-bar nav-bar__item", {
            "nav-bar__active": activeLink.indexOf("/my-events") !== -1
          })}
        >
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

export default withRouter(NavBar)
