import { useLocation, Link } from "react-router-dom";
import ProfilePostContainer from "./ProfilePostContainer";
import React, { useState, useEffect} from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function Profile(props) {
  const {
    setUploadPostModal,
    bio,
    setBio,
    currentProfilePicture,
    setCurrentProfilePicture,
    setCurrentProfilePicURL,
    currentCoverPhoto,
    setCurrentCoverPhoto,
    currentCoverPhotoURL,
    setCurrentCoverPhotoURL,
    setUsername,
    setFollowing,
    setFollowers,
    postNumber,
    followers,
    following,
    setFullName,
    setPostNumber,
    fullName,
    username,
    profileButtons,
    setProfileButtons,
    userPosts,
    setUserPosts,
    setCurrentPostURL,
  } = props;
  const location = useLocation();
  const [letPageLoad, setLetPageLoad] = useState(false);
  const [reRender, setreRender] = useState(false);

  // useEffect(() => {
  //   const changeProfileButtons = async () => {
  //   const users = await getFirestore();
  //       const usersRef = await collection(users, "users");
  //       getDocs(usersRef)
  //         .then((snapshot) => {
  //           let users = [];
  //           snapshot.docs.forEach((doc) => {
  //             users.push({ ...doc.data(), id: doc.id });
  //           });
  //           users.forEach((user) => {
  //             if (user.email !== getAuth().currentUser.email)
  //           });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //       }
  //       changeProfileButtons();
  // }, [])

  useEffect(() => {
    async function pageLoadFunct() {
      const users = await getFirestore();
      const usersRef = await collection(users, "users");
      getDocs(usersRef)
        .then((snapshot) => {
          let users = [];
          snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          users.forEach((user) => {
            if (location.pathname.includes(user.uid)) {
              setCurrentCoverPhoto(
                <img
                  src={user.coverPhoto}
                  alt="Default Cover"
                  className="profileCoverPhoto"
                ></img>
              );
              setCurrentProfilePicture(
                <img
                  src={user.photoURL}
                  alt="Default Profile"
                  className="profilePagePic"
                ></img>
              );
              setFullName(user.name);
              setUsername(user.username);
              setFollowers(user.followers.length);
              setFollowing(user.following.length);
              setBio(user.bio);
              setUserPosts(user.posts);
              setPostNumber(user.posts.length);
              setLetPageLoad(true);
              setProfileButtons(
                <div className="profileButtonsContainer">
                  <Link to="/settings">
                    <button className="editProfileButton">Edit Profile</button>
                  </Link>
                  <button onClick={() => setUploadPostModal(true)}>+</button>
                </div>
              );
              if (user.email !== getAuth().currentUser.email) {
                setProfileButtons(
                  <div className="profileButtonsContainer">
                    <button className="followUnfollowButton">Follow</button>
                    <button className="messageButton">Message</button>
                  </div>
                );
              }
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location.pathname.includes("profile")) {
      pageLoadFunct();
    }
  }, [location]);

  if (letPageLoad) {
    return (
      <div className="profileContainer">
        <div className="upperContainer">
          <div className="profileCoverPhotoContainer">{currentCoverPhoto}</div>
          <div className="userInfoAndPostContainer">
            <div className="profileInfoLeft">
              {currentProfilePicture}
              <div className="name">
                <div className="fullName">{fullName}</div>
                <div className="username">{username}</div>
              </div>
              <div>{postNumber} posts</div>
              <div className="followersAndFollowingContainter">
                <div className="followingOnProfile">{following} Following</div>
                <div className="followersOnProfile">{followers} Followers</div>
              </div>
              <div className="bioContainer">
                <div className="bioTitle">Bio</div>
                <div className="bioDescription">{bio}</div>
              </div>
            </div>
            {
              <ProfilePostContainer
                userPosts={userPosts}
                setUserPosts={setUserPosts}
                currentProfilePicture={currentProfilePicture}
              />
            }
          </div>
        </div>
        <div className="profileButtons">{profileButtons}</div>
      </div>
    );
  }
}

export default Profile;

//when already on profile page, cant switch to another profile on the search. doesnt render quickly enough
