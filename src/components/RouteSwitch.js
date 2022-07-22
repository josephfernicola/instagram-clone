import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Home from "../Home";
import NavBar from "./NavBar";
import Profile from "./Profile";
import Settings from "./Settings";
import SignUp from "./SignUp";
import coverPhoto from "../images/default-cover-photo.jpg";

const RouteSwitch = () => {
  const [homePageSidebar, setHomePageSidebar] = useState("");
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [postNumber, setPostNumber] = useState(0);
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [currentCoverPhoto, setCurrentCoverPhoto] = useState(
    <img src={coverPhoto} alt="Default Cover Photo" className="profileCoverPhoto"></img>
  );

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route
          path="/instagram-clone"
          element={
            <Home
              homePageSidebar={homePageSidebar}
              setHomePageSidebar={setHomePageSidebar}
              username={username}
              setUsername={setUsername}
              followers={followers}
              setFollowers={setFollowers}
              following={following}
              setFollowing={setFollowing}
              postNumber={postNumber}
              setPostNumber={setPostNumber}
              fullName={fullName}
              setFullName={setFullName}
              currentPhoto={currentPhoto}
              setCurrentPhoto={setCurrentPhoto}
            />
          }
        />
        <Route
          path="/sign-up"
          element={
            <SignUp
              homePageSidebar={homePageSidebar}
              setHomePageSidebar={setHomePageSidebar}
              username={username}
              setUsername={setUsername}
            />
          }
        />
        <Route
          path="profile/:id"
          element={
            <Profile
              bio={bio}
              setBio={setBio}
              currentPhoto={currentPhoto}
              setCurrentPhoto={setCurrentPhoto}
              currentCoverPhoto={currentCoverPhoto}
              setCurrentCoverPhoto={setCurrentCoverPhoto}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings
              username={username}
              setUsername={setUsername}
              bio={bio}
              setBio={setBio}
              fullName={fullName}
              setFullName={setFullName}
              currentPhoto={currentPhoto}
              setCurrentPhoto={setCurrentPhoto}
              currentCoverPhoto={currentCoverPhoto}
              setCurrentCoverPhoto={setCurrentCoverPhoto}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
