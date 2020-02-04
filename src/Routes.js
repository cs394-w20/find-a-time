import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { Switch, Route } from "react-router-dom"
import { NavBar } from "./components/NavBar"
import { UserContextProvider } from "./context/UserContext"
import { Create, EventPage, Landing, Login, YourEvents } from "./views"
import ProtectedRoute from "./ProtectedRoute"
import "./index.scss"
import "./App.scss"

const Routes = () => {
  return (
    <div className="app-container">
      <Router>
        <UserContextProvider>
          <NavBar />
          <div className="content">
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/login" exact component={Login} />
              <ProtectedRoute path="/create" exact component={Create} />

              <Route path="/events/:id" exact component={EventPage} />
              <Route path="/events" exact component={YourEvents} />
            </Switch>
          </div>
        </UserContextProvider>
      </Router>
    </div>
  )
}

export default Routes
