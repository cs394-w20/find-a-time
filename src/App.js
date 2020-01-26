import React from "react"
import { Link } from "react-router-dom"
import "./App.css"

function App() {
  return (
    <div className="App">
      <h1>This is a temporary homepage. I (zack) will change this later</h1>
      <h2>
        Go to <Link to="/events/1">Event 1</Link>
      </h2>
      <h3>
        You can also go to <Link to="/create">Create an event</Link>
      </h3>
      <div className="event-auth__container"></div>
    </div>
  )
}

export default App
