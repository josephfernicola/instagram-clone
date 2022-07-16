import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import {useLocation} from 'react-router-dom'

function Profile() {
 const location = useLocation();
 const [currentPhoto, setCurrentPhoto] = useState("");
 const [currentFullName, setCurrentFullName] = useState("");
 const [currentUsername, setCurrentUsername] = useState("");
 const [followers, setFollowers] = useState([]);
 const [following, setFollowing] = useState([]);
 const [bio, setBio] = useState("");
 const [postNumber, setPostNumber] = useState(0);

 //console.log(location.pathname.split("/")[2])
 

 useEffect(() => {
  const users = getFirestore();
    const usersRef = collection(users, "users");

    getDocs(usersRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        //console.log(users)
        users.forEach((user) => {
          if (user.uid === location.pathname.split("/")[2]) {
            setCurrentPhoto(user.photoURL);
            setCurrentFullName(user.name);
            setCurrentUsername(user.username);
            setFollowing(user.following.length);
            setFollowers(user.followers.length);
            setBio(user.bio);
            setPostNumber(Object.keys(user.posts).length)
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
 }, [])

  return (
    <div className="profileContainer">
      <img
        src={currentPhoto}
        referrerPolicy="no-referrer"
        alt="profile picture"
        className="profilePicture"
      ></img>
        <div className="name">
              <div className="fullName">{currentFullName}</div>
              <div className="username">@{currentUsername}</div>
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
  );
}

export default Profile;
