import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "../Home";
import NavBar from "./NavBar";
import Profile from "./Profile";
import Settings from "./Settings";
import SignUp from "./SignUp";
import NewPostModalPopup from './NewPostModalPopup'
import coverPhoto from "../images/default-cover-photo.jpg";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const RouteSwitch = () => {
  const [homePageSidebar, setHomePageSidebar] = useState("");
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [postNumber, setPostNumber] = useState(0);
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [currentProfilePicture, setCurrentProfilePicture] = useState("");
  const [currentCoverPhoto, setCurrentCoverPhoto] = useState(
    <img
      src={coverPhoto}
      alt="Default Cover"
      className="profileCoverPhoto"
    ></img>
  );
  const [currentCoverPhotoURL, setCurrentCoverPhotoURL] = useState(coverPhoto);
  const [currentProfilePicURL, setCurrentProfilePicURL] = useState("");
 const [uploadPostModal, setUploadPostModal] = useState(false);
   // adds class to darken background color
  const [profileButtons, setProfileButtons] = useState(
    <div className="profileButtonsContainer">
      <Link to="/settings">
        <button className="editProfileButton">Edit Profile</button>
      </Link>
      <button onClick={()=>setUploadPostModal(true)}>
        +
      </button>
    </div>
  );

  // Returns true if a user is signed-in.
  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  useEffect(() => {
    if (isUserSignedIn) {
      const users = getFirestore();
      const usersRef = collection(users, "users");
      getDocs(usersRef)
        .then((snapshot) => {
          let users = [];
          snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          users.forEach((user) => {
            if (user.email === getAuth().currentUser.email) {
              setUsername(user.username);
              setFollowers(user.followers.length);
              setFollowing(user.following.length);
              setPostNumber(Object.keys(user.posts).length);
              setFullName(user.name);
              setCurrentProfilePicURL(user.photoURL);
              setBio(user.bio);
              setCurrentProfilePicture(
                <img
                  src={user.photoURL}
                  alt="Default Profile"
                  className="homepageProfilePic"
                ></img>
              );
              setCurrentCoverPhoto(
                <img
                  src={user.coverPhoto}
                  alt="Default Cover"
                  className="profileCoverPhoto"
                ></img>
              );
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <BrowserRouter>
    {uploadPostModal && <NewPostModalPopup setUploadPostModal={setUploadPostModal}/>}
      <NavBar
        username={username}
        setUsername={setUsername}
        followers={followers}
        setFollowers={setFollowers}
        following={following}
        setFollowing={setFollowing}
        postNumber={postNumber}
        setPostNumber={setPostNumber}
        FullName={fullName}
        setFullName={setFullName}
        currentProfilePicture={currentProfilePicture}
        setCurrentProfilePicture={setCurrentProfilePicture}
        currentProfilePicURL={currentProfilePicURL}
        setCurrentProfilePicURL={setCurrentProfilePicURL}
        setCurrentCoverPhoto={setCurrentCoverPhoto}
      />
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
              currentProfilePicture={currentProfilePicture}
              setCurrentProfilePicture={setCurrentProfilePicture}
              currentProfilePicURL={currentProfilePicURL}
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
              fullName={fullName}
              username={username}
              postNumber={postNumber}
              following={following}
              followers={followers}
              setBio={setBio}
              currentProfilePicture={currentProfilePicture}
              setCurrentProfilePicture={setCurrentProfilePicture}
              currentCoverPhoto={currentCoverPhoto}
              setCurrentCoverPhoto={setCurrentCoverPhoto}
              currentCoverPhotoURL={currentCoverPhotoURL}
              setCurrentCoverPhotoURL={setCurrentCoverPhotoURL}
              currentProfilePicURL={currentProfilePicURL}
              setCurrentProfilePicURL={setCurrentProfilePicURL}
              profileButtons={profileButtons}
              setProfileButtons={setProfileButtons}
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
              currentProfilePicture={currentProfilePicture}
              setCurrentProfilePicture={setCurrentProfilePicture}
              currentCoverPhoto={currentCoverPhoto}
              setCurrentCoverPhoto={setCurrentCoverPhoto}
              currentCoverPhotoURL={currentCoverPhotoURL}
              setCurrentCoverPhotoURL={setCurrentCoverPhotoURL}
              currentProfilePicURL={currentProfilePicURL}
              setCurrentProfilePicURL={setCurrentProfilePicURL}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
