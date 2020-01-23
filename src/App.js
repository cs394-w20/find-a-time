import React, { useEffect, useState } from "react";
import "./App.css";
import { FIXED_START_DATE, FIXED_END_DATE } from "./constants";
import Calendar from "./calendar/Calendar";
import AddEvents from "./components/Events/AddEvents"
import UserProfile from "./components/UserProfile";

function App() {
  var CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  var API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES =
    "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile";
  // ""
  // ];

  useEffect(() => {
    /**
     *  On load, called to load the auth2 library and API client library.
     */
    const handleClientLoad = () => {
      window.gapi.load("client:auth2", initClient);
    };
    handleClientLoad();
  }, []);

  const [isAuthorized, setisAuthorized] = useState(false);

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  const initClient = () => {
    console.log("init");
    window.gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
      .then(function() {
        // Listen for sign-in state changes.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        );
      })
      .catch(err => console.warn(err));
  };

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  const updateSigninStatus = isSignedIn => {
    console.log(isSignedIn);
    if (isSignedIn) {
      // authorizeButton.style.display = "none";
      // signoutButton.style.display = "block";

      setisAuthorized(true);
      //listUpcomingEvents();
    }
  };

  /**
   *  Sign in the user upon button click.
   */
  const handleAuthClick = event => {
    window.gapi.auth2.getAuthInstance().signIn();
  };

  /**
   *  Sign out the user upon button click.
   */
  const handleSignoutClick = event => {
    window.gapi.auth2.getAuthInstance().signOut();
  };


  return (
    <div className="App">
      {isAuthorized ? (
        <>
          <h1>Google Calendar is Authorized!</h1>
          <UserProfile />
          <button onClick={handleSignoutClick}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleAuthClick}>Authorize Google Calendar</button>
      )}
      <Calendar />
    </div>
  );
}

export default App;
