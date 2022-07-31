import "./App.css";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";
import { IoIosAddCircleOutline } from "react-icons/io";

function Home(props) {
  const {
    homePageSidebar,
    setHomePageSidebar,
    username,
    setUsername,
    followers,
    setFollowers,
    following,
    setFollowing,
    postNumber,
    setPostNumber,
    fullName,
    setFullName,
    currentProfilePicture,
    setCurrentProfilePicture,
    currentProfilePicURL,
    homepageName,
    setHomepageName,
    homepageUsername,
    setHomepageUsername,
    homepageFollowing,
    setHomepageFollowing,
    homepageFollowers,
    setHomepageFollowers,
    homepagePostNumber,
    setHomepagePostNumber,
    homepageProfilePic,
    setHomepageProfilePic,
  } = props;
  let location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    initFirebaseAuth();
  }, []);

  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  useEffect(() => {
    if (isUserSignedIn() && !loading) {
      setHomePageSidebar(
        <div className="sidebarContainer">
          <Link to={`/profile/${getAuth().currentUser.uid}`}>
            <div className="pictureAndName">
              {homepageProfilePic}
              <div className="name">
                <div className="fullName">{homepageName}</div>
                <div className="username">{homepageUsername}</div>
              </div>
            </div>
          </Link>
          <div className="followersAndPosts">
            <div className="following">
              <div className="followingNumber">{homepageFollowing}</div>
              <div>Following</div>
            </div>
            <div className="followers">
              <div className="followersNumber">{homepageFollowers}</div>
              <div>Followers</div>
            </div>
            <div className="posts">
              <div className="postsNumber">{homepagePostNumber}</div>
              <div>Posts</div>
            </div>
            <div className="iconAndNewPostButton">
              {<IoIosAddCircleOutline />}
              <button className="newPost">New Post</button>
            </div>
          </div>
        </div>
      );
    }
  }, [isUserSignedIn(), loading]);

  useEffect(() => {
    async function changeHomepageInfo() {
      const users = await getFirestore();
      const usersRef = await collection(users, "users");
      getDocs(usersRef)
        .then((snapshot) => {
          let users = [];
          snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          users.forEach((user) => {
            if (user.email === getAuth().currentUser.email) {
              setHomepagePostNumber(user.posts.length);
              setHomepageName(user.name);
              setHomepageUsername(user.username);
              setHomepageFollowers(user.followers.length);
              setHomepageFollowing(user.following.length);
              setHomepageProfilePic(
                <img
                  src={user.photoURL}
                  alt="Default Profile"
                  className="homepageProfilePic"
                ></img>
              );
              setLoading(false);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    changeHomepageInfo();
  }, []);

  // Initialize firebase auth
  function initFirebaseAuth() {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  function authStateObserver(user) {
    if (user) {
      // User is signed in.
      async function changeHomepageInfo() {
        const users = await getFirestore();
        const usersRef = await collection(users, "users");
        getDocs(usersRef)
          .then((snapshot) => {
            let users = [];
            snapshot.docs.forEach((doc) => {
              users.push({ ...doc.data(), id: doc.id });
            });
            users.forEach((user) => {
              if (user.email === getAuth().currentUser.email) {
                setHomepagePostNumber(user.posts.length);
                setHomepageName(user.name);
                setHomepageUsername(user.username);
                setHomepageFollowers(user.followers.length);
                setHomepageFollowing(user.following.length);
                setHomepageProfilePic(
                  <img
                    src={user.photoURL}
                    alt="Default Profile"
                    className="homepageProfilePic"
                  ></img>
                );
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
      changeHomepageInfo();
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
            alert(error);
          });
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="homePage">
      <div className="postsContainer"></div>
      {homePageSidebar}
    </div>
  );
}

export default Home;
