import instagramLogo from "../images/instagram-logo.jpeg";
import { AiFillHome, AiOutlineHeart } from "react-icons/ai";
import { BsChat, BsPlusSquare } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

function NavBar(props) {
  const { setCurrentCoverPhoto, setCurrentProfilePicture } = props;
  const [profileOptionsMenu, setProfileOptionsMenu] = useState("");
  const [toggleProfileOptionsMenu, setToggleProfileOptionsMenu] =
    useState(false);

  let location = useLocation();
  const navigate = useNavigate();

  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  useEffect(() => {
    if (isUserSignedIn()) {
      if (location.pathname === `/profile/${getAuth().currentUser.uid}`) {
        const profilePicture = document.querySelector(".profileInfoLeft").children[0];
        if (profilePicture) {
          profilePicture.className = "profilePagePic"
        }
        const coverPhoto = document.querySelector(".profileCoverPhotoContainer").children[0];
        if (coverPhoto) {
        coverPhoto.className = "profileCoverPhoto";
        }
        
      } else if (location.pathname === "/settings") {
        const profilePicture = document.querySelector(".settingsProfilePic")
          .children[0];
          if (profilePicture) {
        profilePicture.className = "settingsProfilePic";
          }
          const coverPhoto = document.querySelector(".settingsCoverPhotoSmall").children[0];
        if (coverPhoto) {
        coverPhoto.className = "settingsCoverPhoto";
        }
      } else if (location.pathname === "/instagram-clone") {
        const profilePicture =
          document.querySelector(".pictureAndName").children[0];
          if (profilePicture) {
        profilePicture.className = "homepageProfilePic";
          }
      }
    }
  }, [location, isUserSignedIn]);
  // Returns true if a user is signed-in.
  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  const profileOptions = () => {
    if (!toggleProfileOptionsMenu && isUserSignedIn()) {
      setProfileOptionsMenu(
        <div className="profileOptionsMenu">
          <Link to={`/profile/${getAuth().currentUser.uid}`}>
            <div className="navBarProfileButton">Profile</div>
          </Link>
          <div className="logOutButton" onClick={logUserOut}>
            Log Out
          </div>
        </div>
      );
      setToggleProfileOptionsMenu(true);
    } else if (!toggleProfileOptionsMenu && isUserSignedIn() === false) {
      setProfileOptionsMenu(
        <div className="profileOptionsMenu">
          <Link to="/sign-up">
            <div className="signUpButtonNavBar">Sign Up</div>
          </Link>
        </div>
      );
      setToggleProfileOptionsMenu(true);
    } else {
      setProfileOptionsMenu("");
      setToggleProfileOptionsMenu(false);
    }
  };

  const logUserOut = () => {
    // Sign out of Firebase.
    signOut(getAuth());
    navigate("/instagram-clone")

  };

  return (
    <nav className="homeNav">
      <div className="homeNavContainer">
        <Link to="/instagram-clone">
          <div className="logoAndInstagramTitle">
            <img
              className="logo"
              src={instagramLogo}
              alt="Instagram Logo"
            ></img>
            <div className="instagramTitle">Instagram</div>
          </div>
        </Link>
        <label htmlFor="search"></label>
        <input
          type="text"
          name="search"
          placeholder="Search"
          maxLength="30"
        ></input>
        <div className="navBarIcons">
          <Link to="/instagram-clone">
            <div className="homeIcon">{<AiFillHome />}</div>
          </Link>
          <div className="messageIcon">{<BsChat />}</div>
          <div className="addPostIcon">{<BsPlusSquare />}</div>
          <div className="notificationsIcon">{<AiOutlineHeart />}</div>
          <div className="profileIcon" onClick={profileOptions}>
            {<FaRegUserCircle />}
            {profileOptionsMenu}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
