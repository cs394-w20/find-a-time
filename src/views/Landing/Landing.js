import React from "react"
import { Link } from "react-router-dom"
import { Button } from "components/Button"

import "./Landing.css"

const landingImage = require("./LandingImage.svg")

const Landing = () => {
  return (
    <div className="landing__header__container">
      (Go to our test <Link to="events/1">event</Link>)
      <div className="landing__header-first-section-container">
        <div className="landing__header-text-container">
          <div className="landing__header-text--bold">
            Find a time that works for <i>everyone</i>.
          </div>
          <div className="landing__header-text--regular">
            Keep the scheduling simple and save the brain power for the meeting.
          </div>
          <Button
            className="landing__header-cta"
            title={
              <Link style={{ color: "white" }} to="/create">
                Schedule an event
              </Link>
            }
            type="cta"
            size="l"
          />
        </div>
        <img src={landingImage} alt="People scheduling a meeting" />
      </div>
    </div>
  )
}

export default Landing
