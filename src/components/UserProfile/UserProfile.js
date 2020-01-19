import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = window.gapi.client.getToken();
    const ACCESS_TOKEN = token.access_token;
    fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${ACCESS_TOKEN}`
    )
      .then(res => res.json())
      .then(res => setUser(res));
  }, [user]);
  return user && <div>Welcome, {user.name}</div>;
};

export default UserProfile;
