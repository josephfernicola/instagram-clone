import "./App.css";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useEffect } from "react";
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
    currentProfilePicURL
  } = props;


  // Initialize firebase auth
  function initFirebaseAuth() {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  // function viewFollowing() {
  //   const users = getFirestore();
  //   const usersRef = collection(users, "users");

  //   getDocs(usersRef)
  //     .then((snapshot) => {
  //       let users = [];
  //       snapshot.docs.forEach((doc) => {
  //         users.push({ ...doc.data(), id: doc.id });
  //       });
  //       //console.log("users" , users)
  //       users.forEach((name) => {
  //         if (name.name === getAuth().currentUser.displayName) {
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  function authStateObserver(user) {
    if (user) {
      // User is signed in.
      setHomePageSidebar(
        <div className="sidebarContainer">
          <Link to={`/profile/${getAuth().currentUser.uid}`}>
            <div className="pictureAndName">
              {currentProfilePicture}
              <div className="name">
                <div className="fullName">{fullName}</div>
                <div className="username">@{username}</div>
              </div>
            </div>
          </Link>
          <div className="followersAndPosts">
            <div className="following">
              <div className="followingNumber">{following}</div>
              <div onClick={viewFollowing}>Following</div>
            </div>

            <div className="followers">
              <div className="followersNumber">{followers}</div>
              <div>Followers</div>
            </div>
            <div className="posts">
              <div className="postsNumber">{postNumber}</div>
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
