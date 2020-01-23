import React from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"

const NavBar = () => {
  return (
    <nav className="nav-bar__container">
      <Link to="/" className="nav-bar nav-bar__home">
        Find A Time
      </Link>
      <div>
        <Link to="/" className="nav-bar nav-bar__item nav-bar__inactive">
          Create an event
        </Link>
        <Link to="/" className="nav-bar nav-bar__item nav-bar__inactive">
          Your events
        </Link>
      </div>
    </nav>
  )
}

export default NavBar
