import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"

const NavBar = ({ isAuthorized }) => {
  /*
  
  Once creating an event is added, link `Create an event` to that route

  */
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

const Avatar = ({ picture }) => {
  console.log(picture)
  return <img src={picture} alt="user" />
}

export default NavBar
