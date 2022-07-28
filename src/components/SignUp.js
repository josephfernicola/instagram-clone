import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
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
import { useNavigate } from "react-router-dom";
import coverPhoto from "../images/default-cover-photo.jpg";

function SignUp(props) {
  const { setHomePageSidebar, username, setUsername } = props;
  
  const navigate = useNavigate();

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
          await setDoc(doc(db, "users", getAuth().currentUser.email), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            username: e.target.children[1].value,
            photoURL: user.photoURL,
            followers: [],
            following: [],
            bio: "",
            posts: [],
            coverPhoto: coverPhoto
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
            console.log(error);
          });
      }
    } catch (err) {
      alert(err.message);
    }
    navigate("/instagram-clone");
  }

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
