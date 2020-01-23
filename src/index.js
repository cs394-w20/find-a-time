import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import dotenv from "dotenv";
import "./index.css";
import App from "./App";
import CreateGroup from "./CreateGroup";
import * as serviceWorker from "./serviceWorker";
dotenv.config();
ReactDOM.render(
  <Router>
    <div>
      <Route exact path ="/">
        <App />
      </Route>
      <Route exact path="/home">
        <CreateGroup />
      </Route>
    </div>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
