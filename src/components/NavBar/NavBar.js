import React, { useContext, useEffect, useState, useRef } from "react"
import { Link, withRouter } from "react-router-dom"
import classnames from "classnames"
import "./NavBar.scss"
import { UserContext } from "context/UserContext"
import { ReactComponent as Hamburger } from "./Hamburger.svg"
import { Popover } from "components/Popover"
import { Button } from "components/Button"

const NavBar = props => {
  const value = useContext(UserContext)
  const userAvatarRef = useRef()
  const mobileRef = useRef()
  const [activeLink, setActiveLink] = useState("")

  useEffect(() => {
    window.addEventListener("resize", handleAppResize)
    const checkPath = () => {
      setActiveLink(props.location.pathname)
    }
    checkPath()

    return () => window.removeEventListener("resize", handleAppResize)
  }, [props.location])

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

  const handleAppResize = () => {
    if (!isMobile) {
      if (window.innerWidth <= 600) {
        setIsMobile(true)
      } else {
        if (window.innerWidth > 600) {
          setIsMobile(false)
        }
      }
    }
  }
  /*

    Once creating an event is added, link `Create an event` to that route

    */
  const PopOverLogOut = () => {
    return (
      <button onClick={value.signOutUser} className="nav-bar__pop-over-button">
        Log Out
      </button>
    )
  }

  const LoginButton = () => {
    if (isMobile) {
      return value.isUserLoaded ? (
        <button className="nav-bar nav-bar__item" onClick={value.signOutUser}>
          Log Out
        </button>
      ) : (
        <Link
          to="/login"
          className={classnames("nav-bar nav-bar__item", {
            "nav-bar__active": activeLink.indexOf("/login") !== -1,
            "nav-bar__mobile": isMobile
          })}
        >
          Log in
        </Link>
      )
    }

    return value.isUserLoaded ? (
      <Popover
        target={userAvatarRef}
        innerComponent={<PopOverLogOut />}
        position="center"
      >
        {({ handlePopoverClick }) => (
          <Avatar
            picture={value.user.picture}
            ref={userAvatarRef}
            handlePopoverClick={handlePopoverClick}
          />
        )}
      </Popover>
    ) : (
      <Link
        to="/login"
        className={classnames("nav-bar nav-bar__item", {
          "nav-bar__active": activeLink.indexOf("/login") !== -1
        })}
      >
        Log in
      </Link>
    )
  }

  const NavLinks = () => {
    return (
      <div className="nav-bar__links-container">
        <Link
          to="/create"
          className={classnames(`nav-bar nav-bar__item `, {
            "nav-bar__active": activeLink.indexOf("/create") !== -1,
            "nav-bar__mobile": isMobile
          })}
        >
          Create an event
        </Link>

        {value.isAuthorized && (
          <Link
            to="/events"
            className={classnames("nav-bar nav-bar__item", {
              "nav-bar__active": "/events" === activeLink,
              "nav-bar__mobile": isMobile
            })}
          >
            Your events
          </Link>
        )}
        <LoginButton />
      </div>
    )
  }
  return (
    <nav className="nav-bar__container">
      <Link to="/" className="nav-bar nav-bar__home">
        Find A Time
      </Link>
      {isMobile ? (
        <Popover
          target={mobileRef}
          innerComponent={<NavLinks />}
          position="left"
        >
          {({ handlePopoverClick }) => (
            <div onClick={handlePopoverClick} ref={mobileRef}>
              <Hamburger />
            </div>
          )}
        </Popover>
      ) : (
        <NavLinks />
      )}
    </nav>
  )
}

const Avatar = React.forwardRef(({ picture, handlePopoverClick }, ref) => {
  return (
    <div onClick={handlePopoverClick}>
      <img
        src={picture}
        alt="user"
        className="nav-bar__user-avatar"
        ref={ref}
      />
    </div>
  )
})

export default withRouter(NavBar)
