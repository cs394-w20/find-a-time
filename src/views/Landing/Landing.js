import React from "react"
import { Link } from "react-router-dom"
import { Button } from "components/Button"

import "./Landing.scss"
const landingImage = require("./LandingImage.svg")

const Landing = () => {
  return (
    <div className="landing__header__container">
      (Go to our test <Link to="events/1">event</Link>)
      <div className="landing__header-first-section-container">
        <div className="landing__header-text-container">
          <div className="landing__header-text--bold landing__header-delay">
            Find a time that works for <i>everyone</i>.
          </div>
          <div className="landing__header-text--regular landing__header-delay-1">
            Keep the scheduling simple and save the brain power for the meeting.
          </div>
          <Link
            style={{ color: "white" }}
            to="/create"
            className="landing__header-delay-2"
          >
            <Button
              className="landing__header-cta"
              type="cta"
              size="m"
              title="Schedule an event"
            />
          </Link>
        </div>
        <img
          src={landingImage}
          alt="People scheduling a meeting"
          className="landing__header-image landing__header-delay-1"
        />
      </div>
    </div>
  )
}

export default Landing
