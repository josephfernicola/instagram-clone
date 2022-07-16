import "./App.css";
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
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import { IoIosAddCircleOutline } from "react-icons/io";

function Home(props) {
  const { homePageSidebar, setHomePageSidebar, username, setUsername } = props;
  //const [username, setUsername] = useState("");

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
          if (user.email === getAuth().currentUser.email) {
            setUsername(user.username);
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  // Initialize firebase auth
  function initFirebaseAuth() {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
  }
  // Returns true if a user is signed-in.
  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  function viewFollowing () {
    const users = getFirestore();
    const usersRef = collection(users, "users");

    getDocs(usersRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        //console.log("users" , users)
        users.forEach((name) => {
          if (name.name === getAuth().currentUser.displayName) {
            
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  function authStateObserver(user) {
    if (user) {
      // User is signed in.
      setHomePageSidebar(
        <div className="sidebarContainer">
          <Link to={`/profile/${getAuth().currentUser.uid}`}>
          <div className="pictureAndName">
            <img
              src={getProfilePicUrl()}
              referrerPolicy="no-referrer"
              alt="Profile Picture"
              className="profilePic"
            ></img>
            <div className="name">
              <div className="fullName">{getUserFullName()}</div>
              <div className="username">@{username}</div>
            </div>
          </div>
          </Link>
          <div className="followersAndPosts">
            <div className="following">
              <div className="followingNumber">0</div>
              <div onClick={viewFollowing}>Following</div>
            </div>

            <div className="followers">
              <div className="followersNumber">0</div>
              <div>Followers</div>
            </div>
            <div className="posts">
              <div className="postsNumber">0</div>
              <div>Posts</div>
            </div>
            <div className="iconAndNewPostButton">
              {<IoIosAddCircleOutline />}
              <button className="newPost">New Post</button>
            </div>
          </div>
        </div>
      );
    } else {
      // User is not signed in.
      setHomePageSidebar(
        <div className="sidebarContainer">
          <Link to="/sign-up">
            <button className="signUpButton">Sign Up</button>
          </Link>
          <button className="logInButton" onClick={logIn}>
            Log In
          </button>
        </div>
      );
    }
  }
  function getUserFullName() {
    return getAuth().currentUser.displayName;
  }

  // Returns the signed-in user's profile Pic URL.
  function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || "/images/profile_placeholder.png";
  }

  async function logIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const googleProvider = new GoogleAuthProvider();
    try {
      const db = getFirestore();
      const res = await signInWithPopup(getAuth(), googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid)); //checking if user is already registered with app
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        const auth = getAuth();
        const user = auth.currentUser;

        deleteUser(user)
          .then(() => {
            // User deleted.
            alert("Email is not registered");
          })
          .catch((error) => {
            // An error ocurred
            // ...
            alert(error)
          });
      }
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => {
    initFirebaseAuth();
  }, []);

  return (
    <div className="homePage">
      <div className="postsContainer"></div>
      {homePageSidebar}
    </div>
  );
}

export default Home;
