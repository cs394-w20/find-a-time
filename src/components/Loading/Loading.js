import React from "react"
import "./loading.scss"

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="clock">
        <div className="minutes"></div>
        <div className="hours"></div>
      </div>
    </div>
  )
}

export default Loading
