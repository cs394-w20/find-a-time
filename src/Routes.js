import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { Switch, Route } from "react-router-dom"
import App from "./App"
import { NavBar } from "./components/NavBar"
import { UserContextProvider } from "./context/UserContext"
import { Create, EventPage } from "./views"
import ProtectedRoute from "./ProtectedRoute"
import "./index.css"

const Routes = () => {
  return (
    <div className="app-container">
      <Router>
        <UserContextProvider>
          <NavBar />
          <div className="content">
            <Switch>
              <Route path="/" exact component={App} />
              <ProtectedRoute path="/create" exact component={Create} />
              <Route path="/events/:id" exact component={EventPage} />
            </Switch>
          </div>
        </UserContextProvider>
      </Router>
    </div>
  )
}

export default Routes
