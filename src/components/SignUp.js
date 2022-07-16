import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  where,
  documentId,
  setDoc,
} from "firebase/firestore";
import instagramLogo from "../images/instagram-logo.jpeg";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  deleteUser,
} from "firebase/auth";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp(props) {
  const { setHomePageSidebar, username, setUsername } = props;

  // Shortcuts to DOM Elements.
  const navigate = useNavigate();

  const userPicElement = document.getElementById("user-pic");
  const userNameElement = document.querySelector(".userName");
  const signInButtonElement = document.querySelector(".logInButton");
  //const signOutButtonElement = document.getElementById('sign-out');

  const signUpUser = async (e) => {
    e.preventDefault();
    console.log(e.target.children[1].value); //username value
    if (
      e.target.children[1].value.length > 2 &&
      e.target.children[1].value.length < 16
    ) {
      const googleProvider = new GoogleAuthProvider();
      try {
        const db = getFirestore();
        const res = await signInWithPopup(getAuth(), googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid)); //checking if user is already registered with app
        const docs = await getDocs(q);

        if (docs.docs.length === 0) {
          setUsername(e.target.children[1].value);
          await setDoc(doc(db, "users", e.target.children[1].value), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            username: e.target.children[1].value,
            photoURL: user.photoURL,
            followers: [],
            following: [],
            bio: "",
            posts: {},
          });
      
        } else {
          alert("Email is already registered with the App");
          signOut(getAuth());
        }
      } catch (err) {
        console.error(err);
        alert(err.message);
      }

      navigate("/instagram-clone");
    }
  };

  function getUserFullName() {
    //console.log(getAuth().currentUser.displayName)
    return getAuth().currentUser.displayName;
  }

  function getUserId() {
    //console.log(getAuth().currentUser.uid)
    return getAuth().currentUser.uid;
  }

  function getUserEmail() {
    //console.log(getAuth().currentUser.email)
    return getAuth().currentUser.email;
  }
  // Returns the signed-in user's profile Pic URL.
  function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || "/images/profile_placeholder.png";
  }
  // Initialize firebase auth
  function initFirebaseAuth() {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
  }
  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  function authStateObserver(user) {
    if (user) {
      // User is signed in!
      // Get the signed-in user's profile pic and name.
      var profilePicUrl = getProfilePicUrl();
      var userName = getUserFullName();

      // Set the user's profile pic and name.
      userPicElement.style.backgroundImage =
        "url(" + addSizeToGoogleProfilePic(profilePicUrl) + ")";
      userNameElement.textContent = userName;

      // Show user's profile and sign-out button.
      userNameElement.removeAttribute("hidden");
      userPicElement.removeAttribute("hidden");

      // Hide sign-in button.
      signInButtonElement.setAttribute("hidden", "true");

      // We save the Firebase Messaging Device token and enable notifications.
      //saveMessagingDeviceToken();
    } else {
      // User is signed out!
      // Hide user's profile and sign-out button.
      userNameElement.setAttribute("hidden", "true");
      userPicElement.setAttribute("hidden", "true");

      // Show sign-in button.
      signInButtonElement.removeAttribute("hidden");
    }
  }
  // Adds a size to Google Profile pics URLs.
  function addSizeToGoogleProfilePic(url) {
    if (
      url.indexOf("googleusercontent.com") !== -1 &&
      url.indexOf("?") === -1
    ) {
      return url + "?sz=150";
    }
    return url;
  }
  async function logIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    // const provider = new GoogleAuthProvider();
    // console.log(provider);
    // await signInWithPopup(getAuth(), provider);
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
            console.log(error);
          });
      }
    } catch (err) {
      alert(err.message);
    }
    navigate("/instagram-clone");
  }
  //initFirebaseAuth();
  return (
    <div className="signUpPage">
      <div className="signUpContainer">
        <div className="signUpLogoAndTitle">
          <img src={instagramLogo} alt="Instagram Logo" className="logo"></img>
          <div>Sign Up</div>
        </div>
        <form className="addUser" onSubmit={signUpUser}>
          <label htmlFor="addUser"></label>
          <input
            type="text"
            name="addUser"
            placeholder="Username"
            minLength="3"
            maxLength="20"
          ></input>
          <button type="submit" className="submitScoreButton">
            Sign Up With Google
          </button>
        </form>
        <div className="alreadySignedUpContainer">
          <div>Aready Signed Up?</div>
          <button className="logIn" onClick={logIn}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
